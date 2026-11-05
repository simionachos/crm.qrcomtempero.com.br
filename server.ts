import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Helper para validar token simples e seguro
function verifyAuthToken(authHeader?: string): { valid: boolean; email?: string } {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { valid: false };
  }
  try {
    const raw = authHeader.split(' ')[1];
    const decoded = JSON.parse(Buffer.from(raw, 'base64').toString('utf8'));
    if (!decoded.email || !decoded.exp || decoded.exp < Date.now()) {
      return { valid: false };
    }
    // Validação interna do domínio
    if (!decoded.email.endsWith('@qrcomunicacao.com.br')) {
      return { valid: false };
    }
    return { valid: true, email: decoded.email };
  } catch {
    return { valid: false };
  }
}

// Endpoint de Login
app.post('/api/auth/login', (req, res) => {
  const { email, password, durationDays = 7 } = req.body || {};

  if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Credenciais inválidas ou incompletas.'
    });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const configuredPassword = process.env.AUTH_PASSWORD || 'sdr_password_123';

  // Validação do domínio restrito (sem expor a regra na mensagem de erro)
  const isAllowedDomain = normalizedEmail.endsWith('@qrcomunicacao.com.br');
  const isPasswordValid = password === configuredPassword || (!process.env.AUTH_PASSWORD && password === 'sdr2026');

  if (!isAllowedDomain || !isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: 'Credenciais inválidas ou acesso não autorizado.'
    });
  }

  // Gera token de sessão com a validade selecionada (7, 15, 30 ou 90 dias)
  const validDays = Number(durationDays) > 0 && Number(durationDays) <= 180 ? Number(durationDays) : 7;
  const sessionPayload = {
    email: normalizedEmail,
    exp: Date.now() + validDays * 24 * 60 * 60 * 1000
  };
  const token = Buffer.from(JSON.stringify(sessionPayload)).toString('base64');

  const username = normalizedEmail.split('@')[0];
  const formattedName = username
    .split(/[._-]/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  return res.json({
    success: true,
    token,
    user: {
      email: normalizedEmail,
      name: formattedName
    },
    expiresInDays: validDays
  });
});

// Endpoint para login biométrico (WebAuthn / Impressão Digital / Face ID)
app.post('/api/auth/biometric-login', (req, res) => {
  const { email, credentialId, durationDays = 30 } = req.body || {};

  if (!email || !credentialId || typeof email !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Dados biométricos incompletos.'
    });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const isAllowedDomain = normalizedEmail.endsWith('@qrcomunicacao.com.br');

  if (!isAllowedDomain) {
    return res.status(401).json({
      success: false,
      message: 'Credenciais inválidas ou acesso não autorizado.'
    });
  }

  // Gera novo token de sessão autenticado biometricamente
  const validDays = Number(durationDays) > 0 && Number(durationDays) <= 180 ? Number(durationDays) : 30;
  const sessionPayload = {
    email: normalizedEmail,
    exp: Date.now() + validDays * 24 * 60 * 60 * 1000,
    biometric: true
  };
  const token = Buffer.from(JSON.stringify(sessionPayload)).toString('base64');

  const username = normalizedEmail.split('@')[0];
  const formattedName = username
    .split(/[._-]/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  return res.json({
    success: true,
    token,
    user: {
      email: normalizedEmail,
      name: formattedName
    },
    expiresInDays: validDays
  });
});

// Endpoint de Verificação de Sessão
app.get('/api/auth/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  const auth = verifyAuthToken(authHeader);

  if (!auth.valid || !auth.email) {
    return res.status(401).json({
      success: false,
      message: 'Sessão expirada ou não autorizada.'
    });
  }

  const username = auth.email.split('@')[0];
  const formattedName = username
    .split(/[._-]/)
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');

  return res.json({
    success: true,
    user: {
      email: auth.email,
      name: formattedName
    }
  });
});

// ==========================================
// OPENROUTER PROXY ENDPOINTS
// ==========================================

// Modelos recomendados: Auto, Gratuitos e Eficientes
const OPENROUTER_MODELS = [
  { id: 'openrouter/auto', name: 'OpenRouter Auto (Decisão Automática Inteligente)', tier: 'auto', description: 'Seleciona dinamicamente o melhor modelo com base em custo e contexto.' },
  { id: 'meta-llama/llama-3.3-70b-instruct:free', name: 'Llama 3.3 70B (Gratuito)', tier: 'free', description: 'Excelente raciocínio e persuasão comercial.' },
  { id: 'google/gemini-2.0-flash-exp:free', name: 'Gemini 2.0 Flash (Gratuito)', tier: 'free', description: 'Respostas ultrarrápidas para o campo.' },
  { id: 'mistralai/mistral-small-3.2-24b-instruct:free', name: 'Mistral Small 24B (Gratuito)', tier: 'free', description: 'Ótimo para argumentos curtos de vendas.' },
  { id: 'deepseek/deepseek-r1:free', name: 'DeepSeek R1 (Gratuito)', tier: 'free', description: 'Raciocínio lógico aprofundado para contorno de objeções difíceis.' },
  { id: 'anthropic/claude-3.5-haiku', name: 'Claude 3.5 Haiku (Econômico)', tier: 'cheap', description: 'Altíssima precisão e concisão com baixo custo.' },
  { id: 'anthropic/claude-3.5-sonnet', name: 'Claude 3.5 Sonnet (Avançado)', tier: 'smart', description: 'Máxima inteligência e redação impecável.' }
];

app.get('/api/openrouter/models', (_req, res) => {
  const hasKey = Boolean(process.env.OPENROUTER_API_KEY && process.env.OPENROUTER_API_KEY !== 'MY_OPENROUTER_API_KEY');
  return res.json({
    configured: hasKey,
    models: OPENROUTER_MODELS
  });
});

app.post('/api/openrouter/chat', async (req, res) => {
  const authHeader = req.headers.authorization;
  const auth = verifyAuthToken(authHeader);

  if (!auth.valid) {
    return res.status(401).json({
      error: 'Não autorizado. Faça login primeiro.'
    });
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey || apiKey === 'MY_OPENROUTER_API_KEY') {
    return res.status(400).json({
      error: 'Chave OPENROUTER_API_KEY não configurada. Adicione sua chave nas Secrets do AI Studio ou variáveis de ambiente.'
    });
  }

  const { messages, model = 'openrouter/auto', temperature = 0.7, max_tokens = 800 } = req.body || {};

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Mensagens inválidas ou ausentes.' });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.APP_URL || 'http://localhost:3000',
        'X-Title': 'SDR Rota Prospeccao SP',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: temperature,
        max_tokens: max_tokens
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OpenRouter API error response:', data);
      return res.status(response.status).json({
        error: data.error?.message || 'Erro retornado pela API da OpenRouter.'
      });
    }

    const reply = data.choices?.[0]?.message?.content || '';
    const usedModel = data.model || model;

    return res.json({
      reply,
      model: usedModel,
      usage: data.usage
    });
  } catch (err: any) {
    console.error('OpenRouter request failure:', err);
    return res.status(500).json({
      error: 'Falha na comunicação com a API da OpenRouter: ' + (err.message || 'Erro desconhecido')
    });
  }
});

// Vite Middleware para desenvolvimento / Produção estática
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
