export type VisitStatus = 
  | 'pending'
  | 'scheduled'      // Reunião agendada
  | 'in_progress'    // Falou com decisor / Em negociação
  | 'return_later'   // Retornar mais tarde
  | 'absent'         // Ausente / Recado deixado
  | 'not_interested' // Não tem interesse
  | 'visited';       // Visitado genérico

export interface RouteLead {
  id: number;
  order: number;
  name: string;
  category: string;
  address: string;
  lat: number;
  lng: number;
  targetContact: string;
  bestTime: string;
  bestTimeNote: string;
  walkingFromPrev: {
    distance: string;
    duration: string;
    notes?: string;
  };
  stage: {
    number: number;
    title: string;
    badgeColor: string;
  };
  phone?: string;
  whatsapp?: string;
  site?: string;
  instagram?: string;
  googleMapsUrl?: string;
  rating?: number;
  reviewsCount?: number;
  contactHistory: string;
  pitchTips: {
    gatekeeper: string;
    decisionMakerPitch: string;
    hook: string;
  };
  metroTip?: {
    station: string;
    line: string;
    advice: string;
  };
}

export interface VisitLog {
  id: string;
  leadId: number;
  leadName: string;
  timestamp: string;
  status: VisitStatus;
  contactSpokenTo: string;
  notes: string;
  nextFollowUpDate?: string;
  audioTranscription?: string;
}

export interface GeneralLead {
  id: string;
  name: string;
  category: string;
  address: string;
  neighborhood: string;
  phone?: string;
  whatsapp?: string;
  email?: string;
  site?: string;
  instagram?: string;
  partners?: string;
  cnpj?: string;
  rating?: number;
  reviews?: number;
  mapsUrl?: string;
  notes?: string;
  isPriority?: boolean;
}

export interface MetroStation {
  id: string;
  name: string;
  line: string;
  lat: number;
  lng: number;
  nearbyStops: number[];
  tip: string;
}
