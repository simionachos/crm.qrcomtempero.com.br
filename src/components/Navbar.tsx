import React, { useState, useEffect } from 'react';
import { RouteLead, VisitStatus } from '../types';
import { AuthUser } from '../utils/auth';
import {
  FileText,
  Footprints,
  LogOut,
  Sparkles,
  Fingerprint,
  Route,
  Map,
  Train,
  Database
} from 'lucide-react';

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
  activeTab?: 'route' | 'map' | 'metro' | 'database';
  onChangeTab?: (tab: 'route' | 'map' | 'metro' | 'database') => void;
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
  onLogout,
  activeTab = 'route',
  onChangeTab
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
      <div className="max-w-md md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-2.5">
        {/* Linha 1: Marca, Abas Desktop, Horário, Usuário e Ações */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
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

          {/* Abas de Navegação em Telas Médias e Grandes (Tablet / Desktop) */}
          {onChangeTab && (
            <div className="hidden md:flex items-center bg-zinc-100 p-1 rounded-2xl border border-zinc-200">
              <button
                onClick={() => onChangeTab('route')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono flex items-center gap-1.5 transition ${
                  activeTab === 'route'
                    ? 'bg-black text-white shadow-xs'
                    : 'text-zinc-600 hover:text-black hover:bg-zinc-200/60'
                }`}
              >
                <Route className="w-3.5 h-3.5" />
                <span>Roteiro</span>
              </button>

              <button
                onClick={() => onChangeTab('map')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono flex items-center gap-1.5 transition ${
                  activeTab === 'map'
                    ? 'bg-black text-white shadow-xs'
                    : 'text-zinc-600 hover:text-black hover:bg-zinc-200/60'
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                <span>Mapa</span>
              </button>

              <button
                onClick={() => onChangeTab('metro')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono flex items-center gap-1.5 transition ${
                  activeTab === 'metro'
                    ? 'bg-black text-white shadow-xs'
                    : 'text-zinc-600 hover:text-black hover:bg-zinc-200/60'
                }`}
              >
                <Train className="w-3.5 h-3.5" />
                <span>Metrô SP</span>
              </button>

              <button
                onClick={() => onChangeTab('database')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono flex items-center gap-1.5 transition ${
                  activeTab === 'database'
                    ? 'bg-black text-white shadow-xs'
                    : 'text-zinc-600 hover:text-black hover:bg-zinc-200/60'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>Base (+90)</span>
              </button>
            </div>
          )}

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={onOpenAiCoach}
              className="h-8 px-2.5 rounded-lg border border-zinc-300 hover:bg-zinc-100 text-black text-[11px] font-bold flex items-center gap-1.5 transition active:scale-95"
              title="Abrir Copiloto IA OpenRouter"
            >
              <Sparkles className="w-3.5 h-3.5 text-black" />
              <span className="hidden sm:inline">Coach IA</span>
            </button>

            <button
              onClick={onOpenReport}
              className="h-8 px-2.5 rounded-lg bg-black text-white hover:bg-zinc-800 text-[11px] font-bold flex items-center gap-1.5 transition active:scale-95"
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

        {/* Linha 2: Barra de Progresso Rápida Responsiva */}
        <div className="mt-2.5 flex items-center gap-1 overflow-x-auto py-0.5 no-scrollbar">
          {routeLeads.map((lead) => {
            const isSelected = lead.id === activeLeadId;
            const status = leadStatuses[lead.id];
            const isDone = status === 'scheduled' || status === 'visited' || status === 'in_progress';

            return (
              <button
                key={lead.id}
                onClick={() => onSelectLead(lead.id)}
                className={`flex-1 min-w-[26px] md:min-w-[32px] h-6.5 rounded flex items-center justify-center text-[10px] font-mono font-bold transition active:scale-90 ${
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
