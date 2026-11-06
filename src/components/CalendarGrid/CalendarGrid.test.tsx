import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CalendarGrid } from './CalendarGrid';
import { generateMonthGrid } from '../../utils/dateUtils';
import type { CalendarEvent } from '../../types/calendar';

describe('CalendarGrid', () => {
  it('renderiza los encabezados de la semana iniciando en LUN', () => {
    const cells = generateMonthGrid(2026, 9, '2026-10-30', []);
    render(<CalendarGrid cells={cells} onSelectDay={() => {}} />);

    expect(screen.getByText('LUN')).toBeTruthy();
    expect(screen.getByText('DOM')).toBeTruthy();
  });

  it('renderiza exactamente 42 celdas de días', () => {
    const cells = generateMonthGrid(2026, 9, '2026-10-30', []);
    render(<CalendarGrid cells={cells} onSelectDay={() => {}} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(42);
  });

  it('dispara onSelectDay al hacer clic en una celda', () => {
    const onSelectDay = vi.fn();
    const cells = generateMonthGrid(2026, 9, '2026-10-30', []);
    render(<CalendarGrid cells={cells} onSelectDay={onSelectDay} />);

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);

    expect(onSelectDay).toHaveBeenCalledTimes(1);
    expect(onSelectDay).toHaveBeenCalledWith(cells[0].date);
  });

  it('muestra indicadores de eventos cuando la celda los contiene', () => {
    const mockEvents: CalendarEvent[] = [
      { id: '1', title: 'Dentista', date: '2026-10-15', color: '#48a999' },
    ];
    const cells = generateMonthGrid(2026, 9, '2026-10-30', mockEvents);
    const { container } = render(<CalendarGrid cells={cells} onSelectDay={() => {}} />);

    // El punto de color se renderiza dentro del contenedor de dots
    const dots = container.querySelectorAll('[style*="background-color: rgb(72, 169, 153)"]');
    expect(dots.length).toBeGreaterThan(0);
  });

  //INI SPEC-002 - 04
  it('renderiza la píldora de feriado con tooltip accesible cuando la celda tiene feriado', () => {
    const mockHolidaysMap = {
      '2026-10-12': { id: 10, date: '2026-10-12', title: 'Encuentro de Dos Mundos' },
    };
    const cells = generateMonthGrid(2026, 9, '2026-10-30', [], mockHolidaysMap);
    render(<CalendarGrid cells={cells} onSelectDay={() => {}} />);

    const pill = screen.getByTestId('holiday-pill');
    expect(pill).toBeTruthy();
    expect(pill.getAttribute('title')).toBe('Feriado: Encuentro de Dos Mundos');
    expect(screen.getByText('Encuentro de Dos Mundos')).toBeTruthy();
  });

  it('coexiste limpiamente la píldora de feriado con los puntos de eventos del usuario', () => {
    const mockEvents: CalendarEvent[] = [
      { id: '1', title: 'Almuerzo familiar', date: '2026-10-12', color: '#3498db' },
    ];
    const mockHolidaysMap = {
      '2026-10-12': { id: 10, date: '2026-10-12', title: 'Encuentro de Dos Mundos' },
    };
    const cells = generateMonthGrid(2026, 9, '2026-10-30', mockEvents, mockHolidaysMap);
    const { container } = render(<CalendarGrid cells={cells} onSelectDay={() => {}} />);

    // Verifica que coexisten ambos elementos en la celda
    expect(screen.getByTestId('holiday-pill')).toBeTruthy();
    const dots = container.querySelectorAll('[style*="background-color: rgb(52, 152, 219)"]');
    expect(dots.length).toBeGreaterThan(0);
  });

  it('aplica la clase distintiva de feriado holidayCell a las celdas festivas', () => {
    const mockHolidaysMap = {
      '2026-10-12': { id: 10, date: '2026-10-12', title: 'Encuentro de Dos Mundos' },
    };
    const cells = generateMonthGrid(2026, 9, '2026-10-30', [], mockHolidaysMap);
    render(<CalendarGrid cells={cells} onSelectDay={() => {}} />);

    const holidayCellButton = screen.getByRole('button', {
      name: /12, Feriado: Encuentro de Dos Mundos/,
    });
    expect(holidayCellButton.className).toContain('holidayCell');
  });
  //FIN SPEC-002 - 04
});

