import React from 'react';
import { Route, Map, Train, Database, FileText } from 'lucide-react';

interface BottomNavProps {
  activeTab: 'route' | 'map' | 'metro' | 'database';
  onChangeTab: (tab: 'route' | 'map' | 'metro' | 'database') => void;
  onOpenReport: () => void;
  completedCount: number;
  totalCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  onOpenReport,
  completedCount,
  totalCount
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[1500] bg-white border-t border-zinc-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-md mx-auto px-2 h-16 flex items-center justify-around">
        {/* Roteiro */}
        <button
          onClick={() => onChangeTab('route')}
          className={`flex-1 h-full flex flex-col items-center justify-center gap-1 transition active:scale-95 ${
            activeTab === 'route' ? 'text-black font-bold' : 'text-zinc-400 hover:text-zinc-600'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition ${activeTab === 'route' ? 'bg-zinc-100 text-black' : ''}`}>
            <Route className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight leading-none">Roteiro</span>
          {activeTab === 'route' && <span className="w-1 h-1 rounded-full bg-black -mt-0.5" />}
        </button>

        {/* Mapa */}
        <button
          onClick={() => onChangeTab('map')}
          className={`flex-1 h-full flex flex-col items-center justify-center gap-1 transition active:scale-95 ${
            activeTab === 'map' ? 'text-black font-bold' : 'text-zinc-400 hover:text-zinc-600'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition ${activeTab === 'map' ? 'bg-zinc-100 text-black' : ''}`}>
            <Map className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight leading-none">Mapa</span>
          {activeTab === 'map' && <span className="w-1 h-1 rounded-full bg-black -mt-0.5" />}
        </button>

        {/* Botão Central: Relatório Rápido */}
        <button
          onClick={onOpenReport}
          className="flex flex-col items-center justify-center px-2 transition active:scale-90 -mt-3"
          title="Relatório do Dia"
        >
          <div className="w-12 h-12 rounded-2xl bg-black text-white shadow-lg flex items-center justify-center border-2 border-white">
            <FileText className="w-5 h-5" />
          </div>
          <span className="text-[9px] font-bold text-zinc-900 mt-1">
            {completedCount}/{totalCount}
          </span>
        </button>

        {/* Metrô */}
        <button
          onClick={() => onChangeTab('metro')}
          className={`flex-1 h-full flex flex-col items-center justify-center gap-1 transition active:scale-95 ${
            activeTab === 'metro' ? 'text-black font-bold' : 'text-zinc-400 hover:text-zinc-600'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition ${activeTab === 'metro' ? 'bg-zinc-100 text-black' : ''}`}>
            <Train className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight leading-none">Metrô L5</span>
          {activeTab === 'metro' && <span className="w-1 h-1 rounded-full bg-black -mt-0.5" />}
        </button>

        {/* Base */}
        <button
          onClick={() => onChangeTab('database')}
          className={`flex-1 h-full flex flex-col items-center justify-center gap-1 transition active:scale-95 ${
            activeTab === 'database' ? 'text-black font-bold' : 'text-zinc-400 hover:text-zinc-600'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition ${activeTab === 'database' ? 'bg-zinc-100 text-black' : ''}`}>
            <Database className="w-5 h-5" />
          </div>
          <span className="text-[10px] tracking-tight leading-none">Base (+90)</span>
          {activeTab === 'database' && <span className="w-1 h-1 rounded-full bg-black -mt-0.5" />}
        </button>
      </div>
    </nav>
  );
};
