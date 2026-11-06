import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './button';

describe('Button', () => {
  it('renderiza el texto del botón correctamente', () => {
    render(<Button>Aceptar</Button>);
    expect(screen.getByRole('button', { name: 'Aceptar' })).toBeTruthy();
  });

  it('ejecuta la función onClick al hacer clic', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Guardar</Button>);

    const button = screen.getByRole('button', { name: 'Guardar' });
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('no ejecuta onClick cuando está deshabilitado', () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Deshabilitado</Button>);

    const button = screen.getByRole('button', { name: 'Deshabilitado' }) as HTMLButtonElement;
    fireEvent.click(button);

    expect(handleClick).not.toHaveBeenCalled();
    expect(button.disabled).toBe(true);
  });

  it('aplica la clase de variante secundaria', () => {
    render(<Button variant="secondary">Cancelar</Button>);
    const button = screen.getByRole('button', { name: 'Cancelar' });
    expect(button.className).toContain('secondary');
  });
});
