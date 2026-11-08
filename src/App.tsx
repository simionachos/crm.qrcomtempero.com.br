import React, { useState, useEffect, useMemo } from 'react';
import { RouteLead, VisitLog, VisitStatus, RouteMode } from './types';
import {
  ROUTE_LEADS,
  METRO_STATIONS,
  ALL_DATABASE_LEADS,
  STARTING_POINT,
  getRouteLeadsForMode,
  ROUTE_MODE_CONFIGS
} from './data/leadsData';
import { getSavedVisits, saveVisit, getLeadStatuses, getActiveStopId, setActiveStopId } from './utils/storage';
import { getStoredAuth, clearStoredAuth, verifySession, AuthUser } from './utils/auth';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { RouteView } from './components/RouteView';
import { MapView } from './components/MapView';
import { MetroTipsView } from './components/MetroTipsView';
import { DatabaseView } from './components/DatabaseView';
import { CheckInModal } from './components/CheckInModal';
import { PitchModal } from './components/PitchModal';
import { DailyReportModal } from './components/DailyReportModal';
import { AIAssistantModal } from './components/AIAssistantModal';
import { LoginView } from './components/LoginView';
import { SecurityModal } from './components/SecurityModal';
import { MapPin } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Modo da rota: 1 Dia Otimizado (padrão que resolve conflitos), Dia 1, Dia 2 ou Linear Geográfico
  const [activeMode, setActiveMode] = useState<RouteMode>('one_day_optimized');

  const [activeTab, setActiveTab] = useState<'route' | 'map' | 'metro' | 'database'>('route');
  const [activeLeadId, setActiveLeadIdState] = useState<number>(2); // Começa na Padaria Santa Clara (09h00) no modo 1 dia
  const [leadStatuses, setLeadStatuses] = useState<Record<number, VisitStatus>>({});
  const [visits, setVisits] = useState<VisitLog[]>([]);

  // Modais
  const [checkInLead, setCheckInLead] = useState<RouteLead | null>(null);
  const [pitchLead, setPitchLead] = useState<RouteLead | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isSecurityOpen, setIsSecurityOpen] = useState(false);
  const [aiLeadContext, setAiLeadContext] = useState<RouteLead | undefined>(undefined);

  // Leads dinâmicos de acordo com o modo da rota
  const currentLeads = useMemo(() => {
    return getRouteLeadsForMode(activeMode);
  }, [activeMode]);

  // Inicialização e verificação de autenticação
  useEffect(() => {
    const initAuth = async () => {
      const stored = getStoredAuth();
      if (stored?.user && stored?.token) {
        setCurrentUser(stored.user);
        const isValid = await verifySession();
        if (!isValid) {
          setCurrentUser(null);
        }
      }
      setIsAuthChecking(false);
    };

    initAuth();

    const savedVisits = getSavedVisits();
    const savedStatuses = getLeadStatuses();
    const savedActiveId = getActiveStopId();

    setVisits(savedVisits);
    setLeadStatuses(savedStatuses);
    if (savedActiveId && savedActiveId >= 1) {
      setActiveLeadIdState(savedActiveId);
    }
  }, []);

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    clearStoredAuth();
    setCurrentUser(null);
  };

  const handleSelectLead = (id: number) => {
    setActiveLeadIdState(id);
    setActiveStopId(id);
  };

  const handleModeChange = (newMode: RouteMode) => {
    setActiveMode(newMode);
    const newLeads = getRouteLeadsForMode(newMode);
    if (newLeads.length > 0) {
      setActiveLeadIdState(newLeads[0].id);
      setActiveStopId(newLeads[0].id);
    }
  };

  const handleOpenAiCoach = (lead?: RouteLead) => {
    const target = lead || currentLeads.find(l => l.id === activeLeadId) || currentLeads[0];
    setAiLeadContext(target);
    setIsAiModalOpen(true);
  };

  const handleSaveVisit = (visit: VisitLog) => {
    const updatedVisits = saveVisit(visit);
    setVisits(updatedVisits);
    setLeadStatuses(prev => ({
      ...prev,
      [visit.leadId]: visit.status
    }));

    const currentIndex = currentLeads.findIndex(l => l.id === activeLeadId);
    if (currentIndex >= 0 && currentIndex < currentLeads.length - 1) {
      const nextId = currentLeads[currentIndex + 1].id;
      setActiveLeadIdState(nextId);
      setActiveStopId(nextId);
    }
  };

  const completedCount = currentLeads.filter(l => {
    const st = leadStatuses[l.id];
    return st === 'scheduled' || st === 'visited' || st === 'in_progress';
  }).length;

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-black border-t-transparent animate-spin" />
      </div>
    );
  }

  // Se não autenticado, renderiza a tela de login
  if (!currentUser) {
    return <LoginView onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-zinc-50 text-black flex flex-col font-sans selection:bg-black selection:text-white pb-24">
      {/* Navbar Superior Minimalista Monocromática */}
      <Navbar
        completedCount={completedCount}
        totalCount={currentLeads.length}
        onOpenReport={() => setIsReportOpen(true)}
        onOpenAiCoach={() => handleOpenAiCoach()}
        activeLeadId={activeLeadId}
        routeLeads={currentLeads}
        leadStatuses={leadStatuses}
        onSelectLead={handleSelectLead}
        user={currentUser}
        onOpenSecurity={() => setIsSecurityOpen(true)}
        onLogout={handleLogout}
      />

      {/* Conteúdo Principal Mobile First */}
      <main className="flex-1 max-w-md w-full mx-auto px-3.5 pt-3.5 space-y-3.5">
        {/* Banner de Partida Minimalista */}
        <div className="bg-white rounded-3xl border border-zinc-200 p-4 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">
              PONTO DE PARTIDA FIXO
            </span>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STARTING_POINT.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-mono font-bold text-black flex items-center gap-1 hover:underline"
            >
              <MapPin className="w-3 h-3" />
              <span>Abrir no GPS</span>
            </a>
          </div>

          <div>
            <h2 className="text-base font-black text-black leading-snug">
              {STARTING_POINT.address.split('–')[0]}
            </h2>
            <p className="text-xs text-zinc-500">
              {ROUTE_MODE_CONFIGS[activeMode].departureNote}
            </p>
          </div>

          <div className="pt-2 border-t border-zinc-100 grid grid-cols-3 gap-2 text-center text-xs font-mono">
            <div className="bg-zinc-50 p-2 rounded-xl border border-zinc-200">
              <span className="text-[10px] text-zinc-500 block">Horário</span>
              <strong className="text-black font-bold text-xs">{ROUTE_MODE_CONFIGS[activeMode].estimatedTime}</strong>
            </div>
            <div className="bg-zinc-50 p-2 rounded-xl border border-zinc-200">
              <span className="text-[10px] text-zinc-500 block">Roteiro</span>
              <strong className="text-black font-bold text-xs">{ROUTE_MODE_CONFIGS[activeMode].shortName.split(' ')[0]} {ROUTE_MODE_CONFIGS[activeMode].shortName.split(' ')[1] || ''}</strong>
            </div>
            <div className="bg-zinc-50 p-2 rounded-xl border border-zinc-200">
              <span className="text-[10px] text-zinc-500 block">Progresso</span>
              <strong className="text-black font-bold text-xs">{completedCount}/{currentLeads.length}</strong>
            </div>
          </div>
        </div>

        {/* Abas */}
        {activeTab === 'route' && (
          <RouteView
            leads={currentLeads}
            activeLeadId={activeLeadId}
            onSelectLead={handleSelectLead}
            leadStatuses={leadStatuses}
            visits={visits}
            onOpenCheckIn={(lead) => setCheckInLead(lead)}
            onOpenPitch={(lead) => setPitchLead(lead)}
            onOpenAiCoach={(lead) => handleOpenAiCoach(lead)}
            activeMode={activeMode}
            onChangeMode={handleModeChange}
          />
        )}

        {activeTab === 'map' && (
          <MapView
            routeLeads={currentLeads}
            activeLeadId={activeLeadId}
            onSelectLead={handleSelectLead}
            leadStatuses={leadStatuses}
            metroStations={METRO_STATIONS}
            nearbyLeads={ALL_DATABASE_LEADS}
          />
        )}

        {activeTab === 'metro' && <MetroTipsView />}

        {activeTab === 'database' && <DatabaseView />}
      </main>

      {/* Navegação Inferior Fixa */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        onOpenReport={() => setIsReportOpen(true)}
        completedCount={completedCount}
        totalCount={currentLeads.length}
      />

      {/* Modais */}
      {checkInLead && (
        <CheckInModal
          lead={checkInLead}
          isOpen={!!checkInLead}
          onClose={() => setCheckInLead(null)}
          onSaveVisit={handleSaveVisit}
          existingVisit={visits.find(v => v.leadId === checkInLead.id)}
        />
      )}

      {pitchLead && (
        <PitchModal
          lead={pitchLead}
          isOpen={!!pitchLead}
          onClose={() => setPitchLead(null)}
          onOpenAiCoach={(lead) => handleOpenAiCoach(lead)}
        />
      )}

      {isReportOpen && (
        <DailyReportModal
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          routeLeads={currentLeads}
          visits={visits}
          activeMode={activeMode}
        />
      )}

      {isAiModalOpen && (
        <AIAssistantModal
          lead={aiLeadContext}
          isOpen={isAiModalOpen}
          onClose={() => setIsAiModalOpen(false)}
        />
      )}

      {currentUser && (
        <SecurityModal
          isOpen={isSecurityOpen}
          onClose={() => setIsSecurityOpen(false)}
          user={currentUser}
        />
      )}
    </div>
  );
}
