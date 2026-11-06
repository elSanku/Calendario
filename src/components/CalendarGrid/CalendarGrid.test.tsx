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
});

