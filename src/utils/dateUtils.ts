import dayjs from 'dayjs';
import 'dayjs/locale/es';
import isoWeek from 'dayjs/plugin/isoWeek';
import type { CalendarEvent, DayCell } from '../types/calendar';

// Configurar dayjs globalmente en español
dayjs.locale('es');
dayjs.extend(isoWeek);

export const WEEKDAYS_ES = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM'];

export const MONTH_NAMES_ES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

/**
 * Genera una cuadrícula de 42 días (6 semanas exactas) iniciando en Lunes.
 */
export function generateMonthGrid(year: number, monthIndex: number, selectedDateStr: string, events: CalendarEvent[]): DayCell[] {
  const firstDayOfMonth = dayjs(new Date(year, monthIndex, 1));
  const todayStr = dayjs().format('YYYY-MM-DD');

  // Encontrar el lunes de la primera semana
  // dayjs.isoWeekday(): 1 = Lunes, 7 = Domingo
  const startDay = firstDayOfMonth.startOf('isoWeek');

  const cells: DayCell[] = [];

  for (let i = 0; i < 42; i++) {
    const current = startDay.add(i, 'day');
    const dateStr = current.format('YYYY-MM-DD');
    const dayEvents = events.filter((e) => e.date === dateStr);

    cells.push({
      date: dateStr,
      dayNumber: current.date(),
      isCurrentMonth: current.month() === monthIndex,
      isToday: dateStr === todayStr,
      isSelected: dateStr === selectedDateStr,
      events: dayEvents,
    });
  }

  return cells;
}

/**
 * Cuenta cuántos eventos hay en cada mes (0-11) para un año específico.
 */
export function getEventCountsByMonth(year: number, events: CalendarEvent[]): number[] {
  const counts = new Array(12).fill(0);
  events.forEach((event) => {
    const d = dayjs(event.date);
    if (d.year() === year) {
      counts[d.month()]++;
    }
  });
  return counts;
}

/**
 * Formatea una fecha para el encabezado del panel de detalle (ej: "OCTUBRE 29", "Jueves").
 */
export function formatDayPanelHeader(dateStr: string) {
  const d = dayjs(dateStr);
  const monthName = d.format('MMMM').toUpperCase();
  const dayNumber = d.date();
  const weekDay = d.format('dddd');
  const capitalizedWeekDay = weekDay.charAt(0).toUpperCase() + weekDay.slice(1);

  return {
    title: `${monthName} ${dayNumber}`,
    subtitle: capitalizedWeekDay,
  };
}
