import React, { useState, useMemo } from 'react';
import { ALL_DATABASE_LEADS } from '../data/leadsData';
import { Search, MapPin, Phone, MessageSquare, ExternalLink, Star } from 'lucide-react';
import { WhatsAppIcon, WHATSAPP_PALETTE } from './WhatsAppIcon';

export const DatabaseView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('todos');
  const [onlyPriority, setOnlyPriority] = useState(false);

  const neighborhoods = useMemo(() => {
    const list = Array.from(new Set(ALL_DATABASE_LEADS.map(l => l.neighborhood))).filter(Boolean);
    return ['todos', ...list];
  }, []);

  const filteredLeads = useMemo(() => {
    return ALL_DATABASE_LEADS.filter(lead => {
      const matchSearch =
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (lead.partners && lead.partners.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (lead.notes && lead.notes.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchNeighborhood =
        selectedNeighborhood === 'todos' || lead.neighborhood === selectedNeighborhood;

      const matchPriority = !onlyPriority || lead.isPriority;

      return matchSearch && matchNeighborhood && matchPriority;
    });
  }, [searchTerm, selectedNeighborhood, onlyPriority]);

  return (
    <div className="space-y-4 w-full">
      {/* Busca Rápida Mobile & Desktop */}
      <div className="bg-white p-3.5 sm:p-4 rounded-3xl border border-zinc-200 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por restaurante, endereço, sócio..."
            className="w-full h-12 pl-10 pr-4 rounded-2xl border border-zinc-300 text-xs font-medium focus:outline-none focus:border-black"
          />
        </div>

        {/* Filtros em Pílulas */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setOnlyPriority(!onlyPriority)}
            className={`h-9 px-3 rounded-xl text-xs font-mono font-bold whitespace-nowrap transition active:scale-95 ${
              onlyPriority ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-800 border border-zinc-300'
            }`}
          >
            ★ Rota (11)
          </button>

          {neighborhoods.map(bairro => (
            <button
              key={bairro}
              onClick={() => setSelectedNeighborhood(bairro)}
              className={`h-9 px-3 rounded-xl text-xs font-mono font-bold whitespace-nowrap capitalize transition active:scale-95 ${
                selectedNeighborhood === bairro
                  ? 'bg-black text-white'
                  : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              {bairro}
            </button>
          ))}
        </div>
      </div>

      <div className="text-[11px] font-mono text-zinc-500 px-1 flex items-center justify-between">
        <span>{filteredLeads.length} RESTAURANTES ENCONTRADOS</span>
        {searchTerm && (
          <button onClick={() => setSearchTerm('')} className="text-black font-bold underline">
            Limpar
          </button>
        )}
      </div>

      {/* Grid Responsivo de Cards de Leads: 1 Coluna (Mobile), 2 Colunas (Tablet), 3 Colunas (Desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
        {filteredLeads.map(lead => (
          <div
            key={lead.id}
            className={`bg-white rounded-3xl p-4 sm:p-5 border flex flex-col justify-between transition shadow-xs hover:shadow-sm ${
              lead.isPriority ? 'border-2 border-black' : 'border-zinc-200'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                {lead.isPriority && (
                  <span className="inline-block bg-black text-white text-[9px] font-mono font-bold px-2 py-0.5 rounded mb-1">
                    ★ LEAD DA ROTA
                  </span>
                )}
                <h4 className="font-bold text-sm text-black leading-snug">{lead.name}</h4>
                <div className="text-[11px] text-zinc-500 font-mono mt-0.5">
                  {lead.category} • {lead.neighborhood}
                </div>
              </div>

              {lead.rating && (
                <div className="flex items-center gap-1 bg-zinc-100 border border-zinc-200 text-black px-2 py-0.5 rounded-md text-xs font-mono font-bold shrink-0">
                  <Star className="w-3 h-3 fill-black text-black" />
                  <span>{lead.rating}</span>
                </div>
              )}
            </div>

            <div className="text-xs text-zinc-600 mt-2 flex items-start gap-1">
              <MapPin className="w-3.5 h-3.5 text-black shrink-0 mt-0.5" />
              <span>{lead.address}</span>
            </div>

            {lead.partners && (
              <div className="text-[11px] text-zinc-600 mt-2 p-2 bg-zinc-50 rounded-xl border border-zinc-200">
                <strong className="text-black">Sócios:</strong> {lead.partners}
              </div>
            )}

            {lead.notes && (
              <div
                className={`text-[11px] mt-2 p-2 rounded-xl border font-medium ${
                  lead.notes.toLowerCase().includes('whatsapp')
                    ? 'border-emerald-300/60'
                    : 'bg-zinc-100 text-black border-zinc-200'
                }`}
                style={
                  lead.notes.toLowerCase().includes('whatsapp')
                    ? { backgroundColor: WHATSAPP_PALETTE.bubble, color: WHATSAPP_PALETTE.darkTeal }
                    : undefined
                }
              >
                {lead.notes.toLowerCase().includes('whatsapp') && (
                  <span className="inline-flex items-center gap-1 font-bold font-mono text-[9px] uppercase mr-1.5 opacity-90">
                    <WhatsAppIcon size={11} fill={WHATSAPP_PALETTE.darkTeal} />
                    ZAP:
                  </span>
                )}
                {lead.notes}
              </div>
            )}

            {/* Ações Rápidas */}
            <div className="mt-3 pt-2.5 border-t border-zinc-100 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                {lead.phone && (
                  <a
                    href={`tel:${lead.phone.replace(/[^0-9]/g, '')}`}
                    className="h-9 px-3 rounded-xl bg-zinc-100 border border-zinc-200 text-black text-xs font-mono font-bold flex items-center gap-1 transition active:scale-90"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Ligar</span>
                  </a>
                )}
                {lead.whatsapp && (
                  <a
                    href={`https://wa.me/${lead.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ backgroundColor: WHATSAPP_PALETTE.green }}
                    className="h-9 px-3 rounded-xl text-white text-xs font-mono font-bold flex items-center gap-1.5 transition active:scale-90 hover:opacity-90 shadow-2xs"
                  >
                    <WhatsAppIcon size={14} fill="#FFFFFF" />
                    <span>WhatsApp</span>
                  </a>
                )}
              </div>

              <a
                href={lead.mapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lead.name + ' ' + lead.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-mono font-bold text-black flex items-center gap-1 hover:underline"
              >
                <span>GPS</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
