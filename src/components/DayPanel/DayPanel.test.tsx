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

  //INI SPEC-003 - 06
  it('renderiza la etiqueta de categoría en español para los eventos de la línea de tiempo', () => {
    const events: CalendarEvent[] = [
      { id: '1', title: 'Reunión de equipo', date: defaultDateStr, category: 'work', time: '10:00 - 11:00' },
      { id: '2', title: 'Chequeo médico', date: defaultDateStr, category: 'health', time: '12:00 - 13:00' },
      { id: '3', title: 'Almuerzo familiar', date: defaultDateStr, category: 'personal', time: '13:30 - 15:00' },
      { id: '4', title: 'Entrega final', date: defaultDateStr, category: 'important', time: '17:00 - 18:00' },
    ];
    render(<DayPanel selectedDateStr={defaultDateStr} events={events} />);

    expect(screen.getByText('Trabajo')).toBeTruthy();
    expect(screen.getByText('Salud')).toBeTruthy();
    expect(screen.getByText('Personal')).toBeTruthy();
    expect(screen.getByText('Importante')).toBeTruthy();
  });

  it('muestra la descripción del evento cuando está presente y la omite si no existe', () => {
    const events: CalendarEvent[] = [
      {
        id: '1',
        title: 'Presentación de Proyecto',
        date: defaultDateStr,
        category: 'work',
        description: 'Revisión técnica de la arquitectura con el equipo.',
      },
      {
        id: '2',
        title: 'Llamada rápida',
        date: defaultDateStr,
        category: 'work',
      },
    ];
    render(<DayPanel selectedDateStr={defaultDateStr} events={events} />);

    expect(screen.getByText('Revisión técnica de la arquitectura con el equipo.')).toBeTruthy();
    expect(screen.queryByText('undefined')).toBeNull();
  });

  it('muestra el estado vacío orientador con botón de restablecer filtros cuando hasActiveFilters es true', () => {
    const onResetFilters = vi.fn();
    render(
      <DayPanel
        selectedDateStr={defaultDateStr}
        events={[]}
        hasActiveFilters={true}
        onResetFilters={onResetFilters}
      />,
    );

    expect(
      screen.getByText('No hay eventos que coincidan con los filtros o búsqueda activa.'),
    ).toBeTruthy();
    expect(
      screen.queryByText('No hay eventos programados para este día.'),
    ).toBeNull();

    const resetBtn = screen.getByRole('button', { name: 'Restablecer filtros' });
    fireEvent.click(resetBtn);
    expect(onResetFilters).toHaveBeenCalledTimes(1);
  });

  it('muestra el botón orientador de programar evento en estado vacío sin filtros activos', () => {
    const onAddEventClick = vi.fn();
    render(
      <DayPanel
        selectedDateStr={defaultDateStr}
        events={[]}
        hasActiveFilters={false}
        onAddEventClick={onAddEventClick}
      />,
    );

    expect(
      screen.getByText('No hay eventos programados para este día.'),
    ).toBeTruthy();

    const programBtn = screen.getByRole('button', { name: 'Programar evento' });
    fireEvent.click(programBtn);
    expect(onAddEventClick).toHaveBeenCalledTimes(1);
  });

  it('permite la convivencia del banner conmemorativo de feriado con la línea de tiempo de eventos', () => {
    const holiday = {
      id: 1,
      date: defaultDateStr,
      title: 'Día de las Iglesias Evangélicas y Protestantes',
    };
    const events: CalendarEvent[] = [
      {
        id: '1',
        title: 'Culto especial',
        date: defaultDateStr,
        category: 'personal',
        time: '11:00 - 12:30',
        description: 'Celebración festiva comunitaria.',
      },
    ];

    render(
      <DayPanel
        selectedDateStr={defaultDateStr}
        events={events}
        holiday={holiday}
      />,
    );

    // Banner de feriado
    expect(screen.getByTestId('holiday-banner')).toBeTruthy();
    expect(screen.getByText('Feriado Oficial')).toBeTruthy();
    expect(screen.getByText('Día de las Iglesias Evangélicas y Protestantes')).toBeTruthy();

    // Evento en la línea de tiempo
    expect(screen.getByText('Culto especial')).toBeTruthy();
    expect(screen.getByText('Personal')).toBeTruthy();
    expect(screen.getByText('Celebración festiva comunitaria.')).toBeTruthy();
  });
  //FIN SPEC-003 - 06
});

