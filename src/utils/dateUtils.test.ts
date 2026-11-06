import { describe, it, expect } from 'vitest';
import {
  generateMonthGrid,
  getEventCountsByMonth,
  formatDayPanelHeader,
  WEEKDAYS_ES,
  MONTH_NAMES_ES,
} from './dateUtils';
import type { CalendarEvent } from '../types/calendar';

describe('dateUtils', () => {
  it('contiene los 7 días de la semana en español iniciando en LUN', () => {
    expect(WEEKDAYS_ES).toEqual(['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM']);
  });

  it('contiene los 12 nombres de meses en español', () => {
    expect(MONTH_NAMES_ES).toHaveLength(12);
    expect(MONTH_NAMES_ES[0]).toBe('Enero');
    expect(MONTH_NAMES_ES[11]).toBe('Diciembre');
  });

  it('debe generar exactamente 42 celdas para la cuadrícula de 6 semanas', () => {
    const cells = generateMonthGrid(2026, 9, '2026-10-29', []);
    expect(cells).toHaveLength(42);
  });

  it('debe manejar correctamente años bisiestos (Febrero 2024 tiene 29 días)', () => {
    const cells = generateMonthGrid(2024, 1, '2024-02-15', []);
    const februaryDays = cells.filter((c) => c.isCurrentMonth);
    expect(februaryDays).toHaveLength(29);
    expect(februaryDays[28].dayNumber).toBe(29);
  });

  it('debe marcar correctamente isCurrentMonth, isSelected y asignar eventos correspondientes', () => {
    const mockEvents: CalendarEvent[] = [
      { id: 'ev-1', title: 'Reunión', date: '2026-10-15', color: '#ff0000' },
    ];
    const cells = generateMonthGrid(2026, 9, '2026-10-15', mockEvents);

    const selectedCell = cells.find((c) => c.date === '2026-10-15');
    expect(selectedCell).toBeDefined();
    expect(selectedCell?.isSelected).toBe(true);
    expect(selectedCell?.isCurrentMonth).toBe(true);
    expect(selectedCell?.events).toHaveLength(1);
    expect(selectedCell?.events[0].title).toBe('Reunión');

    const adjacentCell = cells.find((c) => c.date === '2026-10-16');
    expect(adjacentCell?.isSelected).toBe(false);
    expect(adjacentCell?.events).toHaveLength(0);
  });

  it('debe contar correctamente los eventos por mes', () => {
    const mockEvents: CalendarEvent[] = [
      { id: '1', title: 'Evento 1', date: '2026-10-01' },
      { id: '2', title: 'Evento 2', date: '2026-10-15' },
      { id: '3', title: 'Evento 3', date: '2026-11-20' },
      { id: '4', title: 'Otro año', date: '2025-10-01' },
    ];
    const counts = getEventCountsByMonth(2026, mockEvents);
    expect(counts[9]).toBe(2); // Octubre (índice 9)
    expect(counts[10]).toBe(1); // Noviembre (índice 10)
    expect(counts[0]).toBe(0); // Enero (índice 0)
  });

  it('debe formatear la cabecera del panel de día en español', () => {
    // 2026-10-30 fue un Viernes
    const header = formatDayPanelHeader('2026-10-30');
    expect(header.title).toBe('OCTUBRE 30');
    expect(header.subtitle).toBe('Viernes');
  });

  //INI SPEC-002 - 03
  it('debe asignar el feriado correspondiente a la celda cuando se provee holidaysMap', () => {
    const mockHolidaysMap = {
      '2026-10-12': { id: 10, date: '2026-10-12', title: 'Encuentro de Dos Mundos' },
    };
    const cells = generateMonthGrid(2026, 9, '2026-10-30', [], mockHolidaysMap);

    const holidayCell = cells.find((c) => c.date === '2026-10-12');
    expect(holidayCell?.holiday).toBeDefined();
    expect(holidayCell?.holiday?.title).toBe('Encuentro de Dos Mundos');

    const normalCell = cells.find((c) => c.date === '2026-10-13');
    expect(normalCell?.holiday).toBeUndefined();
  });
  //FIN SPEC-002 - 03
});
