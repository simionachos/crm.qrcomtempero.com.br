import React, { useState, useEffect } from 'react';
import { RouteLead, VisitStatus } from '../types';
import { AuthUser } from '../utils/auth';
import { FileText, Footprints, LogOut, Sparkles, Fingerprint } from 'lucide-react';

interface NavbarProps {
  completedCount: number;
  totalCount: number;
  onOpenReport: () => void;
  onOpenAiCoach: () => void;
  onOpenSecurity?: () => void;
  activeLeadId: number;
  routeLeads: RouteLead[];
  leadStatuses: Record<number, VisitStatus>;
  onSelectLead: (id: number) => void;
  user: AuthUser | null;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  completedCount,
  totalCount,
  onOpenReport,
  onOpenAiCoach,
  onOpenSecurity,
  activeLeadId,
  routeLeads,
  leadStatuses,
  onSelectLead,
  user,
  onLogout
}) => {
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-[1400] bg-white border-b border-zinc-200">
      <div className="max-w-md mx-auto px-4 py-2.5">
        {/* Linha 1: Marca, Horário, Usuário e Ações */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <Footprints className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-black text-sm tracking-tight text-black uppercase">
                  SDR ROTA SP
                </span>
                <span className="text-[10px] font-mono font-medium text-zinc-500 bg-zinc-100 px-1.5 py-0.5 rounded">
                  {timeStr}
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 font-mono mt-0.5">
                {user ? `Olá, ${user.name}` : 'Zona Sul • Santo Amaro ➔ Klabin'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onOpenAiCoach}
              className="h-8 px-2 rounded-lg border border-zinc-300 hover:bg-zinc-100 text-black text-[11px] font-bold flex items-center gap-1 transition active:scale-95"
              title="Abrir Copiloto IA OpenRouter"
            >
              <Sparkles className="w-3.5 h-3.5 text-black" />
              <span className="hidden xs:inline">Coach IA</span>
            </button>

            <button
              onClick={onOpenReport}
              className="h-8 px-2 rounded-lg bg-black text-white hover:bg-zinc-800 text-[11px] font-bold flex items-center gap-1 transition active:scale-95"
              title="Gerar Relatório do Dia"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Resumo</span>
            </button>

            {user && onOpenSecurity && (
              <button
                onClick={onOpenSecurity}
                className="h-8 w-8 rounded-lg border border-zinc-300 hover:bg-zinc-100 text-zinc-700 hover:text-black flex items-center justify-center transition active:scale-95"
                title="Configurar Biometria e Sessão"
              >
                <Fingerprint className="w-4 h-4" />
              </button>
            )}

            {user && (
              <button
                onClick={onLogout}
                className="h-8 w-8 rounded-lg border border-zinc-300 hover:bg-zinc-100 text-zinc-600 hover:text-black flex items-center justify-center transition active:scale-95"
                title="Sair da conta"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Linha 2: Barra de Progresso Rápida com os 11 Pontos */}
        <div className="mt-2.5 flex items-center gap-1 overflow-x-auto py-0.5 no-scrollbar">
          {routeLeads.map((lead) => {
            const isSelected = lead.id === activeLeadId;
            const status = leadStatuses[lead.id];
            const isDone = status === 'scheduled' || status === 'visited' || status === 'in_progress';

            return (
              <button
                key={lead.id}
                onClick={() => onSelectLead(lead.id)}
                className={`flex-1 min-w-[24px] h-6 rounded flex items-center justify-center text-[10px] font-mono font-bold transition active:scale-90 ${
                  isSelected
                    ? 'bg-black text-white ring-2 ring-zinc-400'
                    : isDone
                    ? 'bg-zinc-800 text-white'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 border border-zinc-200'
                }`}
                title={`Parada ${lead.order}: ${lead.name}`}
              >
                {isDone ? '✓' : lead.order}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
