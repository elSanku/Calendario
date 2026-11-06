import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar } from './Sidebar';
//INI SPEC-003 - 03
// Tipos para pruebas de categorías
import type { EventCategory } from '../../types/calendar';
//FIN SPEC-003 - 03

describe('Sidebar', () => {
  const defaultProps = {
    year: 2026,
    selectedMonth: 9, // Octubre
    eventCounts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 1, 0],
    onYearChange: vi.fn(),
    onMonthSelect: vi.fn(),
  };

  it('renderiza el año y los 12 meses en español', () => {
    render(<Sidebar {...defaultProps} />);
    expect(screen.getByText('2026')).toBeTruthy();
    expect(screen.getByText('Enero')).toBeTruthy();
    expect(screen.getByText('Octubre')).toBeTruthy();
    expect(screen.getByText('Diciembre')).toBeTruthy();
  });

  it('permite navegar al año anterior y siguiente', () => {
    const onYearChange = vi.fn();
    render(<Sidebar {...defaultProps} onYearChange={onYearChange} />);

    const prevBtn = screen.getByRole('button', { name: 'Año anterior' });
    fireEvent.click(prevBtn);
    expect(onYearChange).toHaveBeenCalledWith(2025);

    const nextBtn = screen.getByRole('button', { name: 'Año siguiente' });
    fireEvent.click(nextBtn);
    expect(onYearChange).toHaveBeenCalledWith(2027);
  });

  it('permite seleccionar un mes y llama a onMonthSelect', () => {
    const onMonthSelect = vi.fn();
    render(<Sidebar {...defaultProps} onMonthSelect={onMonthSelect} />);

    const marchBtn = screen.getByText('Marzo');
    fireEvent.click(marchBtn);
    expect(onMonthSelect).toHaveBeenCalledWith(2); // Marzo = índice 2
  });

  it('muestra el contador de eventos correspondiente al mes', () => {
    render(<Sidebar {...defaultProps} />);
    // Octubre tiene 4 eventos en eventCounts
    expect(screen.getByText('4')).toBeTruthy();
    // Noviembre tiene 1 evento
    expect(screen.getByText('1')).toBeTruthy();
  });

  //INI SPEC-003 - 03
  // Pruebas unitarias de filtros interactivos por categoría (RF-6, RF-7)
  it('renderiza los 4 filtros de categoría con sus nombres en español y atributos accesibles', () => {
    render(<Sidebar {...defaultProps} />);

    expect(screen.getByRole('group', { name: 'Filtro de categorías' })).toBeTruthy();
    expect(screen.getByText('Categorías')).toBeTruthy();

    const workSwitch = screen.getByRole('switch', { name: 'Filtrar Trabajo' });
    const personalSwitch = screen.getByRole('switch', { name: 'Filtrar Personal' });
    const healthSwitch = screen.getByRole('switch', { name: 'Filtrar Salud' });
    const importantSwitch = screen.getByRole('switch', { name: 'Filtrar Importante' });

    expect(workSwitch).toBeTruthy();
    expect(personalSwitch).toBeTruthy();
    expect(healthSwitch).toBeTruthy();
    expect(importantSwitch).toBeTruthy();

    expect(screen.getByText('Trabajo')).toBeTruthy();
    expect(screen.getByText('Personal')).toBeTruthy();
    expect(screen.getByText('Salud')).toBeTruthy();
    expect(screen.getByText('Importante')).toBeTruthy();
  });

  it('llama a onToggleCategory con el ID de categoría correcto al hacer clic en uno de los interruptores', () => {
    const onToggleCategory = vi.fn();
    render(<Sidebar {...defaultProps} onToggleCategory={onToggleCategory} />);

    const workSwitch = screen.getByRole('switch', { name: 'Filtrar Trabajo' });
    fireEvent.click(workSwitch);
    expect(onToggleCategory).toHaveBeenCalledWith('work');

    const personalSwitch = screen.getByRole('switch', { name: 'Filtrar Personal' });
    fireEvent.click(personalSwitch);
    expect(onToggleCategory).toHaveBeenCalledWith('personal');

    const healthSwitch = screen.getByRole('switch', { name: 'Filtrar Salud' });
    fireEvent.click(healthSwitch);
    expect(onToggleCategory).toHaveBeenCalledWith('health');

    const importantSwitch = screen.getByRole('switch', { name: 'Filtrar Importante' });
    fireEvent.click(importantSwitch);
    expect(onToggleCategory).toHaveBeenCalledWith('important');
  });

  it('refleja el estado activo e inactivo según la prop activeCategories', () => {
    const activeCategories: EventCategory[] = ['work', 'important'];
    render(<Sidebar {...defaultProps} activeCategories={activeCategories} />);

    const workSwitch = screen.getByRole('switch', { name: 'Filtrar Trabajo' });
    const personalSwitch = screen.getByRole('switch', { name: 'Filtrar Personal' });
    const healthSwitch = screen.getByRole('switch', { name: 'Filtrar Salud' });
    const importantSwitch = screen.getByRole('switch', { name: 'Filtrar Importante' });

    expect(workSwitch.getAttribute('aria-checked')).toBe('true');
    expect(personalSwitch.getAttribute('aria-checked')).toBe('false');
    expect(healthSwitch.getAttribute('aria-checked')).toBe('false');
    expect(importantSwitch.getAttribute('aria-checked')).toBe('true');
  });

  it('activa todas las categorías por defecto cuando no se provee activeCategories', () => {
    render(<Sidebar {...defaultProps} />);
    const switches = screen.getAllByRole('switch');
    expect(switches).toHaveLength(4);
    switches.forEach((sw) => {
      expect(sw.getAttribute('aria-checked')).toBe('true');
    });
  });
  //FIN SPEC-003 - 03
});

