import React, { useState } from 'react';
import { RouteLead, VisitLog, VisitStatus } from '../types';
import { checkLeadTimeWindow } from '../utils/timeHelpers';
import { audioTts } from '../utils/audioTts';
import {
  Navigation,
  MessageSquare,
  Volume2,
  VolumeX,
  Sparkles,
  CheckCircle2,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Train,
  Check,
  Bot
} from 'lucide-react';

interface RouteViewProps {
  leads: RouteLead[];
  activeLeadId: number;
  onSelectLead: (id: number) => void;
  leadStatuses: Record<number, VisitStatus>;
  visits: VisitLog[];
  onOpenCheckIn: (lead: RouteLead) => void;
  onOpenPitch: (lead: RouteLead) => void;
  onOpenAiCoach: (lead: RouteLead) => void;
}

export const RouteView: React.FC<RouteViewProps> = ({
  leads,
  activeLeadId,
  onSelectLead,
  leadStatuses,
  visits,
  onOpenCheckIn,
  onOpenPitch,
  onOpenAiCoach
}) => {
  const [isSpeakingId, setIsSpeakingId] = useState<number | null>(null);
  const [copiedAddr, setCopiedAddr] = useState(false);

  const activeLead = leads.find(l => l.id === activeLeadId) || leads[0];
  const activeStatus = leadStatuses[activeLead.id] || 'pending';
  const activeVisit = visits.find(v => v.leadId === activeLead.id);
  const timeCheck = checkLeadTimeWindow(activeLead.bestTime);

  const handleSpeak = (lead: RouteLead) => {
    if (isSpeakingId === lead.id) {
      audioTts.stop();
      setIsSpeakingId(null);
    } else {
      setIsSpeakingId(lead.id);
      const text = `Parada ${lead.order}: ${lead.name}. Endereço: ${lead.address}. Procure por: ${lead.targetContact}. Horário: ${lead.bestTime}. Dica: ${lead.bestTimeNote}`;
      audioTts.speak(text, () => setIsSpeakingId(null));
    }
  };

  const handlePrev = () => {
    if (activeLeadId > 1) {
      onSelectLead(activeLeadId - 1);
    }
  };

  const handleNext = () => {
    if (activeLeadId < leads.length) {
      onSelectLead(activeLeadId + 1);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(activeLead.address);
    setCopiedAddr(true);
    setTimeout(() => setCopiedAddr(false), 2000);
  };

  const getWhatsAppUrl = (lead: RouteLead) => {
    const text = `Olá ${lead.targetContact.split(' ')[0]}, tudo bem? Sou da equipe de expansão comercial e estou aqui na região do ${lead.name}. Gostaria de bater um papo rápido de 2 minutos hoje.`;
    const num = lead.whatsapp || lead.phone?.replace(/[^0-9]/g, '');
    if (num) {
      return `https://wa.me/${num}?text=${encodeURIComponent(text)}`;
    }
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  const getStatusText = (status: VisitStatus) => {
    switch (status) {
      case 'scheduled':
        return 'REUNIÃO MARCADA';
      case 'in_progress':
        return 'EM NEGOCIAÇÃO';
      case 'return_later':
        return 'RETORNAR DEPOIS';
      case 'absent':
        return 'AUSENTE / RECADO';
      case 'not_interested':
        return 'SEM INTERESSE';
      default:
        return 'PENDENTE';
    }
  };

  return (
    <div className="space-y-4 max-w-md mx-auto">
      {/* ======================================================== */}
      {/* CONTROLES DE NAVEGAÇÃO DE PARADA ANTERIOR / PRÓXIMA     */}
      {/* ======================================================== */}
      <div className="flex items-center justify-between text-xs font-mono font-bold text-zinc-900 px-1">
        <button
          onClick={handlePrev}
          disabled={activeLeadId === 1}
          className="h-10 px-3 rounded-xl border border-zinc-300 bg-white hover:bg-zinc-100 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 transition active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Anterior</span>
        </button>

        <span className="text-zinc-500 uppercase tracking-wider text-[11px]">
          PARADA {activeLead.order} DE {leads.length}
        </span>

        <button
          onClick={handleNext}
          disabled={activeLeadId === leads.length}
          className="h-10 px-3 rounded-xl border border-zinc-300 bg-white hover:bg-zinc-100 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 transition active:scale-95"
        >
          <span>Próxima</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* ======================================================== */}
      {/* CARD PRINCIPAL DA PARADA ATIVA                           */}
      {/* ======================================================== */}
      <div className="bg-white rounded-3xl border-2 border-black p-5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] space-y-4">
        {/* Topo do Card */}
        <div className="flex items-start justify-between gap-2 border-b border-zinc-100 pb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-black text-white text-xs font-mono font-bold flex items-center justify-center">
                {activeLead.order}
              </span>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">
                {activeLead.stage.title.split(':')[0]}
              </span>
            </div>
            <h2 className="text-xl font-black text-black tracking-tight mt-1 leading-snug">
              {activeLead.name}
            </h2>
            <p className="text-xs text-zinc-500 font-medium">{activeLead.category}</p>
          </div>

          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-zinc-300 bg-zinc-100 text-zinc-900">
              {getStatusText(activeStatus)}
            </span>
            <button
              onClick={() => handleSpeak(activeLead)}
              className={`p-2 rounded-xl border transition active:scale-90 ${
                isSpeakingId === activeLead.id
                  ? 'bg-black text-white border-black'
                  : 'bg-zinc-100 text-zinc-700 border-zinc-200 hover:bg-zinc-200'
              }`}
              title="Ouvir briefing por áudio"
            >
              {isSpeakingId === activeLead.id ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Quem Procurar */}
        <div className="p-3.5 rounded-2xl bg-zinc-100 border border-zinc-200">
          <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">
            QUEM PROCURAR NO LOCAL
          </div>
          <div className="text-lg font-black text-black mt-0.5 tracking-tight">
            {activeLead.targetContact}
          </div>
          <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
            {activeLead.bestTimeNote}
          </p>
        </div>

        {/* Melhor Horário */}
        <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">
              MELHOR HORÁRIO
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded border ${timeCheck.badgeClass}`}>
              {timeCheck.badgeText}
            </span>
          </div>
          <div className="text-base font-black text-black">
            {activeLead.bestTime}
          </div>
          <p className="text-xs text-zinc-600 mt-0.5">
            {timeCheck.description}
          </p>
        </div>

        {/* Endereço & Deslocamento */}
        <div className="text-xs text-zinc-700 bg-zinc-50 p-3 rounded-2xl border border-zinc-200 flex items-start justify-between gap-2">
          <div className="flex items-start gap-1.5 flex-1">
            <MapPin className="w-4 h-4 text-black shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-black">{activeLead.address}</span>
              <div className="text-[11px] text-zinc-500 font-mono mt-0.5">
                Deslocamento: {activeLead.walkingFromPrev.distance} ({activeLead.walkingFromPrev.duration})
              </div>
            </div>
          </div>
          <button
            onClick={copyAddress}
            className="p-1.5 rounded-lg border border-zinc-300 hover:bg-zinc-200 text-zinc-700 text-[10px] font-mono font-bold transition shrink-0"
            title="Copiar endereço"
          >
            {copiedAddr ? 'COPIADO' : 'COPIAR'}
          </button>
        </div>

        {/* Dica de Metrô se houver */}
        {activeLead.metroTip && (
          <div className="p-3 rounded-2xl border border-zinc-300 bg-zinc-100 flex items-start gap-2 text-xs text-zinc-800">
            <Train className="w-4 h-4 text-black shrink-0 mt-0.5" />
            <div className="leading-snug">
              <strong className="font-bold text-black">Apoio Metrô: </strong>
              {activeLead.metroTip.advice}
            </div>
          </div>
        )}

        {/* Histórico da Última Visita Salva */}
        {activeVisit && (
          <div className="p-3 rounded-2xl bg-zinc-900 text-white text-xs space-y-1">
            <div className="flex items-center justify-between font-mono font-bold text-[11px] text-zinc-300">
              <span className="flex items-center gap-1">
                <Check className="w-3.5 h-3.5 text-white" />
                VISITA REGISTRADA
              </span>
              <span>{new Date(activeVisit.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
            {activeVisit.notes && <p className="text-zinc-200 text-xs">{activeVisit.notes}</p>}
            {activeVisit.nextFollowUpDate && (
              <p className="text-[11px] text-zinc-400 font-mono">
                Reunião: {new Date(activeVisit.nextFollowUpDate).toLocaleString('pt-BR')}
              </p>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* BOTÕES DE AÇÃO RÁPIDA                                    */}
        {/* ======================================================== */}
        <div className="pt-2 grid grid-cols-2 gap-2.5">
          {/* Navegar */}
          <a
            href={activeLead.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeLead.name + ' ' + activeLead.address)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="h-13 rounded-2xl bg-black text-white hover:bg-zinc-800 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition active:scale-95"
          >
            <Navigation className="w-4 h-4" />
            <span>Navegar GPS</span>
          </a>

          {/* WhatsApp */}
          <a
            href={getWhatsAppUrl(activeLead)}
            target="_blank"
            rel="noopener noreferrer"
            className="h-13 rounded-2xl bg-zinc-900 text-white hover:bg-black font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition active:scale-95"
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp</span>
          </a>

          {/* Pitch & Objeções */}
          <button
            onClick={() => onOpenPitch(activeLead)}
            className="h-13 rounded-2xl border-2 border-black bg-white hover:bg-zinc-100 text-black font-bold text-xs flex items-center justify-center gap-2 transition active:scale-95"
          >
            <Sparkles className="w-4 h-4" />
            <span>Pitch / Balcão</span>
          </button>

          {/* Check-in */}
          <button
            onClick={() => onOpenCheckIn(activeLead)}
            className="h-13 rounded-2xl border-2 border-black bg-white hover:bg-zinc-100 text-black font-bold text-xs flex items-center justify-center gap-2 transition active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Fazer Check-in</span>
          </button>
        </div>

        {/* Botão Copiloto IA OpenRouter Dedicado */}
        <button
          onClick={() => onOpenAiCoach(activeLead)}
          className="w-full h-12 rounded-2xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-black font-mono font-bold text-xs flex items-center justify-center gap-2 transition active:scale-98"
        >
          <Bot className="w-4 h-4 text-black" />
          <span>Consultar IA OpenRouter para {activeLead.name.split(' ')[0]}</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* LISTA COMPLETA DOS 11 LEADS                              */}
      {/* ======================================================== */}
      <div className="pt-2 space-y-2">
        <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-500 px-1">
          TODAS AS 11 PARADAS DA ROTA
        </div>

        <div className="divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-xs">
          {leads.map((lead) => {
            const isSelected = lead.id === activeLeadId;
            const status = leadStatuses[lead.id];
            const isDone = status === 'scheduled' || status === 'visited' || status === 'in_progress';

            return (
              <div
                key={lead.id}
                onClick={() => onSelectLead(lead.id)}
                className={`p-3.5 cursor-pointer transition flex items-center justify-between gap-3 active:bg-zinc-100 ${
                  isSelected ? 'bg-zinc-100 border-l-4 border-black' : 'hover:bg-zinc-50'
                }`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div
                    className={`w-7 h-7 rounded-lg text-xs font-mono font-bold flex items-center justify-center shrink-0 ${
                      isDone
                        ? 'bg-black text-white'
                        : isSelected
                        ? 'bg-black text-white ring-2 ring-zinc-400'
                        : 'bg-zinc-100 text-zinc-700 border border-zinc-300'
                    }`}
                  >
                    {isDone ? '✓' : lead.order}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-bold text-sm text-black truncate leading-tight">
                        {lead.name}
                      </h4>
                      <span className="text-[10px] font-mono text-zinc-500 shrink-0">
                        {lead.walkingFromPrev.duration}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-zinc-600 mt-0.5 truncate">
                      <span>👤 {lead.targetContact}</span>
                      <span>•</span>
                      <span className="font-mono">{lead.bestTime.split('/')[0]}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => onOpenAiCoach(lead)}
                    className="p-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100 text-zinc-600 hover:text-black transition"
                    title="Perguntar à IA OpenRouter"
                  >
                    <Bot className="w-3.5 h-3.5" />
                  </button>
                  <ChevronRight className={`w-4 h-4 shrink-0 transition ${isSelected ? 'text-black translate-x-0.5' : 'text-zinc-300'}`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
