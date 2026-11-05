import React, { useState, useEffect } from 'react';
import { RouteLead, VisitLog, VisitStatus } from './types';
import { ROUTE_LEADS, METRO_STATIONS, ALL_DATABASE_LEADS, STARTING_POINT } from './data/leadsData';
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
import { MapPin } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  const [activeTab, setActiveTab] = useState<'route' | 'map' | 'metro' | 'database'>('route');
  const [activeLeadId, setActiveLeadIdState] = useState<number>(1);
  const [leadStatuses, setLeadStatuses] = useState<Record<number, VisitStatus>>({});
  const [visits, setVisits] = useState<VisitLog[]>([]);

  // Modais
  const [checkInLead, setCheckInLead] = useState<RouteLead | null>(null);
  const [pitchLead, setPitchLead] = useState<RouteLead | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiLeadContext, setAiLeadContext] = useState<RouteLead | undefined>(undefined);

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
    if (savedActiveId && savedActiveId >= 1 && savedActiveId <= ROUTE_LEADS.length) {
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

  const handleOpenAiCoach = (lead?: RouteLead) => {
    const target = lead || ROUTE_LEADS.find(l => l.id === activeLeadId);
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

    if (activeLeadId < ROUTE_LEADS.length) {
      const nextId = activeLeadId + 1;
      setActiveLeadIdState(nextId);
      setActiveStopId(nextId);
    }
  };

  const completedCount = ROUTE_LEADS.filter(l => {
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
        totalCount={ROUTE_LEADS.length}
        onOpenReport={() => setIsReportOpen(true)}
        onOpenAiCoach={() => handleOpenAiCoach()}
        activeLeadId={activeLeadId}
        routeLeads={ROUTE_LEADS}
        leadStatuses={leadStatuses}
        onSelectLead={handleSelectLead}
        user={currentUser}
        onLogout={handleLogout}
      />

      {/* Conteúdo Principal Mobile First */}
      <main className="flex-1 max-w-md w-full mx-auto px-3.5 pt-3.5 space-y-3.5">
        {/* Banner de Partida Minimalista */}
        <div className="bg-white rounded-3xl border border-zinc-200 p-4 shadow-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">
              PONTO DE PARTIDA (ZONA SUL SP)
            </span>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(STARTING_POINT.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-mono font-bold text-black flex items-center gap-1 hover:underline"
            >
              <MapPin className="w-3 h-3" />
              <span>Abrir GPS</span>
            </a>
          </div>

          <div>
            <h2 className="text-base font-black text-black leading-snug">
              {STARTING_POINT.address.split('–')[0]}
            </h2>
            <p className="text-xs text-zinc-500">
              Santo Amaro / Alto da Boa Vista ➔ Chácara Klabin
            </p>
          </div>

          <div className="pt-2 border-t border-zinc-100 grid grid-cols-3 gap-2 text-center text-xs font-mono">
            <div className="bg-zinc-50 p-2 rounded-xl border border-zinc-200">
              <span className="text-[10px] text-zinc-500 block">Distância</span>
              <strong className="text-black font-bold text-xs">~18,5 km</strong>
            </div>
            <div className="bg-zinc-50 p-2 rounded-xl border border-zinc-200">
              <span className="text-[10px] text-zinc-500 block">Marcha</span>
              <strong className="text-black font-bold text-xs">~3h45-4h15</strong>
            </div>
            <div className="bg-zinc-50 p-2 rounded-xl border border-zinc-200">
              <span className="text-[10px] text-zinc-500 block">Feitos</span>
              <strong className="text-black font-bold text-xs">{completedCount}/11</strong>
            </div>
          </div>
        </div>

        {/* Abas */}
        {activeTab === 'route' && (
          <RouteView
            leads={ROUTE_LEADS}
            activeLeadId={activeLeadId}
            onSelectLead={handleSelectLead}
            leadStatuses={leadStatuses}
            visits={visits}
            onOpenCheckIn={(lead) => setCheckInLead(lead)}
            onOpenPitch={(lead) => setPitchLead(lead)}
            onOpenAiCoach={(lead) => handleOpenAiCoach(lead)}
          />
        )}

        {activeTab === 'map' && (
          <MapView
            routeLeads={ROUTE_LEADS}
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
        totalCount={ROUTE_LEADS.length}
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
          routeLeads={ROUTE_LEADS}
          visits={visits}
        />
      )}

      {isAiModalOpen && (
        <AIAssistantModal
          lead={aiLeadContext}
          isOpen={isAiModalOpen}
          onClose={() => setIsAiModalOpen(false)}
        />
      )}
    </div>
  );
}
