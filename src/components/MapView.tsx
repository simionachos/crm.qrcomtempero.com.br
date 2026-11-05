import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { RouteLead, MetroStation, GeneralLead, VisitStatus } from '../types';
import { STARTING_POINT } from '../data/leadsData';
import { Navigation, Locate, Eye, Train, MapPin } from 'lucide-react';

interface MapViewProps {
  routeLeads: RouteLead[];
  activeLeadId: number;
  onSelectLead: (leadId: number) => void;
  leadStatuses: Record<number, VisitStatus>;
  metroStations: MetroStation[];
  nearbyLeads: GeneralLead[];
}

export const MapView: React.FC<MapViewProps> = ({
  routeLeads,
  activeLeadId,
  onSelectLead,
  leadStatuses,
  metroStations,
  nearbyLeads
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLineLayerRef = useRef<L.Polyline | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const [showMetro, setShowMetro] = useState(true);
  const [showNearby, setShowNearby] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Inicializar o Mapa
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [-23.625, -46.685],
        zoom: 13,
        zoomControl: false
      });

      L.control.zoom({ position: 'topright' }).addTo(map);

      // OpenStreetMap Tiles (renderizado em escala de cinza via CSS da classe monochrome-map)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 19
      }).addTo(map);

      const markersGroup = L.layerGroup().addTo(map);
      markersLayerRef.current = markersGroup;
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Atualizar marcadores e traçado
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    // 1. Ponto de Partida (Preto e Branco)
    const startIcon = L.divIcon({
      className: 'custom-start-marker',
      html: `
        <div class="flex items-center justify-center w-8 h-8 rounded-lg bg-black text-white shadow-md border-2 border-white font-mono font-bold text-xs">
          0
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16]
    });

    const startMarker = L.marker([STARTING_POINT.lat, STARTING_POINT.lng], { icon: startIcon });
    startMarker.bindPopup(`
      <div class="p-2 text-black font-sans min-w-[200px]">
        <div class="text-[10px] font-mono font-bold text-zinc-500 uppercase">PONTO DE PARTIDA</div>
        <div class="font-bold text-sm text-black mt-0.5">${STARTING_POINT.name}</div>
        <div class="text-xs text-zinc-600 mt-1">${STARTING_POINT.address}</div>
      </div>
    `);
    markersGroup.addLayer(startMarker);

    // 2. Traçado da Rota (Linha preta pontilhada elegante)
    const latLngs: [number, number][] = [
      [STARTING_POINT.lat, STARTING_POINT.lng],
      ...routeLeads.map(l => [l.lat, l.lng] as [number, number])
    ];

    if (routeLineLayerRef.current) {
      routeLineLayerRef.current.remove();
    }

    const polyline = L.polyline(latLngs, {
      color: '#000000',
      weight: 3.5,
      opacity: 0.9,
      dashArray: '5, 8',
      lineCap: 'round'
    }).addTo(markersGroup);
    routeLineLayerRef.current = polyline;

    // 3. Marcadores dos Leads (Preto e Branco Minimalistas)
    routeLeads.forEach(lead => {
      const isSelected = lead.id === activeLeadId;
      const status = leadStatuses[lead.id];
      const isCompleted = status === 'scheduled' || status === 'visited' || status === 'in_progress';

      const customIcon = L.divIcon({
        className: 'route-lead-marker',
        html: `
          <div class="relative cursor-pointer transition-transform duration-150 active:scale-95">
            <div class="flex items-center justify-center w-8 h-8 rounded-full shadow-md font-mono font-bold text-xs transition-all ${
              isSelected
                ? 'bg-black text-white ring-4 ring-zinc-400 scale-110'
                : isCompleted
                ? 'bg-zinc-800 text-white border-2 border-white'
                : 'bg-white text-black border-2 border-black'
            }">
              ${isCompleted ? '✓' : lead.order}
            </div>
            ${isSelected ? '<span class="absolute -top-1 -right-1 flex h-2.5 w-2.5"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span><span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-black"></span></span>' : ''}
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
      });

      const marker = L.marker([lead.lat, lead.lng], { icon: customIcon });

      const popupContent = document.createElement('div');
      popupContent.className = 'p-2 text-black font-sans min-w-[220px] max-w-[260px]';
      popupContent.innerHTML = `
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-mono font-bold text-white bg-black px-2 py-0.5 rounded">
            PARADA ${lead.order}
          </span>
          <span class="text-[10px] font-mono text-zinc-500 font-medium">${lead.walkingFromPrev.duration}</span>
        </div>
        <div class="font-bold text-sm text-black mt-1.5">${lead.name}</div>
        <div class="text-[11px] text-zinc-500">${lead.category}</div>
        <div class="text-xs text-zinc-700 mt-1.5 p-2 rounded-lg bg-zinc-100 border border-zinc-200">
          <div><strong>👤 Procurar:</strong> ${lead.targetContact}</div>
          <div class="mt-0.5"><strong>⏰ Horário:</strong> ${lead.bestTime}</div>
        </div>
        <div class="mt-2.5 flex items-center gap-1.5 pt-1 border-t border-zinc-200">
          <button id="btn-select-${lead.id}" class="flex-1 bg-black text-white text-xs py-2 px-2 rounded-lg font-bold transition active:scale-95">
            Ver Briefing
          </button>
          <a href="${lead.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lead.name + ' ' + lead.address)}`}" target="_blank" rel="noopener noreferrer" class="bg-zinc-100 border border-zinc-300 text-black text-xs p-2 rounded-lg transition" title="Google Maps">
            🧭
          </a>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-select-${lead.id}`);
        if (btn) {
          btn.onclick = () => {
            onSelectLead(lead.id);
            marker.closePopup();
          };
        }
      });

      marker.on('click', () => {
        onSelectLead(lead.id);
      });

      markersGroup.addLayer(marker);
    });

    // 4. Marcadores do Metrô
    if (showMetro) {
      metroStations.forEach(station => {
        const metroIcon = L.divIcon({
          className: 'metro-station-marker',
          html: `
            <div class="flex items-center justify-center w-7 h-7 rounded-md bg-zinc-700 text-white shadow-sm border border-white font-mono font-bold text-[10px]" title="${station.name}">
              M
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
          popupAnchor: [0, -14]
        });

        const metroMarker = L.marker([station.lat, station.lng], { icon: metroIcon });
        metroMarker.bindPopup(`
          <div class="p-2 text-black font-sans min-w-[200px]">
            <div class="text-[10px] font-mono font-bold text-zinc-500 uppercase">METRÔ LINHA 5 - LILÁS</div>
            <div class="font-bold text-sm text-black mt-0.5">${station.name}</div>
            <p class="text-xs text-zinc-600 mt-1 bg-zinc-100 p-2 rounded-lg border border-zinc-200">${station.tip}</p>
          </div>
        `);
        markersGroup.addLayer(metroMarker);
      });
    }

    // 5. Leads Adicionais
    if (showNearby) {
      nearbyLeads.slice(0, 30).forEach(nLead => {
        let lat = -23.6300;
        let lng = -46.6850;
        if (nLead.neighborhood.includes('Mariana')) {
          lat = -23.5880 + (Math.random() - 0.5) * 0.012;
          lng = -46.6380 + (Math.random() - 0.5) * 0.012;
        } else if (nLead.neighborhood.includes('Brooklin')) {
          lat = -23.6180 + (Math.random() - 0.5) * 0.012;
          lng = -46.6880 + (Math.random() - 0.5) * 0.012;
        } else if (nLead.neighborhood.includes('Santo Amaro')) {
          lat = -23.6450 + (Math.random() - 0.5) * 0.012;
          lng = -46.7050 + (Math.random() - 0.5) * 0.012;
        } else {
          lat = -23.6050 + (Math.random() - 0.5) * 0.012;
          lng = -46.6750 + (Math.random() - 0.5) * 0.012;
        }

        const nearbyIcon = L.divIcon({
          className: 'nearby-lead-marker',
          html: `
            <div class="w-3 h-3 rounded-full bg-zinc-400 border border-white opacity-70"></div>
          `,
          iconSize: [12, 12],
          iconAnchor: [6, 6]
        });

        const nMarker = L.marker([lat, lng], { icon: nearbyIcon });
        nMarker.bindPopup(`
          <div class="p-1.5 text-black font-sans min-w-[180px]">
            <div class="text-[9px] font-mono text-zinc-400 uppercase">Base de Dados (${nLead.neighborhood})</div>
            <div class="font-bold text-xs text-black">${nLead.name}</div>
            <div class="text-[11px] text-zinc-600">${nLead.address}</div>
          </div>
        `);
        markersGroup.addLayer(nMarker);
      });
    }

    const targetLead = routeLeads.find(l => l.id === activeLeadId);
    if (targetLead) {
      map.panTo([targetLead.lat, targetLead.lng], { animate: true, duration: 0.5 });
    }
  }, [routeLeads, activeLeadId, leadStatuses, showMetro, showNearby, nearbyLeads, onSelectLead]);

  const handleLocateUser = () => {
    setIsLocating(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Geolocalização não suportada.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setIsLocating(false);

        const map = mapInstanceRef.current;
        if (map) {
          map.setView([latitude, longitude], 15, { animate: true });

          if (userMarkerRef.current) {
            userMarkerRef.current.setLatLng([latitude, longitude]);
          } else {
            const userIcon = L.divIcon({
              className: 'user-location-marker',
              html: `
                <div class="relative flex items-center justify-center">
                  <span class="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-black opacity-40"></span>
                  <div class="w-4 h-4 rounded-full bg-black border-2 border-white shadow-md"></div>
                </div>
              `,
              iconSize: [16, 16],
              iconAnchor: [8, 8]
            });

            const marker = L.marker([latitude, longitude], { icon: userIcon });
            marker.bindPopup(`<div class="p-1 font-mono text-xs font-bold">SUA POSIÇÃO ATUAL</div>`);
            marker.addTo(map);
            userMarkerRef.current = marker;
          }
        }
      },
      () => {
        setLocationError('Permissão de GPS necessária.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const handleFitEntireRoute = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const bounds = L.latLngBounds([
      [STARTING_POINT.lat, STARTING_POINT.lng],
      ...routeLeads.map(l => [l.lat, l.lng] as [number, number])
    ]);
    map.fitBounds(bounds, { padding: [30, 30], animate: true });
  };

  return (
    <div className="space-y-2 max-w-md mx-auto">
      {/* Botões de Ação de Mapa no Topo (Monocromáticos e fáceis de tocar) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        <button
          onClick={handleLocateUser}
          disabled={isLocating}
          className={`h-11 px-3.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 whitespace-nowrap transition active:scale-95 ${
            userLocation ? 'bg-black text-white border-black' : 'bg-white text-black border-zinc-300 hover:bg-zinc-100'
          }`}
        >
          <Locate className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
          <span>{isLocating ? 'GPS...' : userLocation ? 'GPS Ativo' : 'Onde Estou'}</span>
        </button>

        <button
          onClick={handleFitEntireRoute}
          className="h-11 px-3.5 rounded-xl border border-zinc-300 bg-white hover:bg-zinc-100 text-black text-xs font-mono font-bold flex items-center gap-1.5 whitespace-nowrap transition active:scale-95"
        >
          <Navigation className="w-4 h-4" />
          <span>Rota Toda</span>
        </button>

        <button
          onClick={() => setShowMetro(!showMetro)}
          className={`h-11 px-3.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 whitespace-nowrap transition active:scale-95 ${
            showMetro ? 'bg-black text-white border-black' : 'bg-white text-black border-zinc-300 hover:bg-zinc-100'
          }`}
        >
          <Train className="w-4 h-4" />
          <span>Metrô {showMetro ? '✓' : ''}</span>
        </button>

        <button
          onClick={() => setShowNearby(!showNearby)}
          className={`h-11 px-3.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 whitespace-nowrap transition active:scale-95 ${
            showNearby ? 'bg-black text-white border-black' : 'bg-white text-black border-zinc-300 hover:bg-zinc-100'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>+Leads {showNearby ? '✓' : ''}</span>
        </button>
      </div>

      {/* Contêiner Leaflet com Classe monochrome-map */}
      <div className="relative w-full h-[360px] sm:h-[420px] rounded-3xl overflow-hidden border-2 border-black monochrome-map shadow-sm">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {locationError && (
          <div className="absolute top-3 left-3 right-3 z-[1000] bg-black text-white text-xs px-3 py-2 rounded-xl shadow font-mono text-center">
            {locationError}
          </div>
        )}
      </div>

      {/* Legenda Monocromática */}
      <div className="p-3 bg-white rounded-2xl border border-zinc-200 text-[11px] font-mono flex items-center justify-between text-zinc-600">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-black font-bold">
            <span className="w-3.5 h-3.5 rounded-full bg-black text-white text-[8px] flex items-center justify-center">1</span>
            Paradas (1 a 11)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3.5 h-3.5 rounded-md bg-zinc-700 text-white text-[8px] flex items-center justify-center">M</span>
            Metrô L5
          </span>
        </div>
        <span className="text-zinc-500">Total: ~18,5 km</span>
      </div>
    </div>
  );
};
