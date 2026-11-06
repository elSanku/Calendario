import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DayPanel } from './DayPanel';
import type { CalendarEvent } from '../../types/calendar';

describe('DayPanel', () => {
  const defaultDateStr = '2026-10-30'; // Viernes

  it('renderiza el título y subtítulo formateados para la fecha seleccionada', () => {
    render(<DayPanel selectedDateStr={defaultDateStr} events={[]} />);
    expect(screen.getByText('OCTUBRE 30')).toBeTruthy();
    expect(screen.getByText('Viernes')).toBeTruthy();
  });

  it('muestra el estado vacío cuando no hay eventos', () => {
    render(<DayPanel selectedDateStr={defaultDateStr} events={[]} />);
    expect(screen.getByText('No hay eventos programados para este día.')).toBeTruthy();
  });

  it('renderiza la lista de eventos con sus títulos y horarios', () => {
    const events: CalendarEvent[] = [
      { id: '1', title: 'Clase de Yoga', date: defaultDateStr, time: '08:00 - 09:00' },
      { id: '2', title: 'Día de Cumpleaños', date: defaultDateStr },
    ];
    render(<DayPanel selectedDateStr={defaultDateStr} events={events} />);

    expect(screen.getByText('Clase de Yoga')).toBeTruthy();
    expect(screen.getByText('08:00 - 09:00')).toBeTruthy();

    expect(screen.getByText('Día de Cumpleaños')).toBeTruthy();
    expect(screen.getByText('Todo el día')).toBeTruthy();
  });

  it('dispara onAddEventClick al hacer clic en el botón circular +', () => {
    const onAddEventClick = vi.fn();
    render(
      <DayPanel
        selectedDateStr={defaultDateStr}
        events={[]}
        onAddEventClick={onAddEventClick}
      />,
    );

    const addBtn = screen.getByRole('button', { name: 'Agregar nuevo evento' });
    fireEvent.click(addBtn);
    expect(onAddEventClick).toHaveBeenCalledTimes(1);
  });

  //INI SPEC-002 - 05
  it('renderiza el banner conmemorativo cuando se proporciona un feriado oficial', () => {
    const holiday = {
      id: 1,
      date: defaultDateStr,
      title: 'Día de las Iglesias Evangélicas y Protestantes',
    };

    render(<DayPanel selectedDateStr={defaultDateStr} events={[]} holiday={holiday} />);

    const banner = screen.getByTestId('holiday-banner');
    expect(banner).toBeTruthy();
    expect(screen.getByText('Feriado Oficial')).toBeTruthy();
    expect(screen.getByText('Día de las Iglesias Evangélicas y Protestantes')).toBeTruthy();
  });

  it('no renderiza el banner de feriado cuando holiday es null o undefined', () => {
    render(<DayPanel selectedDateStr={defaultDateStr} events={[]} holiday={null} />);
    expect(screen.queryByTestId('holiday-banner')).toBeNull();
  });
  //FIN SPEC-002 - 05
});

