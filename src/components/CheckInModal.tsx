import React, { useState } from 'react';
import { RouteLead, VisitLog, VisitStatus } from '../types';
import { startVoiceRecognition } from '../utils/audioTts';
import { X, Mic, MicOff, Check, Calendar } from 'lucide-react';

interface CheckInModalProps {
  lead: RouteLead;
  isOpen: boolean;
  onClose: () => void;
  onSaveVisit: (visit: VisitLog) => void;
  existingVisit?: VisitLog;
}

export const CheckInModal: React.FC<CheckInModalProps> = ({
  lead,
  isOpen,
  onClose,
  onSaveVisit,
  existingVisit
}) => {
  if (!isOpen) return null;

  const [status, setStatus] = useState<VisitStatus>(existingVisit?.status || 'scheduled');
  const [contactPerson, setContactPerson] = useState(existingVisit?.contactSpokenTo || lead.targetContact);
  const [notes, setNotes] = useState(existingVisit?.notes || '');
  const [followUpDate, setFollowUpDate] = useState(existingVisit?.nextFollowUpDate || '');
  const [isRecording, setIsRecording] = useState(false);
  const [recognitionService, setRecognitionService] = useState<{ stop: () => void } | null>(null);

  const toggleRecording = () => {
    if (isRecording) {
      if (recognitionService) {
        recognitionService.stop();
        setRecognitionService(null);
      }
      setIsRecording(false);
    } else {
      setIsRecording(true);
      const service = startVoiceRecognition(
        (transcript) => {
          setNotes((prev) => (prev ? `${prev} ${transcript}` : transcript));
        },
        () => {
          setIsRecording(false);
        },
        () => {
          setIsRecording(false);
        }
      );
      setRecognitionService(service);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (recognitionService) {
      recognitionService.stop();
    }

    const visit: VisitLog = {
      id: existingVisit?.id || `visit_${Date.now()}`,
      leadId: lead.id,
      leadName: lead.name,
      timestamp: new Date().toISOString(),
      status,
      contactSpokenTo: contactPerson,
      notes,
      nextFollowUpDate: followUpDate || undefined
    };

    onSaveVisit(visit);
    onClose();
  };

  const statusOptions: { value: VisitStatus; label: string; sub: string }[] = [
    { value: 'scheduled', label: 'Reunião Agendada', sub: 'Data e horário marcados com o decisor' },
    { value: 'in_progress', label: 'Falou com Decisor / Negociação', sub: 'Apresentou proposta, aguarda retorno' },
    { value: 'return_later', label: 'Retornar Depois', sub: 'Horário de pico ou decisor ocupado' },
    { value: 'absent', label: 'Decisor Ausente / Recado', sub: 'Deixou recado na recepção/balcão' },
    { value: 'not_interested', label: 'Sem Interesse', sub: 'Perfil não alinhado ou recusa' }
  ];

  return (
    <div className="fixed inset-0 z-[2000] bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-md sm:max-w-lg md:max-w-xl rounded-t-3xl sm:rounded-3xl border-2 border-black max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header Monocromático */}
        <div className="p-4 border-b border-zinc-200 flex items-center justify-between bg-black text-white">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
              CHECK-IN • PARADA {lead.order}
            </span>
            <h3 className="text-base font-black text-white mt-0.5 leading-snug">{lead.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white flex items-center justify-center transition active:scale-90"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulário Touch-Friendly */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-4">
          {/* Status da Visita */}
          <div>
            <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-600 mb-2">
              RESULTADO DA VISITA
            </label>
            <div className="space-y-1.5">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStatus(opt.value)}
                  className={`w-full min-h-[48px] p-3 rounded-2xl border text-left flex items-center justify-between transition active:scale-98 ${
                    status === opt.value
                      ? 'border-black bg-black text-white font-bold shadow-xs'
                      : 'border-zinc-200 bg-zinc-50 hover:bg-zinc-100 text-zinc-800'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold leading-tight">{opt.label}</div>
                    <div className={`text-[10px] ${status === opt.value ? 'text-zinc-300' : 'text-zinc-500'}`}>
                      {opt.sub}
                    </div>
                  </div>
                  {status === opt.value && <Check className="w-4 h-4 shrink-0 text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Quem atendeu */}
          <div>
            <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-600 mb-1">
              PESSOA CONTATADA
            </label>
            <input
              type="text"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              className="w-full h-12 px-3.5 rounded-xl border border-zinc-300 text-sm font-medium focus:outline-none focus:border-black"
              required
            />
          </div>

          {/* Data de Retorno / Reunião */}
          {(status === 'scheduled' || status === 'return_later') && (
            <div className="p-3 bg-zinc-100 rounded-2xl border border-zinc-300 space-y-1">
              <label className="block text-[10px] font-mono font-bold uppercase text-zinc-700 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {status === 'scheduled' ? 'DATA/HORA DA REUNIÃO' : 'DATA DE RETORNO'}
              </label>
              <input
                type="datetime-local"
                value={followUpDate}
                onChange={(e) => setFollowUpDate(e.target.value)}
                className="w-full h-11 px-3 rounded-xl border border-zinc-300 text-xs font-mono bg-white focus:outline-none focus:border-black"
              />
            </div>
          )}

          {/* Notas com Ditado por Voz */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-600">
                ANOTAÇÕES
              </label>
              <button
                type="button"
                onClick={toggleRecording}
                className={`h-9 px-3 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition active:scale-90 ${
                  isRecording
                    ? 'bg-black text-white animate-pulse'
                    : 'bg-zinc-100 hover:bg-zinc-200 text-black border border-zinc-300'
                }`}
              >
                {isRecording ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                <span>{isRecording ? 'Gravando...' : 'Gravar Voz'}</span>
              </button>
            </div>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Descreva o que foi conversado ou objecões..."
              className="w-full p-3 rounded-xl border border-zinc-300 text-xs font-medium focus:outline-none focus:border-black leading-relaxed"
            />
          </div>

          {/* Botão de Salvar (Largo e fácil de tocar) */}
          <div className="pt-1 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-13 px-4 rounded-2xl border border-zinc-300 text-zinc-700 font-bold text-xs hover:bg-zinc-100 transition active:scale-95"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 h-13 rounded-2xl bg-black text-white font-bold text-xs hover:bg-zinc-800 transition active:scale-95 flex items-center justify-center gap-1.5 shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>Salvar Check-in</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
