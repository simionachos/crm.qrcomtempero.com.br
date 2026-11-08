import React, { useState } from 'react';
import { RouteLead, VisitLog, RouteMode } from '../types';
import { ROUTE_MODE_CONFIGS } from '../data/leadsData';
import { X, Copy, Check, Share2 } from 'lucide-react';
import { WhatsAppIcon, WHATSAPP_PALETTE } from './WhatsAppIcon';

interface DailyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  routeLeads: RouteLead[];
  visits: VisitLog[];
  activeMode?: RouteMode;
}

export const DailyReportModal: React.FC<DailyReportModalProps> = ({
  isOpen,
  onClose,
  routeLeads,
  visits,
  activeMode = 'one_day_optimized'
}) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);
  const modeConfig = ROUTE_MODE_CONFIGS[activeMode];

  const completedVisits = visits.length;
  const scheduledCount = visits.filter(v => v.status === 'scheduled').length;
  const inProgressCount = visits.filter(v => v.status === 'in_progress').length;
  const returnLaterCount = visits.filter(v => v.status === 'return_later').length;
  const absentCount = visits.filter(v => v.status === 'absent').length;

  const todayStr = new Date().toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  const generateReportText = () => {
    let report = `RELATÓRIO DIÁRIO DE PROSPECÇÃO (SDR)\n`;
    report += `Data: ${todayStr}\n`;
    report += `Roteiro: ${modeConfig?.name || 'Prospecção SP'} (${routeLeads.length} paradas)\n`;
    report += `Partida: Rua São Benedito, 1474 – Santo Amaro\n\n`;
    report += `RESUMO:\n`;
    report += `• Visitas Realizadas: ${completedVisits} de ${routeLeads.length}\n`;
    report += `• Reuniões Agendadas: ${scheduledCount}\n`;
    report += `• Decisores em Negociação: ${inProgressCount}\n`;
    report += `• Retornos / Follow-ups: ${returnLaterCount}\n`;
    report += `• Ausentes / Recado: ${absentCount}\n\n`;
    report += `DETALHAMENTO POR CLIENTE:\n`;

    routeLeads.forEach(lead => {
      const visit = visits.find(v => v.leadId === lead.id);
      if (visit) {
        let statusText = 'Visitado';
        if (visit.status === 'scheduled') statusText = 'REUNIÃO MARCADA';
        if (visit.status === 'in_progress') statusText = 'EM NEGOCIAÇÃO';
        if (visit.status === 'return_later') statusText = 'RETORNAR DEPOIS';
        if (visit.status === 'absent') statusText = 'AUSENTE / RECADO';
        if (visit.status === 'not_interested') statusText = 'SEM INTERESSE';

        report += `\n[${statusText}] ${lead.order}. ${lead.name}\n`;
        report += `   Contato: ${visit.contactSpokenTo || lead.targetContact}\n`;
        if (visit.nextFollowUpDate) {
          report += `   Agendamento: ${new Date(visit.nextFollowUpDate).toLocaleString('pt-BR')}\n`;
        }
        if (visit.notes) {
          report += `   Notas: ${visit.notes}\n`;
        }
      } else {
        report += `\n[PENDENTE] ${lead.order}. ${lead.name}\n`;
      }
    });

    return report;
  };

  const reportText = generateReportText();

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(reportText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[2000] bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full max-w-md sm:max-w-lg md:max-w-xl rounded-t-3xl sm:rounded-3xl border-2 border-black max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 flex items-center justify-between bg-black text-white">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
              RELATÓRIO DO DIA
            </span>
            <h3 className="text-base font-black text-white mt-0.5 leading-snug">
              Resumo da Prospecção
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white flex items-center justify-center transition active:scale-90"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto space-y-4">
          {/* Métricas em Blocos Minimalistas Preto/Branco */}
          <div className="grid grid-cols-3 gap-2 text-center font-mono">
            <div className="p-3 bg-black text-white rounded-2xl">
              <div className="text-2xl font-black">{scheduledCount}</div>
              <div className="text-[10px] text-zinc-400 uppercase tracking-tight">Reuniões</div>
            </div>
            <div className="p-3 bg-zinc-100 text-black rounded-2xl border border-zinc-200">
              <div className="text-2xl font-black">{completedVisits}/11</div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-tight">Visitas</div>
            </div>
            <div className="p-3 bg-zinc-100 text-black rounded-2xl border border-zinc-200">
              <div className="text-2xl font-black">{returnLaterCount}</div>
              <div className="text-[10px] text-zinc-500 uppercase tracking-tight">Follow-ups</div>
            </div>
          </div>

          {/* Pré-visualização do Relatório */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span
                style={{ backgroundColor: WHATSAPP_PALETTE.bubble, color: WHATSAPP_PALETTE.darkTeal }}
                className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1 border border-emerald-300/50"
              >
                <WhatsAppIcon size={12} fill={WHATSAPP_PALETTE.darkTeal} />
                TEXTO FORMATADO WHATSAPP / CRM
              </span>
              <button
                onClick={handleCopy}
                className="text-xs font-mono font-bold text-black flex items-center gap-1 hover:underline"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'COPIADO' : 'COPIAR'}</span>
              </button>
            </div>
            <pre className="p-3 bg-zinc-50 border border-zinc-300 rounded-2xl text-[11px] text-black font-mono whitespace-pre-wrap leading-relaxed max-h-[220px] overflow-y-auto select-all">
              {reportText}
            </pre>
          </div>
        </div>

        {/* Ações Móveis */}
        <div className="p-3.5 border-t border-zinc-200 bg-zinc-50 flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex-1 h-13 rounded-2xl border-2 border-black bg-white hover:bg-zinc-100 text-black font-bold text-xs flex items-center justify-center gap-1.5 transition active:scale-95"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copiado!' : 'Copiar Texto'}</span>
          </button>

          <button
            onClick={handleShareWhatsApp}
            style={{ backgroundColor: WHATSAPP_PALETTE.green }}
            className="flex-1 h-13 rounded-2xl text-white font-bold text-xs flex items-center justify-center gap-2 transition active:scale-95 hover:opacity-90 shadow-sm"
          >
            <WhatsAppIcon size={18} fill="#FFFFFF" />
            <span>Enviar WhatsApp</span>
          </button>
        </div>
      </div>
    </div>
  );
};
