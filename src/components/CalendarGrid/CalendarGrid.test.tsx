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

  //INI SPEC-003 - 05
  it('renderiza chips de eventos con hora tabular y título en lugar de puntos mudos', () => {
    const mockEvents: CalendarEvent[] = [
      { id: '1', title: 'Dentista', date: '2026-10-15', time: '10:00 - 11:00', category: 'health' },
    ];
    const cells = generateMonthGrid(2026, 9, '2026-10-30', mockEvents);
    render(<CalendarGrid cells={cells} onSelectDay={() => {}} />);

    const chip = screen.getByTestId('event-chip');
    expect(chip).toBeTruthy();
    expect(screen.getByText('10:00')).toBeTruthy();
    expect(screen.getByText('Dentista')).toBeTruthy();
    expect(chip.getAttribute('title')).toBe('Dentista (10:00 - 11:00)');
  });
  //FIN SPEC-003 - 05

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

  //INI SPEC-003 - 05
  // Coexistencia limpia entre píldora de feriado y chips de eventos
  it('coexiste limpiamente la píldora de feriado con los chips de eventos del usuario', () => {
    const mockEvents: CalendarEvent[] = [
      { id: '1', title: 'Almuerzo familiar', date: '2026-10-12', category: 'personal' },
    ];
    const mockHolidaysMap = {
      '2026-10-12': { id: 10, date: '2026-10-12', title: 'Encuentro de Dos Mundos' },
    };
    const cells = generateMonthGrid(2026, 9, '2026-10-30', mockEvents, mockHolidaysMap);
    render(<CalendarGrid cells={cells} onSelectDay={() => {}} />);

    // Verifica que coexisten ambos elementos en la celda
    expect(screen.getByTestId('holiday-pill')).toBeTruthy();
    expect(screen.getByTestId('event-chip')).toBeTruthy();
    expect(screen.getByText('Almuerzo familiar')).toBeTruthy();
  });
  //FIN SPEC-003 - 05

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

  //INI SPEC-003 - 05
  it('muestra un máximo de 2 chips visibles y el botón +N más cuando hay 3 o más eventos', () => {
    const mockEvents: CalendarEvent[] = [
      { id: '1', title: 'Evento 1', date: '2026-10-15', category: 'work' },
      { id: '2', title: 'Evento 2', date: '2026-10-15', category: 'personal' },
      { id: '3', title: 'Evento 3', date: '2026-10-15', category: 'health' },
      { id: '4', title: 'Evento 4', date: '2026-10-15', category: 'important' },
    ];
    const cells = generateMonthGrid(2026, 9, '2026-10-30', mockEvents);
    render(<CalendarGrid cells={cells} onSelectDay={() => {}} />);

    // Máximo 2 chips visibles en la celda
    const chips = screen.getAllByTestId('event-chip');
    expect(chips).toHaveLength(2);
    expect(screen.getByText('Evento 1')).toBeTruthy();
    expect(screen.getByText('Evento 2')).toBeTruthy();
    expect(screen.queryByText('Evento 3')).toBeNull();

    // Botón +2 más (4 eventos - 2 = 2)
    const moreBtn = screen.getByRole('button', { name: '+2 más' });
    expect(moreBtn).toBeTruthy();
    expect(moreBtn.getAttribute('aria-expanded')).toBe('false');
  });

  it('abre el popover contextual al hacer clic en +N más mostrando todos los eventos del día', () => {
    const onSelectDay = vi.fn();
    const mockEvents: CalendarEvent[] = [
      { id: '1', title: 'Evento 1', date: '2026-10-15', time: '09:00 - 10:00', category: 'work' },
      { id: '2', title: 'Evento 2', date: '2026-10-15', time: '11:00 - 12:00', category: 'personal' },
      { id: '3', title: 'Evento 3', date: '2026-10-15', time: '15:00 - 16:00', category: 'health' },
    ];
    const cells = generateMonthGrid(2026, 9, '2026-10-30', mockEvents);
    render(<CalendarGrid cells={cells} onSelectDay={onSelectDay} />);

    const moreBtn = screen.getByRole('button', { name: '+1 más' });
    fireEvent.click(moreBtn);

    // Debe llamar a onSelectDay para seleccionar la fecha
    expect(onSelectDay).toHaveBeenCalledWith('2026-10-15');

    // Popover debe estar en el DOM
    const popover = screen.getByTestId('more-popover');
    expect(popover).toBeTruthy();
    expect(moreBtn.getAttribute('aria-expanded')).toBe('true');

    // Muestra todos los 3 eventos en el popover
    expect(screen.getByText('Evento 3')).toBeTruthy();
    expect(screen.getByText('15:00')).toBeTruthy();
  });

  it('cierra el popover contextual al hacer clic en el botón cerrar ×', () => {
    const mockEvents: CalendarEvent[] = [
      { id: '1', title: 'Evento 1', date: '2026-10-15', category: 'work' },
      { id: '2', title: 'Evento 2', date: '2026-10-15', category: 'personal' },
      { id: '3', title: 'Evento 3', date: '2026-10-15', category: 'health' },
    ];
    const cells = generateMonthGrid(2026, 9, '2026-10-30', mockEvents);
    render(<CalendarGrid cells={cells} onSelectDay={() => {}} />);

    const moreBtn = screen.getByRole('button', { name: '+1 más' });
    fireEvent.click(moreBtn);

    expect(screen.getByTestId('more-popover')).toBeTruthy();

    const closeBtn = screen.getByRole('button', { name: 'Cerrar lista de eventos' });
    fireEvent.click(closeBtn);

    expect(screen.queryByTestId('more-popover')).toBeNull();
  });

  it('cierra el popover contextual al presionar la tecla Escape', () => {
    const mockEvents: CalendarEvent[] = [
      { id: '1', title: 'Evento 1', date: '2026-10-15', category: 'work' },
      { id: '2', title: 'Evento 2', date: '2026-10-15', category: 'personal' },
      { id: '3', title: 'Evento 3', date: '2026-10-15', category: 'health' },
    ];
    const cells = generateMonthGrid(2026, 9, '2026-10-30', mockEvents);
    render(<CalendarGrid cells={cells} onSelectDay={() => {}} />);

    const moreBtn = screen.getByRole('button', { name: '+1 más' });
    fireEvent.click(moreBtn);

    expect(screen.getByTestId('more-popover')).toBeTruthy();

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByTestId('more-popover')).toBeNull();
  });

  it('cierra el popover contextual al hacer clic fuera de él', () => {
    const mockEvents: CalendarEvent[] = [
      { id: '1', title: 'Evento 1', date: '2026-10-15', category: 'work' },
      { id: '2', title: 'Evento 2', date: '2026-10-15', category: 'personal' },
      { id: '3', title: 'Evento 3', date: '2026-10-15', category: 'health' },
    ];
    const cells = generateMonthGrid(2026, 9, '2026-10-30', mockEvents);
    render(<CalendarGrid cells={cells} onSelectDay={() => {}} />);

    fireEvent.click(screen.getByRole('button', { name: '+1 más' }));
    expect(screen.getByTestId('more-popover')).toBeTruthy();

    fireEvent.mouseDown(document.body);
    expect(screen.queryByTestId('more-popover')).toBeNull();
  });

  it('ejecuta onEditEvent al hacer clic en el botón Editar dentro del popover', () => {
    const onEditEvent = vi.fn();
    const mockEvents: CalendarEvent[] = [
      { id: '1', title: 'Evento 1', date: '2026-10-15', category: 'work' },
      { id: '2', title: 'Evento 2', date: '2026-10-15', category: 'personal' },
      { id: '3', title: 'Evento 3', date: '2026-10-15', category: 'health' },
    ];
    const cells = generateMonthGrid(2026, 9, '2026-10-30', mockEvents);
    render(<CalendarGrid cells={cells} onSelectDay={() => {}} onEditEvent={onEditEvent} />);

    fireEvent.click(screen.getByRole('button', { name: '+1 más' }));

    const editBtn = screen.getByRole('button', { name: 'Editar Evento 3' });
    fireEvent.click(editBtn);

    expect(onEditEvent).toHaveBeenCalledWith(mockEvents[2]);
    expect(screen.queryByTestId('more-popover')).toBeNull();
  });
  //FIN SPEC-003 - 05
});
