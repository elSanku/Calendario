import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Sidebar } from './Sidebar';

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
});

