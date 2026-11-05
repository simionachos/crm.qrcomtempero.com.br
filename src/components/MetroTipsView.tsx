import React from 'react';
import { METRO_STATIONS } from '../data/leadsData';
import { Train, ArrowRight } from 'lucide-react';

export const MetroTipsView: React.FC = () => {
  return (
    <div className="space-y-4 max-w-md mx-auto">
      {/* Banner Principal Monocromático */}
      <div className="bg-black text-white p-5 rounded-3xl border-2 border-black space-y-3 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-700 flex items-center justify-center text-white">
            <Train className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-black tracking-tight">Metrô Linha 5 - Lilás</h3>
            <p className="text-xs text-zinc-400 font-mono">Linha paralela à rota de prospecção</p>
          </div>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed pt-1">
          💡 <strong>Estratégia do SDR:</strong> Não é obrigatório fazer os 18,5 km a pé. Use o metrô nas pernas mais longas para não perder o horário de almoço dos restaurantes:
        </p>

        {/* Comparativos de Economia de Tempo */}
        <div className="space-y-2 pt-1 font-mono text-xs">
          <div className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800 space-y-1">
            <div className="flex items-center justify-between text-white font-bold">
              <span>Moema ➔ Vila Mariana</span>
              <span className="text-[10px] bg-white text-black px-1.5 py-0.5 rounded font-black">-45 MIN</span>
            </div>
            <div className="text-[11px] text-zinc-400 flex items-center justify-between">
              <span>A pé: ~4,7 km (58 min)</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-white font-bold">Metrô: 6 paradas (12 min)</span>
            </div>
            <p className="text-[10px] text-zinc-400 font-sans mt-0.5">
              Estação Moema ➔ Chácara Klabin. O Villa Klabin fica a 350m da saída.
            </p>
          </div>

          <div className="p-3 bg-zinc-900 rounded-2xl border border-zinc-800 space-y-1">
            <div className="flex items-center justify-between text-white font-bold">
              <span>Campo Belo ➔ Vila Olímpia</span>
              <span className="text-[10px] bg-white text-black px-1.5 py-0.5 rounded font-black">-20 MIN</span>
            </div>
            <div className="text-[11px] text-zinc-400 flex items-center justify-between">
              <span>A pé: ~2,6 km (33 min)</span>
              <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
              <span className="text-white font-bold">Metrô: até Eucaliptos (8 min)</span>
            </div>
            <p className="text-[10px] text-zinc-400 font-sans mt-0.5">
              Desça em Eucaliptos para encurtar a travessia de bairro.
            </p>
          </div>
        </div>
      </div>

      {/* Lista de Estações no Corredor */}
      <div className="bg-white rounded-3xl border border-zinc-200 p-4 space-y-3 shadow-xs">
        <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-500">
          ESTAÇÕES NO CORREDOR DA CAMINHADA
        </div>

        <div className="space-y-2">
          {METRO_STATIONS.map((station, idx) => (
            <div
              key={station.id}
              className="p-3 rounded-2xl border border-zinc-200 bg-zinc-50 flex items-start gap-3"
            >
              <div className="w-7 h-7 rounded-lg bg-black text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-black">{station.name}</h4>
                  <span className="text-[10px] font-mono text-zinc-500 font-bold">
                    L5
                  </span>
                </div>
                <p className="text-xs text-zinc-600 mt-0.5">{station.tip}</p>
                <div className="text-[10px] font-mono text-zinc-500 mt-1">
                  Atende Paradas: {station.nearbyStops.map(s => `#${s}`).join(', ')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
