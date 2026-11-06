//INI SPEC-003 - 01
// Utilidades puras de categorías, inferencia retrocompatible, extracción horaria y filtrado en vivo

import type { CalendarEvent, EventCategory } from '../types/calendar';

export interface CategoryMeta {
  id: EventCategory;
  label: 'Trabajo' | 'Personal' | 'Salud' | 'Importante';
  color: string;
  bgColor: string;
  textColor: string;
  bgVar: string;
  textVar: string;
  dotVar: string;
}

export const ALL_CATEGORIES: EventCategory[] = ['work', 'personal', 'health', 'important'];

export const DEFAULT_CATEGORY: EventCategory = 'work';

export const EVENT_CATEGORIES: CategoryMeta[] = [
  {
    id: 'work',
    label: 'Trabajo',
    color: '#2b6cb0',
    bgColor: '#e8f1f8',
    textColor: '#1e4e79',
    bgVar: 'var(--cat-work-bg)',
    textVar: 'var(--cat-work-text)',
    dotVar: 'var(--cat-work-dot)',
  },
  {
    id: 'personal',
    label: 'Personal',
    color: '#2f855a',
    bgColor: '#eaf5ee',
    textColor: '#1b5e3a',
    bgVar: 'var(--cat-personal-bg)',
    textVar: 'var(--cat-personal-text)',
    dotVar: 'var(--cat-personal-dot)',
  },
  {
    id: 'health',
    label: 'Salud',
    color: '#6b46c1',
    bgColor: '#f3eef8',
    textColor: '#55307d',
    bgVar: 'var(--cat-health-bg)',
    textVar: 'var(--cat-health-text)',
    dotVar: 'var(--cat-health-dot)',
  },
  {
    id: 'important',
    label: 'Importante',
    color: '#c53030',
    bgColor: '#fdecec',
    textColor: '#9b1c1c',
    bgVar: 'var(--cat-important-bg)',
    textVar: 'var(--cat-important-text)',
    dotVar: 'var(--cat-important-dot)',
  },
];

export const EVENT_CATEGORY_MAP: Record<EventCategory, CategoryMeta> = {
  work: EVENT_CATEGORIES[0],
  personal: EVENT_CATEGORIES[1],
  health: EVENT_CATEGORIES[2],
  important: EVENT_CATEGORIES[3],
};

const LEGACY_COLOR_TO_CATEGORY: Record<string, EventCategory> = {
  '#2ecc71': 'health',
  '#6b46c1': 'health',
  '#3498db': 'work',
  '#9b59b6': 'work',
  '#2b6cb0': 'work',
  '#e74c3c': 'important',
  '#c53030': 'important',
  '#f39c12': 'personal',
  '#1abc9c': 'personal',
  '#e84393': 'personal',
  '#2f855a': 'personal',
};

const START_TIME_RE = /^([01]\d|2[0-3]):[0-5]\d(?=\s*(?:-|$))/;

/** Verifica si un valor desconocido pertenece al conjunto cerrado de categorías válidas. */
export const isValidCategory = (val: unknown): val is EventCategory =>
  typeof val === 'string' && (ALL_CATEGORIES as readonly string[]).includes(val);

/**
 * Resuelve la categoría de un evento priorizando `event.category` explícita;
 * si no está definida (eventos legados), la infiere determinísticamente a partir de su `color`.
 */
export const resolveEventCategory = (
  event: Pick<CalendarEvent, 'category' | 'color' | 'title'>,
): EventCategory => {
  if (isValidCategory(event.category)) {
    return event.category;
  }

  if (typeof event.color === 'string') {
    const normalizedColor = event.color.trim().toLowerCase();
    const mapped = LEGACY_COLOR_TO_CATEGORY[normalizedColor];
    if (mapped) {
      return mapped;
    }
  }

  return DEFAULT_CATEGORY;
};

/** Devuelve los metadatos visuales y etiquetas en español de la categoría indicada. */
export const getCategoryMeta = (category?: EventCategory): CategoryMeta =>
  isValidCategory(category) ? EVENT_CATEGORY_MAP[category] : EVENT_CATEGORY_MAP[DEFAULT_CATEGORY];

/**
 * Extrae la hora inicial `HH:mm` de cadenas como `'09:30 - 11:00'` o `'09:30'`.
 * Retorna `null` si está vacío, es `'Todo el día'` o no contiene una hora inicial válida.
 */
export const extractStartTime = (time?: string): string | null => {
  if (!time) return null;
  const trimmed = time.trim();
  if (!trimmed || /^todo el d[ií]a$/i.test(trimmed)) {
    return null;
  }
  const match = START_TIME_RE.exec(trimmed);
  return match ? match[0] : null;
};

const normalizeSearchText = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();

/**
 * Filtra eventos combinando intersección lógica (AND) entre las categorías activas
 * y coincidencia parcial insensible a mayúsculas y tildes en `title` o `description`.
 */
export const filterEvents = (
  events: CalendarEvent[],
  activeCategories: EventCategory[],
  searchQuery: string,
): CalendarEvent[] => {
  if (activeCategories.length === 0) {
    return [];
  }

  const activeSet = new Set<EventCategory>(activeCategories);
  const normalizedQuery = normalizeSearchText(searchQuery).trim();

  return events.filter((event) => {
    const category = resolveEventCategory(event);
    if (!activeSet.has(category)) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const titleMatches = normalizeSearchText(event.title).includes(normalizedQuery);
    if (titleMatches) {
      return true;
    }

    if (event.description) {
      return normalizeSearchText(event.description).includes(normalizedQuery);
    }

    return false;
  });
};
//FIN SPEC-003 - 01
