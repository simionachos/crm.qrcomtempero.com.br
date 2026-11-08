import React, { useState } from 'react';
import { METRO_STATIONS, OFFICIAL_METRO_LINES } from '../data/leadsData';
import {
  Train,
  ArrowRight,
  ExternalLink,
  MapPin,
  Clock,
  Zap,
  CreditCard,
  ChevronDown,
  ChevronUp,
  Compass,
  CheckCircle2
} from 'lucide-react';

export const MetroTipsView: React.FC = () => {
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const [showAllLines, setShowAllLines] = useState(false);

  return (
    <div className="space-y-4 w-full pb-6">
      {/* ======================================================== */}
      {/* BANNER PRINCIPAL COM COR OFICIAL DA LINHA 5 - LILÁS     */}
      {/* (Hex Oficial Metrô SP: #9B3894)                         */}
      {/* ======================================================== */}
      <div
        className="text-white p-5 rounded-3xl shadow-md space-y-3.5 relative overflow-hidden"
        style={{ backgroundColor: '#9B3894' }}
      >
        {/* Marca d'água estilizada com o número da Linha */}
        <div className="absolute -right-3 -bottom-6 text-white/15 font-black text-9xl pointer-events-none select-none font-sans">
          5
        </div>

        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-white text-[#9B3894] font-black text-lg flex items-center justify-center shadow-xs">
              5
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-lg font-black tracking-tight text-white leading-tight">
                  Linha 5 - Lilás
                </h3>
                <span className="text-[10px] font-mono font-bold bg-white/20 text-white px-2 py-0.5 rounded-full">
                  ViaMobilidade
                </span>
              </div>
              <p className="text-xs text-white/90 font-mono">
                Capão Redondo ⇄ Chácara Klabin
              </p>
            </div>
          </div>

          <a
            href="https://www.metro.sp.gov.br/pt_BR/sua-viagem/linhas-estacoes/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition active:scale-90"
            title="Abrir site oficial do Metrô SP"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="relative z-10 pt-1">
          <div className="p-3 bg-black/25 rounded-2xl border border-white/20 space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Estratégia do SDR de Campo</span>
            </div>
            <p className="text-xs text-white/90 leading-relaxed">
              O corredor da Linha 5 corre exatamente paralelo à sua rota de prospecção.
              Nas pernas mais longas entre bairros, use o metrô para não perder a janela de almoço dos tomadores de decisão!
            </p>
          </div>
        </div>

        {/* Tarifa e Acesso por Aproximação */}
        <div className="relative z-10 pt-1 flex items-center justify-between text-[11px] font-mono text-white/90 bg-white/10 px-3 py-2 rounded-xl">
          <div className="flex items-center gap-1.5">
            <CreditCard className="w-3.5 h-3.5" />
            <span>Tarifa: <strong>R$ 5,00</strong></span>
          </div>
          <span>Aceita Cartão / NFC na Catraca</span>
        </div>
      </div>

      {/* ======================================================== */}
      {/* COMPARATIVOS DE ECONOMIA DE TEMPO DO SDR                */}
      {/* ======================================================== */}
      <div className="bg-white rounded-3xl border border-zinc-200 p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-black" />
            <span>ECONOMIA CRÍTICA DE TEMPO</span>
          </div>
          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold border border-emerald-200">
            Até -46 min
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {/* Card 1: Moema ➔ Chácara Klabin */}
          <div className="p-3.5 rounded-2xl border border-zinc-200 bg-zinc-50 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-5 h-5 rounded-md text-white font-mono font-bold text-[11px] flex items-center justify-center shrink-0"
                    style={{ backgroundColor: '#9B3894' }}
                  >
                    5
                  </span>
                  <span className="font-bold text-sm text-black">
                    Moema ➔ Chácara Klabin
                  </span>
                </div>
                <span className="text-xs font-mono font-black text-white px-2 py-0.5 rounded bg-black">
                  -46 MIN
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2">
                <div className="p-2 rounded-xl bg-white border border-zinc-200">
                  <span className="text-[10px] text-zinc-400 block uppercase">Caminhada a pé</span>
                  <strong className="text-zinc-800 text-xs">~4,7 km (58 min)</strong>
                  <span className="text-[10px] text-rose-600 block mt-0.5 font-sans">Perna desgastante</span>
                </div>
                <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] text-emerald-700 block uppercase">Metrô Linha 5</span>
                  <strong className="text-emerald-900 text-xs">6 estações (12 min)</strong>
                  <span className="text-[10px] text-emerald-700 block mt-0.5 font-sans">Direto sem baldeação</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-zinc-600 leading-tight pt-2 border-t border-zinc-200/60 mt-2">
              💡 <strong>Dica Pro:</strong> Ao sair do Koi Restaurante (Moema), caminhe 600m até a Estação Moema.
              Desembarque na <strong>Chácara Klabin</strong>; o Villa Klabin (Parada 11) fica a apenas 350 metros da catraca!
            </p>
          </div>

          {/* Card 2: Campo Belo ➔ Eucaliptos */}
          <div className="p-3.5 rounded-2xl border border-zinc-200 bg-zinc-50 space-y-2 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className="w-5 h-5 rounded-md text-white font-mono font-bold text-[11px] flex items-center justify-center shrink-0"
                    style={{ backgroundColor: '#9B3894' }}
                  >
                    5
                  </span>
                  <span className="font-bold text-sm text-black">
                    Campo Belo ➔ Eucaliptos
                  </span>
                </div>
                <span className="text-xs font-mono font-black text-white px-2 py-0.5 rounded bg-black">
                  -25 MIN
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2">
                <div className="p-2 rounded-xl bg-white border border-zinc-200">
                  <span className="text-[10px] text-zinc-400 block uppercase">Caminhada a pé</span>
                  <strong className="text-zinc-800 text-xs">~2,6 km (33 min)</strong>
                </div>
                <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200">
                  <span className="text-[10px] text-emerald-700 block uppercase">Metrô Linha 5</span>
                  <strong className="text-emerald-900 text-xs">2 estações (5 min)</strong>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-zinc-600 leading-tight pt-2 border-t border-zinc-200/60 mt-2">
              Atravesse a divisa entre Campo Belo e Vila Olímpia (Comino) rapidamente pelo metrô, poupando energia e tempo antes das 11h.
            </p>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* DIAGRAMA DAS ESTAÇÕES NO CORREDOR DA PROSPECÇÃO          */}
      {/* Cores Oficiais: Linha 5 Lilás (#9B3894), L2 Verde (#008060) */}
      {/* L1 Azul (#0153A0) e L17 Ouro (#CCA827)                   */}
      {/* ======================================================== */}
      <div className="bg-white rounded-3xl border border-zinc-200 p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="text-[11px] font-mono font-bold uppercase tracking-widest text-zinc-500">
            ESTAÇÕES DO CORREDOR (LINHA 5 - LILÁS)
          </div>
          <span className="text-[10px] font-mono text-zinc-400">
            Toque para detalhes
          </span>
        </div>

        {/* Linha Vertical de Estações com Marcador Oficial */}
        <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-1 before:rounded-full before:bg-[#9B3894]">
          {METRO_STATIONS.map((station, idx) => {
            const isSelected = selectedStationId === station.id;

            return (
              <div
                key={station.id}
                onClick={() => setSelectedStationId(isSelected ? null : station.id)}
                className={`relative p-3 rounded-2xl border transition cursor-pointer ${
                  isSelected
                    ? 'border-black bg-zinc-50 shadow-xs'
                    : 'border-zinc-200 bg-white hover:border-zinc-300'
                }`}
              >
                {/* Marcador na linha */}
                <div
                  className="absolute -left-[27px] top-4 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center shadow-xs"
                  style={{ backgroundColor: station.lineColor || '#9B3894' }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>

                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className="w-5 h-5 rounded font-mono font-bold text-[10px] text-white flex items-center justify-center shrink-0"
                        style={{ backgroundColor: station.lineColor || '#9B3894' }}
                      >
                        {station.lineCode || '5'}
                      </span>

                      <h4 className="font-bold text-sm text-black">
                        {station.name}
                      </h4>

                      {/* Baldeações Oficiais (Linha 2 Verde, Linha 1 Azul, etc) */}
                      {station.transfers?.map((trans) => (
                        <span
                          key={trans.code}
                          className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold shadow-2xs"
                          style={{
                            backgroundColor: trans.color,
                            color: trans.textColor || '#FFFFFF'
                          }}
                          title={`Conexão com ${trans.name}`}
                        >
                          L{trans.code}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-zinc-600 mt-1 leading-snug">
                      {station.tip}
                    </p>

                    {station.address && (
                      <div className="text-[10px] text-zinc-400 font-mono mt-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-zinc-400 shrink-0" />
                        <span>{station.address}</span>
                      </div>
                    )}
                  </div>

                  {station.nearbyStops.length > 0 && (
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="text-[9px] font-mono uppercase text-zinc-500 font-bold">
                        Paradas
                      </span>
                      <div className="flex items-center gap-1">
                        {station.nearbyStops.map(s => (
                          <span
                            key={s}
                            className="w-5 h-5 rounded bg-black text-white font-mono font-bold text-[10px] flex items-center justify-center shadow-2xs"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {isSelected && (
                  <div className="mt-3 pt-2.5 border-t border-zinc-200 flex gap-2">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(station.name + ' São Paulo')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 h-9 rounded-xl bg-black text-white hover:bg-zinc-800 text-xs font-bold font-mono flex items-center justify-center gap-1.5 transition active:scale-95"
                    >
                      <MapPin className="w-3.5 h-3.5" />
                      <span>Abrir no Google Maps</span>
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* GUIA DE TODAS AS LINHAS DO METRÔ SP COM CORES OFICIAIS    */}
      {/* (metro.sp.gov.br/pt_BR/sua-viagem/linhas-estacoes/)      */}
      {/* ======================================================== */}
      <div className="bg-white rounded-3xl border border-zinc-200 p-4 space-y-3 shadow-xs">
        <button
          onClick={() => setShowAllLines(!showAllLines)}
          className="w-full flex items-center justify-between text-left transition active:opacity-75"
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-zinc-900 text-white flex items-center justify-center">
              <Train className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-black text-black leading-tight">
                Cores Oficiais das Linhas (Metrô SP)
              </div>
              <p className="text-[10px] font-mono text-zinc-500">
                Padrão visual oficial da rede de trilhos
              </p>
            </div>
          </div>
          {showAllLines ? <ChevronUp className="w-4 h-4 text-zinc-500" /> : <ChevronDown className="w-4 h-4 text-zinc-500" />}
        </button>

        {showAllLines && (
          <div className="pt-2 border-t border-zinc-100 space-y-2 animate-in fade-in duration-150">
            <p className="text-[11px] text-zinc-500 leading-tight">
              Cores padronizadas pelo Metrô de São Paulo e CPTM conforme a sinalização oficial das estações:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 pt-1">
              {OFFICIAL_METRO_LINES.map((line) => (
                <div
                  key={line.code}
                  className="p-2.5 rounded-xl border border-zinc-200 bg-zinc-50 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className="w-6 h-6 rounded-lg font-mono font-black text-xs flex items-center justify-center shrink-0 shadow-xs"
                      style={{
                        backgroundColor: line.color,
                        color: line.textColor
                      }}
                    >
                      {line.code}
                    </span>
                    <div>
                      <div className="text-xs font-black text-black leading-tight">
                        {line.name}
                      </div>
                      <div className="text-[10px] text-zinc-500 font-mono">
                        {line.route}
                      </div>
                    </div>
                  </div>

                  <span
                    className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border"
                    style={{
                      borderColor: line.color,
                      color: line.color === '#FED304' ? '#B28900' : line.color
                    }}
                  >
                    {line.color}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 text-center">
              <a
                href="https://www.metro.sp.gov.br/pt_BR/sua-viagem/linhas-estacoes/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-black underline flex items-center justify-center gap-1 hover:text-zinc-700"
              >
                <span>Consultar Linhas e Estações no Portal Oficial</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
