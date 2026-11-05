import { getStoredAuth } from './auth';
import { RouteLead, VisitLog } from '../types';

export interface OpenRouterModel {
  id: string;
  name: string;
  tier: 'auto' | 'free' | 'cheap' | 'smart';
  description: string;
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function checkOpenRouterStatus(): Promise<{ configured: boolean; models: OpenRouterModel[] }> {
  try {
    const res = await fetch('/api/openrouter/models');
    if (!res.ok) return { configured: false, models: [] };
    const data = await res.json();
    return data;
  } catch {
    return { configured: false, models: [] };
  }
}

export async function askOpenRouter(
  messages: ChatMessage[],
  model: string = 'openrouter/auto'
): Promise<{ reply: string; model: string; error?: string }> {
  const auth = getStoredAuth();
  if (!auth?.token) {
    return { reply: '', model, error: 'Sessão expirada. Faça login novamente.' };
  }

  try {
    const res = await fetch('/api/openrouter/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      body: JSON.stringify({
        messages,
        model
      })
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      return {
        reply: '',
        model,
        error: data.error || 'Erro ao processar consulta com o modelo OpenRouter.'
      };
    }

    return {
      reply: data.reply,
      model: data.model || model
    };
  } catch (err: any) {
    return {
      reply: '',
      model,
      error: 'Falha de conexão com a API: ' + (err.message || 'Erro de rede')
    };
  }
}

/**
 * Prompt de sistema especializado para o SDR de rua em São Paulo
 */
export function buildSdrSystemPrompt(lead?: RouteLead): string {
  let prompt = `Você é um Copiloto e Treinador de Vendas de Campo (SDR Coach) especializado em prospecção presencial de restaurantes, bares e padarias em São Paulo (Zona Sul: Santo Amaro, Brooklin, Campo Belo, Moema, Vila Olímpia e Vila Mariana).
Sua missão é dar respostas ULTRA OBJETIVAS, práticas, diretas e prontas para o SDR falar no balcão ou no WhatsApp.
Evite introduções longas ou floreios. O SDR está na calçada, no meio da rua, precisando de respostas em balas rápidas.`;

  if (lead) {
    prompt += `\n\nCONTEXTO DO CLIENTE ATUAL NA ROTA:
- Estabelecimento: ${lead.name} (${lead.category})
- Endereço: ${lead.address}
- Pessoa a procurar: ${lead.targetContact}
- Janela informada: ${lead.bestTime}
- Histórico anterior: ${lead.contactHistory}
- Dica de abordagem: ${lead.pitchTips.gatekeeper}`;
  }

  return prompt;
}
