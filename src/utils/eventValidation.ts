import dayjs from 'dayjs';
//INI SPEC-003 - 02
// Importación y re-exportación de tipos de categorías y utilidades de resolución
import type { CalendarEvent, EventCategory } from '../types/calendar';
import { resolveEventCategory, getCategoryMeta, isValidCategory } from './categoryUtils';
export { resolveEventCategory, getCategoryMeta, isValidCategory };
//FIN SPEC-003 - 02

export const TITLE_MIN = 2;
export const TITLE_MAX = 80;
export const DESCRIPTION_MAX = 500;
export const DATE_MIN = '1900-01-01';
export const DATE_MAX = '2100-12-31';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const TIME_STORAGE_RE = /^(([01]\d|2[0-3]):[0-5]\d(\s*-\s*([01]\d|2[0-3]):[0-5]\d)?|todo el d[ií]a)$/i;

export interface EventFormValues {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  //INI SPEC-003 - 02
  // Categoría semántica del evento
  category?: EventCategory;
  //FIN SPEC-003 - 02
}

export type EventFormErrors = Partial<Record<keyof EventFormValues, string>>;

/** Elimina espacios sobrantes y colapsa espacios internos repetidos. */
export const normalizeTitle = (title: string): string => title.trim().replace(/\s+/g, ' ');

/** Valida una fecha `YYYY-MM-DD` real (rechaza 2026-02-30, años de 5 dígitos, etc.). */
export const isValidDateStr = (date: string): boolean => {
  if (!DATE_RE.test(date)) return false;
  const parsed = dayjs(date);
  return parsed.isValid() && parsed.format('YYYY-MM-DD') === date;
};

export const isValidTimeStr = (time: string): boolean => TIME_RE.test(time);

export const isValidStorageTimeStr = (time: string): boolean => TIME_STORAGE_RE.test(time);

/** Devuelve los errores por campo; objeto vacío si todo es válido. */
export const validateEventForm = (values: EventFormValues): EventFormErrors => {
  const errors: EventFormErrors = {};
  const title = normalizeTitle(values.title);

  if (!title) errors.title = 'El título no puede estar vacío.';
  else if (title.length < TITLE_MIN) errors.title = `El título debe tener al menos ${TITLE_MIN} caracteres.`;
  else if (title.length > TITLE_MAX) errors.title = `El título no puede superar los ${TITLE_MAX} caracteres.`;

  if (values.description.trim().length > DESCRIPTION_MAX) {
    errors.description = `La descripción no puede superar los ${DESCRIPTION_MAX} caracteres.`;
  }

  if (!values.date) errors.date = 'Selecciona una fecha.';
  else if (!isValidDateStr(values.date)) errors.date = 'La fecha no es válida.';
  else if (values.date < DATE_MIN || values.date > DATE_MAX) {
    errors.date = 'La fecha debe estar entre los años 1900 y 2100.';
  }

  if (values.startTime && !isValidTimeStr(values.startTime)) {
    errors.startTime = 'La hora de inicio no es válida.';
  }

  if (values.endTime && !isValidTimeStr(values.endTime)) {
    errors.endTime = 'La hora de fin no es válida.';
  }

  if (
    values.startTime &&
    values.endTime &&
    isValidTimeStr(values.startTime) &&
    isValidTimeStr(values.endTime)
  ) {
    if (values.startTime >= values.endTime) {
      errors.startTime = 'La hora de inicio debe ser anterior a la de fin.';
      errors.endTime = 'La hora de fin debe ser posterior a la de inicio.';
    }
  }

  //INI SPEC-003 - 02
  // Validación de categoría si fue provista
  if (values.category !== undefined && !isValidCategory(values.category)) {
    errors.category = 'La categoría seleccionada no es válida.';
  }
  //FIN SPEC-003 - 02

  return errors;
};

/** Formatea las horas de inicio y fin para almacenar en `time`. */
export const formatEventTime = (startTime: string, endTime: string): string | undefined => {
  if (startTime && endTime) return `${startTime} - ${endTime}`;
  if (startTime) return startTime;
  if (endTime) return endTime;
  return undefined;
};

/** Parsea la cadena `time` guardada ('08:30 - 09:15', '10:30', 'Todo el día', etc.) a startTime y endTime. */
export const parseEventTime = (time?: string): { startTime: string; endTime: string } => {
  if (!time || /^todo el d[ií]a$/i.test(time)) {
    return { startTime: '', endTime: '' };
  }
  const parts = time.split('-').map((s) => s.trim());
  if (parts.length === 2 && isValidTimeStr(parts[0]) && isValidTimeStr(parts[1])) {
    return { startTime: parts[0], endTime: parts[1] };
  }
  if (parts.length === 1 && isValidTimeStr(parts[0])) {
    return { startTime: parts[0], endTime: '' };
  }
  return { startTime: '', endTime: '' };
};

/** Busca un evento idéntico (mismo título, fecha y hora), excluyendo el que se edita. */
export const findDuplicate = (
  values: EventFormValues,
  events: CalendarEvent[],
  excludeId?: string,
): CalendarEvent | undefined => {
  const title = normalizeTitle(values.title).toLowerCase();
  const formattedTime = formatEventTime(values.startTime, values.endTime) ?? '';
  return events.find(
    (e) =>
      e.id !== excludeId &&
      e.date === values.date &&
      (e.time ?? '') === formattedTime &&
      e.title.toLowerCase() === title,
  );
};

/** Filtra los eventos leídos de almacenamiento, descartando los mal formados. */
export const sanitizeEvents = (data: unknown): CalendarEvent[] => {
  if (!Array.isArray(data)) return [];
  //INI SPEC-003 - 02
  // Valida estructura y garantiza la resolución de category manteniendo retrocompatibilidad
  return data
    .filter((item): item is CalendarEvent => {
      if (typeof item !== 'object' || item === null) return false;
      const e = item as Record<string, unknown>;
      return (
        typeof e.id === 'string' &&
        e.id.length > 0 &&
        typeof e.title === 'string' &&
        typeof e.date === 'string' &&
        isValidDateStr(e.date) &&
        (e.time === undefined || (typeof e.time === 'string' && isValidStorageTimeStr(e.time))) &&
        (e.description === undefined || typeof e.description === 'string') &&
        (e.color === undefined || typeof e.color === 'string') &&
        (e.category === undefined || isValidCategory(e.category) || typeof e.category === 'string')
      );
    })
    .map((item) => {
      const e = item as CalendarEvent;
      return {
        ...e,
        category: resolveEventCategory(e),
      };
    });
  //FIN SPEC-003 - 02
};

/** Ordena: primero eventos sin hora o "Todo el día", luego por hora ascendente. */
export const sortEventsByTime = (events: CalendarEvent[]): CalendarEvent[] =>
  [...events].sort((a, b) => {
    const aAll = !a.time || /^todo el d[ií]a$/i.test(a.time);
    const bAll = !b.time || /^todo el d[ií]a$/i.test(b.time);
    if (aAll && bAll) return 0;
    if (aAll) return -1;
    if (bAll) return 1;
    return (a.time ?? '').localeCompare(b.time ?? '');
  });

/** Genera un ID único; `crypto.randomUUID` solo existe en contextos seguros (HTTPS/localhost). */
export const generateId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
};

