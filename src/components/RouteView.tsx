import React, { useState } from 'react';
import { RouteLead, VisitLog, VisitStatus, RouteMode } from '../types';
import { checkLeadTimeWindow } from '../utils/timeHelpers';
import { audioTts } from '../utils/audioTts';
import {
  STARTING_POINT,
  CONFLICT_ANALYSIS,
  ROUTE_MODE_CONFIGS
} from '../data/leadsData';
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
  Bot,
  AlertTriangle,
  Clock,
  ChevronDown,
  ChevronUp,
  Info,
  Calendar,
  Compass
} from 'lucide-react';
import { WhatsAppIcon, WHATSAPP_PALETTE } from './WhatsAppIcon';

interface RouteViewProps {
  leads: RouteLead[];
  activeLeadId: number;
  onSelectLead: (id: number) => void;
  leadStatuses: Record<number, VisitStatus>;
  visits: VisitLog[];
  onOpenCheckIn: (lead: RouteLead) => void;
  onOpenPitch: (lead: RouteLead) => void;
  onOpenAiCoach: (lead: RouteLead) => void;
  activeMode: RouteMode;
  onChangeMode: (mode: RouteMode) => void;
}

export const RouteView: React.FC<RouteViewProps> = ({
  leads,
  activeLeadId,
  onSelectLead,
  leadStatuses,
  visits,
  onOpenCheckIn,
  onOpenPitch,
  onOpenAiCoach,
  activeMode,
  onChangeMode
}) => {
  const [isSpeakingId, setIsSpeakingId] = useState<number | null>(null);
  const [copiedAddr, setCopiedAddr] = useState(false);
  const [showConflicts, setShowConflicts] = useState(false);

  const activeLead = leads.find(l => l.id === activeLeadId) || leads[0];
  const activeIndex = leads.findIndex(l => l.id === activeLead.id);
  const activeStatus = leadStatuses[activeLead.id] || 'pending';
  const activeVisit = visits.find(v => v.leadId === activeLead.id);
  const timeCheck = checkLeadTimeWindow(activeLead.bestTime);
  const currentModeConfig = ROUTE_MODE_CONFIGS[activeMode];

  const handleSpeak = (lead: RouteLead) => {
    if (isSpeakingId === lead.id) {
      audioTts.stop();
      setIsSpeakingId(null);
    } else {
      setIsSpeakingId(lead.id);
      const text = `Parada ${lead.order}: ${lead.name}. Horário recomendado: ${lead.suggestedTimeSlot || lead.bestTime}. Procure por: ${lead.targetContact}. Endereço: ${lead.address}. Dica: ${lead.bestTimeNote}`;
      audioTts.speak(text, () => setIsSpeakingId(null));
    }
  };

  const handlePrev = () => {
    if (activeIndex > 0) {
      onSelectLead(leads[activeIndex - 1].id);
    }
  };

  const handleNext = () => {
    if (activeIndex < leads.length - 1) {
      onSelectLead(leads[activeIndex + 1].id);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(activeLead.address);
    setCopiedAddr(true);
    setTimeout(() => setCopiedAddr(false), 2000);
  };

  const getWhatsAppUrl = (lead: RouteLead) => {
    const text = `Olá ${lead.targetContact.split(' ')[0]}, tudo bem? Sou da equipe de expansão comercial e estou na região do ${lead.name}. Gostaria de bater um papo rápido de 2 minutos hoje.`;
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

  // Google Maps pedestre saindo da Rua São Benedito, 1474 até o lead ativo
  const googleMapsWalkingUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(STARTING_POINT.address)}&destination=${encodeURIComponent(activeLead.address)}&travelmode=walking`;

  const renderRouteStopsList = () => (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-500 px-1">
        <span>ORDEM DESTE ROTEIRO ({leads.length} LOCAIS)</span>
        <span>{currentModeConfig.shortName}</span>
      </div>

      <div className="divide-y divide-zinc-200 rounded-3xl border border-zinc-200 bg-white overflow-hidden shadow-xs lg:max-h-[calc(100vh-280px)] lg:overflow-y-auto">
        {leads.map((lead) => {
          const isSelected = lead.id === activeLead.id;
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
                    {lead.suggestedTimeSlot && (
                      <span className="text-[10px] font-mono font-bold text-zinc-700 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200 shrink-0">
                        {lead.suggestedTimeSlot}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-zinc-600 mt-0.5 truncate">
                    <span>👤 {lead.targetContact}</span>
                    <span>•</span>
                    <span className="font-mono">{lead.walkingFromPrev.distance}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                <a
                  href={getWhatsAppUrl(lead)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ backgroundColor: WHATSAPP_PALETTE.bubble, color: WHATSAPP_PALETTE.darkTeal }}
                  className="p-1.5 rounded-lg border border-emerald-300/60 hover:opacity-90 transition active:scale-90 flex items-center justify-center shadow-2xs"
                  title="Conversar no WhatsApp"
                >
                  <WhatsAppIcon size={14} fill={WHATSAPP_PALETTE.darkTeal} />
                </a>
                <button
                  onClick={() => onOpenAiCoach(lead)}
                  className="p-1.5 rounded-lg border border-zinc-200 hover:bg-zinc-100 text-zinc-600 hover:text-black transition active:scale-90"
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
  );

  return (
    <div className="w-full pb-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
        {/* Coluna Lateral Esquerda no Desktop (Sticky) */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-3.5 lg:sticky lg:top-20">
          {/* ======================================================== */}
          {/* SELETOR DE MODO DE ROTA (MOBILE FIRST & DESKTOP)         */}
          {/* ======================================================== */}
          <div className="bg-white rounded-3xl border border-zinc-200 p-3 shadow-xs space-y-2">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-black" />
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500">
              MODO DA ROTA
            </span>
          </div>
          <span className="text-[10px] font-mono text-zinc-500">
            {leads.length} paradas • {currentModeConfig.estimatedTime}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {/* Opção A: 1 Dia Otimizado */}
          <button
            onClick={() => onChangeMode('one_day_optimized')}
            className={`p-2.5 rounded-2xl text-left border transition active:scale-95 flex flex-col justify-between ${
              activeMode === 'one_day_optimized'
                ? 'bg-black text-white border-black shadow-xs'
                : 'bg-zinc-50 text-zinc-800 border-zinc-200 hover:bg-zinc-100'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700">
                Opção A
              </span>
              <span className="text-[10px] font-mono font-bold">9 paradas</span>
            </div>
            <div className="mt-1">
              <div className="text-xs font-black tracking-tight leading-tight">
                1 Dia Otimizado
              </div>
              <div className={`text-[10px] leading-tight mt-0.5 ${activeMode === 'one_day_optimized' ? 'text-zinc-300' : 'text-zinc-500'}`}>
                Ajustado ao relógio • Bueno's Bar às 14h
              </div>
            </div>
          </button>

          {/* Opção B: Dia 1 (Santo Amaro) */}
          <button
            onClick={() => onChangeMode('two_days_day1')}
            className={`p-2.5 rounded-2xl text-left border transition active:scale-95 flex flex-col justify-between ${
              activeMode === 'two_days_day1'
                ? 'bg-black text-white border-black shadow-xs'
                : 'bg-zinc-50 text-zinc-800 border-zinc-200 hover:bg-zinc-100'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-800 border border-zinc-300">
                Opção B (Dia 1)
              </span>
              <span className="text-[10px] font-mono font-bold">6 paradas</span>
            </div>
            <div className="mt-1">
              <div className="text-xs font-black tracking-tight leading-tight">
                Santo Amaro & Brooklin
              </div>
              <div className={`text-[10px] leading-tight mt-0.5 ${activeMode === 'two_days_day1' ? 'text-zinc-300' : 'text-zinc-500'}`}>
                Partida São Benedito • Até 14h45
              </div>
            </div>
          </button>

          {/* Opção B: Dia 2 (Klabin & Moema) */}
          <button
            onClick={() => onChangeMode('two_days_day2')}
            className={`p-2.5 rounded-2xl text-left border transition active:scale-95 flex flex-col justify-between ${
              activeMode === 'two_days_day2'
                ? 'bg-black text-white border-black shadow-xs'
                : 'bg-zinc-50 text-zinc-800 border-zinc-200 hover:bg-zinc-100'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-800 border border-zinc-300">
                Opção B (Dia 2)
              </span>
              <span className="text-[10px] font-mono font-bold">5 paradas</span>
            </div>
            <div className="mt-1">
              <div className="text-xs font-black tracking-tight leading-tight">
                Klabin, Moema & V. Olímpia
              </div>
              <div className={`text-[10px] leading-tight mt-0.5 ${activeMode === 'two_days_day2' ? 'text-zinc-300' : 'text-zinc-500'}`}>
                Início 08h00 no Villa Klabin
              </div>
            </div>
          </button>

          {/* Linear Geográfico */}
          <button
            onClick={() => onChangeMode('linear_geo')}
            className={`p-2.5 rounded-2xl text-left border transition active:scale-95 flex flex-col justify-between ${
              activeMode === 'linear_geo'
                ? 'bg-black text-white border-black shadow-xs'
                : 'bg-zinc-50 text-zinc-800 border-zinc-200 hover:bg-zinc-100'
            }`}
          >
            <div className="flex items-center justify-between w-full">
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-800 border border-zinc-300">
                Original
              </span>
              <span className="text-[10px] font-mono font-bold">11 paradas</span>
            </div>
            <div className="mt-1">
              <div className="text-xs font-black tracking-tight leading-tight">
                Linear Geográfico
              </div>
              <div className={`text-[10px] leading-tight mt-0.5 ${activeMode === 'linear_geo' ? 'text-zinc-300' : 'text-zinc-500'}`}>
                Ordem sequencial no mapa
              </div>
            </div>
          </button>
        </div>

        {/* Informação contextual sobre a rota ativa */}
        <div className="text-[11px] text-zinc-600 bg-zinc-50 p-2.5 rounded-xl border border-zinc-200 flex items-start gap-2">
          <Info className="w-3.5 h-3.5 text-black shrink-0 mt-0.5" />
          <div className="leading-snug">
            <strong className="text-black">{currentModeConfig.name}: </strong>
            {currentModeConfig.description}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* BANNER / DRAWER DE ANÁLISE DE CONFLITOS DE HORÁRIO       */}
      {/* ======================================================== */}
      <div className="bg-white rounded-3xl border border-zinc-300 p-4 shadow-xs space-y-3">
        <button
          onClick={() => setShowConflicts(!showConflicts)}
          className="w-full flex items-center justify-between text-left transition active:opacity-75"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-black text-black leading-tight flex items-center gap-1.5">
                <span>Diagnóstico dos 3 Choques de Horário</span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-800 border border-zinc-300">
                  {showConflicts ? 'Ocultar' : 'Ver detalhes'}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 leading-tight mt-0.5">
                Villa Klabin (08h), Bueno's Bar (14h) e gargalo matinal
              </p>
            </div>
          </div>
          {showConflicts ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
        </button>

        {showConflicts && (
          <div className="pt-2 border-t border-zinc-200 space-y-2.5 animate-in fade-in duration-150">
            {CONFLICT_ANALYSIS.map((item, idx) => (
              <div key={item.id} className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold text-black text-xs">
                    <span className="w-4 h-4 rounded-full bg-black text-white text-[10px] flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>
                    <span>{item.title}</span>
                  </div>
                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-800 font-bold">
                    {item.timeSlot}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-700 leading-snug">
                  {item.description}
                </p>
                <div className="text-[11px] text-zinc-600 bg-white p-2 rounded-xl border border-zinc-200">
                  <strong className="text-black">Solução aplicada: </strong>
                  {item.solution}
                </div>
              </div>
            ))}

            <div className="pt-1 flex gap-2">
              <button
                onClick={() => {
                  onChangeMode('one_day_optimized');
                  setShowConflicts(false);
                }}
                className="flex-1 h-10 rounded-xl bg-black text-white hover:bg-zinc-800 text-[11px] font-bold transition active:scale-95"
              >
                Aplicar Rota 1 Dia
              </button>
              <button
                onClick={() => {
                  onChangeMode('two_days_day1');
                  setShowConflicts(false);
                }}
                className="flex-1 h-10 rounded-xl border border-zinc-300 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 text-[11px] font-bold transition active:scale-95"
              >
                Aplicar Rota 2 Dias
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Lista Completa das Paradas na Coluna Esquerda no Desktop */}
      <div className="hidden lg:block">
        {renderRouteStopsList()}
      </div>
    </div>

    {/* Coluna Direita no Desktop: Detalhe do Lead Ativo & Ações */}
    <div className="lg:col-span-7 xl:col-span-8 space-y-3.5">
      {/* ======================================================== */}
      {/* CONTROLES DE NAVEGAÇÃO DE PARADA ANTERIOR / PRÓXIMA     */}
      {/* ======================================================== */}
      <div className="flex items-center justify-between text-xs font-mono font-bold text-zinc-900 px-1">
        <button
          onClick={handlePrev}
          disabled={activeIndex === 0}
          className="h-10 px-3 rounded-xl border border-zinc-300 bg-white hover:bg-zinc-100 disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 transition active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Anterior</span>
        </button>

        <span className="text-zinc-500 uppercase tracking-wider text-[11px] font-mono">
          PARADA {activeLead.order} DE {leads.length}
        </span>

        <button
          onClick={handleNext}
          disabled={activeIndex === leads.length - 1}
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
              <span className="w-7 h-7 rounded-lg bg-black text-white text-xs font-mono font-bold flex items-center justify-center">
                {activeLead.order}
              </span>
              {activeLead.suggestedTimeSlot && (
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-900 text-white flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{activeLead.suggestedTimeSlot}</span>
                </span>
              )}
            </div>
            <h2 className="text-xl font-black text-black tracking-tight mt-1.5 leading-snug">
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

        {/* Nota especial do modo / Resolução de Conflito */}
        {activeLead.conflictWarning && (
          <div className="p-3 rounded-2xl bg-zinc-100 border border-zinc-300 text-xs font-medium text-black flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-black shrink-0 mt-0.5" />
            <div className="leading-snug">{activeLead.conflictWarning}</div>
          </div>
        )}

        {activeLead.modeNote && (
          <div className="p-2.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-700 leading-snug flex items-start gap-1.5">
            <Clock className="w-3.5 h-3.5 text-black shrink-0 mt-0.5" />
            <div>{activeLead.modeNote}</div>
          </div>
        )}

        {/* Subgrid Responsivo: Quem Procurar + Janela Ideal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Quem Procurar */}
          <div className="p-3.5 rounded-2xl bg-zinc-100 border border-zinc-200 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">
                QUEM PROCURAR NO LOCAL
              </div>
              <div className="text-lg font-black text-black mt-0.5 tracking-tight truncate">
                {activeLead.targetContact}
              </div>
            </div>
            <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
              {activeLead.bestTimeNote}
            </p>
          </div>

          {/* Melhor Horário & Status da Janela */}
          <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">
                  JANELA IDEAL INFORMADA
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded border ${timeCheck.badgeClass}`}>
                  {timeCheck.badgeText}
                </span>
              </div>
              <div className="text-base font-black text-black">
                {activeLead.bestTime}
              </div>
            </div>
            <p className="text-xs text-zinc-600 mt-2">
              {timeCheck.description}
            </p>
          </div>
        </div>

        {/* Histórico WhatsApp / Contato Prévio com balão no estilo WhatsApp */}
        {activeLead.contactHistory && (
          <div
            style={{ backgroundColor: WHATSAPP_PALETTE.bg }}
            className="p-3.5 rounded-2xl border border-emerald-200/60 text-xs space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <span
                style={{ color: WHATSAPP_PALETTE.darkTeal }}
                className="text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5"
              >
                <WhatsAppIcon size={13} fill={WHATSAPP_PALETTE.darkTeal} />
                <span>HISTÓRICO WHATSAPP & SDR</span>
              </span>
              <span
                style={{ backgroundColor: WHATSAPP_PALETTE.darkTeal }}
                className="text-[9px] text-white font-mono font-bold px-1.5 py-0.5 rounded"
              >
                REGISTRO
              </span>
            </div>
            <div
              style={{ backgroundColor: WHATSAPP_PALETTE.bubble, color: WHATSAPP_PALETTE.darkTeal }}
              className="p-2.5 rounded-xl text-xs leading-relaxed font-medium shadow-2xs border border-emerald-300/40"
            >
              <p className="whitespace-pre-wrap">{activeLead.contactHistory}</p>
            </div>
          </div>
        )}

        {/* Endereço & Distância do Ponto de Partida */}
        <div className="text-xs text-zinc-700 bg-zinc-50 p-3 rounded-2xl border border-zinc-200 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-1.5 flex-1">
              <MapPin className="w-4 h-4 text-black shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-black">{activeLead.address}</span>
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

          {/* Métricas de deslocamento calculadas */}
          <div className="pt-2 border-t border-zinc-200 grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="p-2 rounded-xl bg-white border border-zinc-200">
              <span className="text-[10px] text-zinc-500 block uppercase">
                Da Partida (São Benedito, 1474)
              </span>
              <strong className="text-black font-bold text-xs">
                {activeLead.distanceFromStart || '~1,5 km'}
              </strong>
              <span className="text-[10px] text-zinc-500 block mt-0.5">
                {activeLead.walkingTimeFromStart || '~19 min a pé'}
              </span>
            </div>

            <div className="p-2 rounded-xl bg-white border border-zinc-200">
              <span className="text-[10px] text-zinc-500 block uppercase">
                Do Ponto Anterior
              </span>
              <strong className="text-black font-bold text-xs">
                {activeLead.walkingFromPrev.distance}
              </strong>
              <span className="text-[10px] text-zinc-500 block mt-0.5">
                {activeLead.walkingFromPrev.duration}
              </span>
            </div>
          </div>
        </div>

        {/* Dica de Metrô se houver com cor oficial Lilás (#9B3894) */}
        {activeLead.metroTip && (
          <div className="p-3.5 rounded-2xl border border-zinc-200 bg-zinc-50 flex items-start gap-2.5 text-xs text-zinc-800">
            <span
              className="w-5 h-5 rounded-md text-white font-mono font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5"
              style={{ backgroundColor: '#9B3894' }}
            >
              5
            </span>
            <div className="leading-snug">
              <strong className="font-bold text-black">{activeLead.metroTip.station}: </strong>
              <span className="text-zinc-700">{activeLead.metroTip.advice}</span>
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
        {/* BOTÕES DE AÇÃO RÁPIDA (MIN 52PX PARA TOQUE ERGONÔMICO)   */}
        {/* ======================================================== */}
        <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Navegar saindo da São Benedito 1474 / Atual */}
          <a
            href={googleMapsWalkingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="h-13 rounded-2xl bg-black text-white hover:bg-zinc-800 font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition active:scale-95"
            title="Abrir rota no Google Maps a pé partindo da Rua São Benedito, 1474"
          >
            <Navigation className="w-4 h-4" />
            <span>Navegar GPS</span>
          </a>

          {/* WhatsApp Direto - Paleta Oficial WhatsApp (#25D366, #128C7E, #075E54) */}
          <a
            href={getWhatsAppUrl(activeLead)}
            target="_blank"
            rel="noopener noreferrer"
            style={{ backgroundColor: WHATSAPP_PALETTE.green }}
            className="h-13 rounded-2xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition active:scale-95 hover:opacity-90"
            title="Abrir WhatsApp com mensagem pronta"
          >
            <WhatsAppIcon size={18} fill="#FFFFFF" />
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

        {/* No mobile (< lg), a lista completa fica abaixo do card da parada atual */}
        <div className="block lg:hidden pt-2">
          {renderRouteStopsList()}
        </div>
      </div>
    </div>
  );
};
