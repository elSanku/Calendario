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
}
