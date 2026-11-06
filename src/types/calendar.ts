//INI SPEC-002 - 01
// Importación de tipo de feriado nacional
import type { Holiday } from './holiday';
//FIN SPEC-002 - 01

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // Formato YYYY-MM-DD
  time?: string;
  description?: string;
  color?: string; // Color para el dot indicador
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
