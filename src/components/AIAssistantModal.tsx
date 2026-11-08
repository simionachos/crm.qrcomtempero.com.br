import React, { useState, useEffect, useRef } from 'react';
import { RouteLead } from '../types';
import {
  askOpenRouter,
  checkOpenRouterStatus,
  buildSdrSystemPrompt,
  OpenRouterModel,
  ChatMessage
} from '../utils/openrouter';
import { audioTts } from '../utils/audioTts';
import {
  X,
  Send,
  Sparkles,
  Bot,
  Volume2,
  VolumeX,
  KeyRound,
  RotateCcw,
  Copy,
  Check,
  Zap,
  ArrowRight
} from 'lucide-react';
import { WhatsAppIcon, WHATSAPP_PALETTE } from './WhatsAppIcon';

interface AIAssistantModalProps {
  lead?: RouteLead;
  isOpen: boolean;
  onClose: () => void;
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  lead,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  const [models, setModels] = useState<OpenRouterModel[]>([]);
  const [isConfigured, setIsConfigured] = useState(true);
  const [selectedModel, setSelectedModel] = useState<string>('openrouter/auto');
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Inicializar modelos e primeira mensagem de boas-vindas contextualizada
  useEffect(() => {
    const init = async () => {
      const status = await checkOpenRouterStatus();
      setIsConfigured(status.configured);
      if (status.models && status.models.length > 0) {
        setModels(status.models);
      }
    };
    init();

    // Mensagem inicial de recepção
    const welcomeText = lead
      ? `Olá! Sou seu copiloto de prospecção via OpenRouter para a parada #${lead.order} (${lead.name}). Você vai falar com ${lead.targetContact}. Qual é o desafio no balcão agora?`
      : `Olá! Sou seu copiloto de prospecção comercial via OpenRouter. Como posso ajudar com sua rota ou abordagem agora?`;

    setMessages([
      {
        role: 'assistant',
        content: welcomeText
      }
    ]);
  }, [lead]);

  // Rolar até o fim ao receber nova mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    setInputMessage('');
    setErrorMessage(null);

    const userMsg: ChatMessage = { role: 'user', content: text };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setIsLoading(true);

    // Constrói lista completa com o System Prompt
    const fullConversation: ChatMessage[] = [
      { role: 'system', content: buildSdrSystemPrompt(lead) },
      ...newHistory
    ];

    try {
      const result = await askOpenRouter(fullConversation, selectedModel);
      if (result.error) {
        setErrorMessage(result.error);
      } else if (result.reply) {
        setMessages(prev => [
          ...prev,
          { role: 'assistant', content: result.reply }
        ]);
      }
    } catch {
      setErrorMessage('Erro ao conectar com a API OpenRouter.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSpeakText = (text: string) => {
    if (isSpeaking) {
      audioTts.stop();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      audioTts.speak(text, () => setIsSpeaking(false));
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Pílulas de prompts rápidos de rua
  const quickPrompts = [
    lead ? `Como contornar se disserem que o ${lead.targetContact.split(' ')[0]} está ocupado?` : "Como contornar 'ele está ocupado'?",
    lead ? `Gancho de 10 segundos para o ${lead.targetContact.split(' ')[0]}` : "Gancho de 10 segundos no balcão",
    "Mensagem de WhatsApp para enviar após a visita",
    "3 perguntas rápidas para qualificar o restaurante"
  ];

  return (
    <div className="fixed inset-0 z-[2000] bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl border-2 border-black h-[92vh] max-h-[800px] flex flex-col overflow-hidden shadow-2xl">
        {/* Header Monocromático */}
        <div className="p-3.5 border-b border-zinc-200 bg-black text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-black tracking-tight leading-none">
                  OpenRouter SDR Coach
                </span>
                <span className="text-[9px] font-mono font-bold bg-zinc-800 text-zinc-300 px-1.5 py-0.2 rounded">
                  LLM
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 font-mono mt-0.5 truncate max-w-[200px]">
                {lead ? `Contexto: ${lead.name} (${lead.targetContact})` : 'Assistente Geral de Prospecção'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                setMessages([
                  {
                    role: 'assistant',
                    content: lead
                      ? `Contexto reiniciado para ${lead.name}. O que deseja planejar com o ${lead.targetContact}?`
                      : 'Contexto reiniciado. Em que posso ajudar?'
                  }
                ]);
              }}
              className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white flex items-center justify-center transition active:scale-90"
              title="Reiniciar conversa"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                audioTts.stop();
                onClose();
              }}
              className="w-8 h-8 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white flex items-center justify-center transition active:scale-90"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Seletor de Modelos OpenRouter */}
        <div className="px-3 py-2 bg-zinc-100 border-b border-zinc-200 shrink-0 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <Sparkles className="w-3.5 h-3.5 text-black shrink-0" />
            <span className="text-[10px] font-mono font-bold uppercase text-zinc-600 shrink-0">
              Modelo:
            </span>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-white border border-zinc-300 text-black text-xs font-mono font-medium rounded-lg px-2 py-1 focus:outline-none focus:border-black max-w-[220px] truncate"
            >
              <option value="openrouter/auto">openrouter/auto (Auto inteligente)</option>
              <option value="meta-llama/llama-3.3-70b-instruct:free">Llama 3.3 70B (Gratuito)</option>
              <option value="google/gemini-2.0-flash-exp:free">Gemini 2.0 Flash (Gratuito)</option>
              <option value="deepseek/deepseek-r1:free">DeepSeek R1 (Gratuito)</option>
              <option value="mistralai/mistral-small-3.2-24b-instruct:free">Mistral Small 24B (Gratuito)</option>
              <option value="anthropic/claude-3.5-haiku">Claude 3.5 Haiku (Econômico)</option>
              <option value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet (Avançado)</option>
            </select>
          </div>

          <span className="text-[9px] font-mono text-zinc-500 uppercase shrink-0">
            {selectedModel.includes(':free') ? 'Tier Grátis' : selectedModel === 'openrouter/auto' ? 'Auto Custo' : 'Premium'}
          </span>
        </div>

        {/* Alerta de chave se não configurada */}
        {!isConfigured && (
          <div className="p-3 bg-zinc-900 text-white text-xs font-mono flex items-start gap-2.5 shrink-0 border-b border-zinc-800">
            <KeyRound className="w-4 h-4 text-zinc-300 shrink-0 mt-0.5" />
            <div className="leading-tight text-[11px]">
              <strong>Configurar OPENROUTER_API_KEY:</strong> Adicione sua chave no painel de <strong>Secrets</strong> do AI Studio para ativar as chamadas ao vivo.
            </div>
          </div>
        )}

        {/* Lista de Mensagens */}
        <div className="flex-1 p-3.5 overflow-y-auto space-y-3 font-sans">
          {messages.map((msg, idx) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={idx}
                className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
              >
                <div
                  className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                    isUser
                      ? 'bg-black text-white rounded-br-xs font-medium'
                      : 'bg-zinc-100 text-black border border-zinc-200 rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>

                {!isUser && (
                  <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-mono px-1">
                    <button
                      onClick={() => handleCopy(msg.content, idx)}
                      className="hover:text-black flex items-center gap-1 transition"
                    >
                      {copiedIndex === idx ? <Check className="w-3 h-3 text-black" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedIndex === idx ? 'Copiado' : 'Copiar'}</span>
                    </button>
                    <span>•</span>
                    <button
                      onClick={() => handleSpeakText(msg.content)}
                      className="hover:text-black flex items-center gap-1 transition"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Ouvir</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2 p-3 bg-zinc-100 rounded-2xl w-fit border border-zinc-200">
              <span className="w-2 h-2 rounded-full bg-black animate-ping" />
              <span className="text-xs font-mono font-medium text-zinc-600">
                Consultando OpenRouter ({selectedModel.split('/')[1] || selectedModel})...
              </span>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-zinc-100 border border-zinc-300 rounded-xl text-xs text-black font-mono">
              ⚠️ {errorMessage}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Pílulas de Perguntas Rápidas */}
        <div className="px-3 py-1.5 border-t border-zinc-100 bg-zinc-50 shrink-0 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {quickPrompts.map((prompt, i) => {
            const isWhatsApp = prompt.includes('WhatsApp');
            return (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                disabled={isLoading}
                style={
                  isWhatsApp
                    ? { backgroundColor: WHATSAPP_PALETTE.bubble, color: WHATSAPP_PALETTE.darkTeal, borderColor: '#a7f3d0' }
                    : undefined
                }
                className={`h-8 px-2.5 rounded-lg border text-[11px] font-medium whitespace-nowrap transition active:scale-95 disabled:opacity-50 flex items-center gap-1 shrink-0 ${
                  isWhatsApp
                    ? 'font-bold shadow-2xs hover:opacity-90'
                    : 'border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-800'
                }`}
              >
                {isWhatsApp && <WhatsAppIcon size={12} fill={WHATSAPP_PALETTE.darkTeal} />}
                <span>{prompt}</span>
              </button>
            );
          })}
        </div>

        {/* Campo de Envio Touch Friendly */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="p-3 border-t border-zinc-200 bg-white shrink-0 flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Digite ou faça uma pergunta sobre a abordagem..."
            disabled={isLoading}
            className="flex-1 h-12 px-3.5 rounded-xl border border-zinc-300 text-xs font-medium focus:outline-none focus:border-black"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="w-12 h-12 rounded-xl bg-black text-white hover:bg-zinc-800 disabled:bg-zinc-200 disabled:text-zinc-400 flex items-center justify-center transition active:scale-95 shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
