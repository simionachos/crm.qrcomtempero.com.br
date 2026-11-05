import { VisitLog, VisitStatus } from '../types';

const STORAGE_KEY_VISITS = 'sdr_prospecting_visits_v1';
const STORAGE_KEY_STATUSES = 'sdr_prospecting_lead_statuses_v1';
const STORAGE_KEY_ACTIVE_STOP = 'sdr_prospecting_active_stop_v1';

export function getSavedVisits(): VisitLog[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_VISITS);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Erro ao ler visits do storage', err);
    return [];
  }
}

export function saveVisit(visit: VisitLog): VisitLog[] {
  try {
    const visits = getSavedVisits();
    // Se já houver registro recente desse lead, atualizamos ou criamos novo
    const existingIndex = visits.findIndex(v => v.leadId === visit.leadId);
    let updated: VisitLog[];
    if (existingIndex >= 0) {
      updated = [...visits];
      updated[existingIndex] = visit;
    } else {
      updated = [visit, ...visits];
    }
    localStorage.setItem(STORAGE_KEY_VISITS, JSON.stringify(updated));

    // Salvar também o status do lead
    saveLeadStatus(visit.leadId, visit.status);

    return updated;
  } catch (err) {
    console.error('Erro ao salvar visit no storage', err);
    return [];
  }
}

export function getLeadStatuses(): Record<number, VisitStatus> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_STATUSES);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function saveLeadStatus(leadId: number, status: VisitStatus): void {
  try {
    const current = getLeadStatuses();
    current[leadId] = status;
    localStorage.setItem(STORAGE_KEY_STATUSES, JSON.stringify(current));
  } catch (err) {
    console.error('Erro ao salvar status', err);
  }
}

export function getActiveStopId(): number {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ACTIVE_STOP);
    return raw ? parseInt(raw, 10) : 1;
  } catch {
    return 1;
  }
}

export function setActiveStopId(id: number): void {
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVE_STOP, String(id));
  } catch (err) {
    console.error('Erro ao salvar active stop', err);
  }
}

export function clearAllProspectingData(): void {
  localStorage.removeItem(STORAGE_KEY_VISITS);
  localStorage.removeItem(STORAGE_KEY_STATUSES);
  localStorage.removeItem(STORAGE_KEY_ACTIVE_STOP);
}
