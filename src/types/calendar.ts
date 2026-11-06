//INI SPEC-002 - 01
// Importación de tipo de feriado nacional
import type { Holiday } from './holiday';
//FIN SPEC-002 - 01

//INI SPEC-003 - 01
// Categorías oficiales del calendario de productividad
export type EventCategory = 'work' | 'personal' | 'health' | 'important';
//FIN SPEC-003 - 01

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // Formato YYYY-MM-DD
  time?: string;
  description?: string;
  color?: string; // Color para el dot indicador
  //INI SPEC-003 - 01
  // Categoría semántica opcional del evento (retrocompatible con eventos legados)
  category?: EventCategory;
  //FIN SPEC-003 - 01
}

export interface DayCell {
  date: string; // Formato YYYY-MM-DD
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  events: CalendarEvent[];
  //INI SPEC-002 - 01
  // Feriado nacional correspondiente al día si existe
  holiday?: Holiday;
  //FIN SPEC-002 - 01
}
