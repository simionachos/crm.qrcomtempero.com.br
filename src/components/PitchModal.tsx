import React, { useState } from 'react';
import { RouteLead } from '../types';
import { audioTts } from '../utils/audioTts';
import { X, Volume2, VolumeX, Copy, Check, Bot } from 'lucide-react';
import { WhatsAppIcon, WHATSAPP_PALETTE } from './WhatsAppIcon';

interface PitchModalProps {
  lead: RouteLead;
  isOpen: boolean;
  onClose: () => void;
  onOpenAiCoach?: (lead: RouteLead) => void;
}

export const PitchModal: React.FC<PitchModalProps> = ({ lead, isOpen, onClose, onOpenAiCoach }) => {
  if (!isOpen) return null;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handlePlayBriefing = () => {
    if (isSpeaking) {
      audioTts.stop();
      setIsSpeaking(false);
    } else {
      const briefingText = `Parada ${lead.order}: ${lead.name}. Procure por ${lead.targetContact}. Horário: ${lead.bestTime}. Na recepção diga: ${lead.pitchTips.gatekeeper}.`;
      setIsSpeaking(true);
      audioTts.speak(briefingText, () => setIsSpeaking(false));
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl border-2 border-black max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 flex items-center justify-between bg-black text-white">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
              PITCH & BALCÃO • PARADA {lead.order}
            </span>
            <h3 className="text-base font-black text-white mt-0.5 leading-snug">{lead.name}</h3>
            <p className="text-xs text-zinc-300">Contato: <strong>{lead.targetContact}</strong></p>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePlayBriefing}
              className={`w-10 h-10 rounded-xl border flex items-center justify-center transition active:scale-90 ${
                isSpeaking
                  ? 'bg-white text-black border-white animate-pulse'
                  : 'bg-zinc-900 border-zinc-800 text-white hover:bg-zinc-800'
              }`}
              title="Ouvir briefing nos fones"
            >
              {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
            <button
              onClick={() => {
                audioTts.stop();
                onClose();
              }}
              className="w-10 h-10 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white flex items-center justify-center transition active:scale-90"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Conteúdo Monocromático de Alto Contraste */}
        <div className="p-4 overflow-y-auto space-y-3.5">
          {/* Botão IA OpenRouter Especializado */}
          {onOpenAiCoach && (
            <button
              onClick={() => {
                onClose();
                onOpenAiCoach(lead);
              }}
              className="w-full h-11 rounded-2xl bg-zinc-900 hover:bg-black text-white font-mono font-bold text-xs flex items-center justify-center gap-2 transition active:scale-98 shadow-xs"
            >
              <Bot className="w-4 h-4 text-white" />
              <span>Personalizar Argumento com IA OpenRouter</span>
            </button>
          )}

          {/* Histórico Anterior */}
          {lead.contactHistory && (
            <div
              className={`p-3 rounded-2xl border text-xs space-y-1.5 ${
                lead.contactHistory.toLowerCase().includes('whatsapp')
                  ? 'border-emerald-300/60'
                  : 'bg-zinc-100 border-zinc-200'
              }`}
              style={
                lead.contactHistory.toLowerCase().includes('whatsapp')
                  ? { backgroundColor: WHATSAPP_PALETTE.bg }
                  : undefined
              }
            >
              <div className="flex items-center justify-between">
                <div
                  className="text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1"
                  style={
                    lead.contactHistory.toLowerCase().includes('whatsapp')
                      ? { color: WHATSAPP_PALETTE.darkTeal }
                      : undefined
                  }
                >
                  {lead.contactHistory.toLowerCase().includes('whatsapp') && (
                    <WhatsAppIcon size={12} fill={WHATSAPP_PALETTE.darkTeal} />
                  )}
                  <span>HISTÓRICO DE CONTATO (COLUNA O)</span>
                </div>

                {lead.contactHistory.toLowerCase().includes('whatsapp') && (
                  <a
                    href={
                      lead.whatsapp || lead.phone
                        ? `https://wa.me/${(lead.whatsapp || lead.phone || '').replace(/[^0-9]/g, '')}`
                        : 'https://wa.me/'
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ backgroundColor: WHATSAPP_PALETTE.green }}
                    className="h-6 px-2 rounded-lg text-[10px] font-mono font-bold text-white flex items-center gap-1 shadow-2xs hover:opacity-90 transition active:scale-90"
                  >
                    <WhatsAppIcon size={11} fill="#FFFFFF" />
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>

              <div
                className="p-2.5 rounded-xl text-xs leading-relaxed font-medium"
                style={
                  lead.contactHistory.toLowerCase().includes('whatsapp')
                    ? { backgroundColor: WHATSAPP_PALETTE.bubble, color: WHATSAPP_PALETTE.darkTeal }
                    : undefined
                }
              >
                <p className="whitespace-pre-wrap">{lead.contactHistory}</p>
              </div>
            </div>
          )}

          {/* Abordagem no Balcão */}
          <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-300 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-black">
                1. O QUE FALAR NO BALCÃO / RECEPÇÃO
              </span>
              <button
                onClick={() => handleCopy(lead.pitchTips.gatekeeper, 'gatekeeper')}
                className="h-8 px-2.5 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-100 text-[10px] font-mono font-bold text-black flex items-center gap-1 transition active:scale-90"
              >
                {copiedKey === 'gatekeeper' ? <Check className="w-3 h-3 text-black" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'gatekeeper' ? 'COPIADO' : 'COPIAR'}</span>
              </button>
            </div>
            <p className="text-xs text-black italic bg-white p-3 rounded-xl border border-zinc-200 leading-relaxed">
              "{lead.pitchTips.gatekeeper}"
            </p>
          </div>

          {/* Pitch com o Decisor */}
          <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-300 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-black">
                2. PITCH COM {lead.targetContact.toUpperCase()}
              </span>
              <button
                onClick={() => handleCopy(lead.pitchTips.decisionMakerPitch, 'pitch')}
                className="h-8 px-2.5 rounded-lg border border-zinc-300 bg-white hover:bg-zinc-100 text-[10px] font-mono font-bold text-black flex items-center gap-1 transition active:scale-90"
              >
                {copiedKey === 'pitch' ? <Check className="w-3 h-3 text-black" /> : <Copy className="w-3 h-3" />}
                <span>{copiedKey === 'pitch' ? 'COPIADO' : 'COPIAR'}</span>
              </button>
            </div>
            <p className="text-xs text-black bg-white p-3 rounded-xl border border-zinc-200 leading-relaxed font-medium">
              "{lead.pitchTips.decisionMakerPitch}"
            </p>
          </div>

          {/* Objeções Rápidas */}
          <div className="p-3.5 bg-zinc-100 rounded-2xl border border-zinc-200 space-y-2 text-xs">
            <div className="text-[10px] font-mono font-bold uppercase text-zinc-500">
              RESPOSTAS DIRETAS A OBJEÇÕES
            </div>

            <div className="p-2.5 bg-white rounded-xl border border-zinc-200">
              <div className="font-bold text-black">"Ele não está no momento":</div>
              <p className="text-zinc-600 mt-0.5">
                👉 <em>"Sem problemas! Fui orientado a vir nessa janela. Qual horário que ele costuma estar para eu retornar hoje?"</em>
              </p>
            </div>

            <div className="p-2.5 bg-white rounded-xl border border-zinc-200">
              <div className="font-bold text-black">"Deixe um cartão ou apresentação":</div>
              <p className="text-zinc-600 mt-0.5">
                👉 <em>"Claro! Como estou na calçada, levo só 60 segundos com o {lead.targetContact} para alinhar o objetivo. Se não fizer sentido, não insisto."</em>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-zinc-200 bg-zinc-50">
          <button
            onClick={() => {
              audioTts.stop();
              onClose();
            }}
            className="w-full h-12 rounded-2xl bg-black text-white font-bold text-xs hover:bg-zinc-800 transition active:scale-95"
          >
            Fechar Cheat-Sheet
          </button>
        </div>
      </div>
    </div>
  );
};
