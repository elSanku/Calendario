import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from './Header';

//INI SPEC-003 - 04
// Pruebas unitarias para el Header de productividad
describe('Header', () => {
  it('renderiza correctamente sin props usando los valores por defecto', () => {
    render(<Header />);
    expect(screen.getByText('Calendario')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Mes anterior' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Ir a hoy' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Mes siguiente' })).toBeTruthy();
    expect(screen.getByRole('searchbox', { name: 'Buscar eventos' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Nuevo' })).toBeTruthy();
  });

  it('renderiza el mes y año activos en español (ej. Octubre 2026)', () => {
    render(<Header currentMonthIndex={9} currentYear={2026} />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading.textContent).toContain('Octubre');
    expect(heading.textContent).toContain('2026');
  });

  it('invoca onPrevMonth al hacer clic en el botón Mes anterior', () => {
    const onPrevMonth = vi.fn();
    render(<Header onPrevMonth={onPrevMonth} />);
    const prevBtn = screen.getByRole('button', { name: 'Mes anterior' });
    fireEvent.click(prevBtn);
    expect(onPrevMonth).toHaveBeenCalledTimes(1);
  });

  it('invoca onToday al hacer clic en el botón Hoy', () => {
    const onToday = vi.fn();
    render(<Header onToday={onToday} />);
    const todayBtn = screen.getByRole('button', { name: 'Ir a hoy' });
    fireEvent.click(todayBtn);
    expect(onToday).toHaveBeenCalledTimes(1);
  });

  it('invoca onNextMonth al hacer clic en el botón Mes siguiente', () => {
    const onNextMonth = vi.fn();
    render(<Header onNextMonth={onNextMonth} />);
    const nextBtn = screen.getByRole('button', { name: 'Mes siguiente' });
    fireEvent.click(nextBtn);
    expect(onNextMonth).toHaveBeenCalledTimes(1);
  });

  it('dispara onSearchChange al escribir en el campo de búsqueda', () => {
    const onSearchChange = vi.fn();
    render(<Header searchQuery="" onSearchChange={onSearchChange} />);
    const searchInput = screen.getByRole('searchbox', { name: 'Buscar eventos' });
    fireEvent.change(searchInput, { target: { value: 'reunión' } });
    expect(onSearchChange).toHaveBeenCalledWith('reunión');
  });

  it('muestra el botón de limpiar búsqueda cuando hay texto y al hacer clic limpia la consulta', () => {
    const onSearchChange = vi.fn();
    render(<Header searchQuery="reunión" onSearchChange={onSearchChange} />);
    const clearBtn = screen.getByRole('button', { name: 'Limpiar búsqueda' });
    expect(clearBtn).toBeTruthy();
    fireEvent.click(clearBtn);
    expect(onSearchChange).toHaveBeenCalledWith('');
  });

  it('no muestra el botón de limpiar búsqueda cuando searchQuery está vacío', () => {
    render(<Header searchQuery="" />);
    expect(screen.queryByRole('button', { name: 'Limpiar búsqueda' })).toBeNull();
  });

  it('invoca onNewEvent al hacer clic en el botón Nuevo', () => {
    const onNewEvent = vi.fn();
    render(<Header onNewEvent={onNewEvent} />);
    const newBtn = screen.getByRole('button', { name: 'Nuevo' });
    fireEvent.click(newBtn);
    expect(onNewEvent).toHaveBeenCalledTimes(1);
  });

  it('no contiene los enlaces estáticos obsoletos ni el avatar falso (anti-ui-slop)', () => {
    render(<Header />);
    expect(screen.queryByRole('link', { name: 'Hoy' })).toBeNull();
    expect(screen.queryByRole('link', { name: 'Organizar' })).toBeNull();
    expect(screen.queryByRole('img', { name: 'Usuario' })).toBeNull();
  });
});
//FIN SPEC-003 - 04
