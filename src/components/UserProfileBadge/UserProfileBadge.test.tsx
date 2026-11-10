//INI SPEC-004 - 04
// Pruebas unitarias para el componente UserProfileBadge y su menú de roles
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { UserProfileBadge } from './UserProfileBadge';
import type { UserProfile } from '../../types/user';

describe('UserProfileBadge', () => {
  it('renderiza el avatar con iniciales, nombre y rol inicial por defecto ("Personal")', () => {
    render(<UserProfileBadge />);

    const trigger = screen.getByRole('button', { name: 'Perfil de usuario y conmutador de rol' });
    expect(trigger).toBeTruthy();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.getAttribute('aria-haspopup')).toBe('menu');

    expect(screen.getByText('UD')).toBeTruthy();
    expect(screen.getByText('Usuario Demo')).toBeTruthy();
    expect(screen.getByText('Personal')).toBeTruthy();
    expect(screen.queryByRole('menu')).toBeNull();
  });

  it('renderiza con props personalizadas (profile con nombre, iniciales y rol "Trabajo")', () => {
    const customProfile: UserProfile = {
      id: 'usr-custom',
      name: 'Elena Gómez',
      initials: 'EG',
      activeRole: 'Trabajo',
      availableRoles: ['Personal', 'Trabajo'],
    };

    render(<UserProfileBadge profile={customProfile} />);

    expect(screen.getByText('EG')).toBeTruthy();
    expect(screen.getByText('Elena Gómez')).toBeTruthy();
    expect(screen.getByText('Trabajo')).toBeTruthy();
  });

  it('abre el menú contextual al hacer clic en el disparador', () => {
    render(<UserProfileBadge />);

    const trigger = screen.getByRole('button', { name: 'Perfil de usuario y conmutador de rol' });
    fireEvent.click(trigger);

    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    //INI SPEC-005 - 03
    // Menú flotante ampliado con roles y preferencias de apariencia (4 opciones tipo menuitemradio)
    const menu = screen.getByRole('menu', { name: /Menú de perfil y preferencias|Cambiar rol de usuario/ });
    expect(menu).toBeTruthy();

    const options = screen.getAllByRole('menuitemradio');
    expect(options).toHaveLength(4);
    expect(options[0].getAttribute('aria-checked')).toBe('true');
    expect(options[1].getAttribute('aria-checked')).toBe('false');
    //FIN SPEC-005 - 03
  });

  it('cierra el menú al presionar la tecla Escape y devuelve el foco al disparador', () => {
    render(<UserProfileBadge />);

    const trigger = screen.getByRole('button', { name: 'Perfil de usuario y conmutador de rol' });
    fireEvent.click(trigger);
    expect(screen.getByRole('menu')).toBeTruthy();

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByRole('menu')).toBeNull();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('invoca onRoleChange con el nuevo rol y cierra el menú al seleccionar una opción distinta', () => {
    const onRoleChange = vi.fn();
    render(<UserProfileBadge onRoleChange={onRoleChange} />);

    const trigger = screen.getByRole('button', { name: 'Perfil de usuario y conmutador de rol' });
    fireEvent.click(trigger);

    const workOption = screen.getByRole('menuitemradio', { name: /Trabajo/i });
    fireEvent.click(workOption);

    expect(onRoleChange).toHaveBeenCalledTimes(1);
    expect(onRoleChange).toHaveBeenCalledWith('Trabajo');
    expect(screen.queryByRole('menu')).toBeNull();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('cierra el menú al hacer clic fuera del componente', () => {
    render(
      <div>
        <UserProfileBadge />
        <div data-testid="outside-element">Exterior</div>
      </div>
    );

    const trigger = screen.getByRole('button', { name: 'Perfil de usuario y conmutador de rol' });
    fireEvent.click(trigger);
    expect(screen.getByRole('menu')).toBeTruthy();

    const outside = screen.getByTestId('outside-element');
    fireEvent.mouseDown(outside);

    expect(screen.queryByRole('menu')).toBeNull();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  //INI SPEC-005 - 03
  it('renderiza la sección accesible "Apariencia" con opciones Modo Claro y Modo Oscuro', () => {
    render(<UserProfileBadge theme="light" />);

    const trigger = screen.getByRole('button', { name: 'Perfil de usuario y conmutador de rol' });
    fireEvent.click(trigger);

    expect(screen.getByText('Apariencia')).toBeTruthy();

    const lightOption = screen.getByRole('menuitemradio', { name: /Modo Claro/i });
    const darkOption = screen.getByRole('menuitemradio', { name: /Modo Oscuro/i });

    expect(lightOption.getAttribute('aria-checked')).toBe('true');
    expect(darkOption.getAttribute('aria-checked')).toBe('false');
  });

  it('invoca onThemeChange y cierra el menú al seleccionar una opción de tema', () => {
    const onThemeChange = vi.fn();
    render(<UserProfileBadge theme="dark" onThemeChange={onThemeChange} />);

    const trigger = screen.getByRole('button', { name: 'Perfil de usuario y conmutador de rol' });
    fireEvent.click(trigger);

    const lightOption = screen.getByRole('menuitemradio', { name: /Modo Claro/i });
    fireEvent.click(lightOption);

    expect(onThemeChange).toHaveBeenCalledTimes(1);
    expect(onThemeChange).toHaveBeenCalledWith('light');
    expect(screen.queryByRole('menu')).toBeNull();
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });
  //FIN SPEC-005 - 03

  //INI SPEC-005 - 06
  it('permite conmutar a "Modo Oscuro" invocando onThemeChange("dark") y verifica el separador accesible', () => {
    const onThemeChange = vi.fn();
    render(<UserProfileBadge theme="light" onThemeChange={onThemeChange} />);

    const trigger = screen.getByRole('button', { name: 'Perfil de usuario y conmutador de rol' });
    fireEvent.click(trigger);

    expect(screen.getByRole('separator')).toBeTruthy();

    const darkOption = screen.getByRole('menuitemradio', { name: /Modo Oscuro/i });
    expect(darkOption.getAttribute('aria-checked')).toBe('false');

    fireEvent.click(darkOption);

    expect(onThemeChange).toHaveBeenCalledTimes(1);
    expect(onThemeChange).toHaveBeenCalledWith('dark');
    expect(screen.queryByRole('menu')).toBeNull();
  });
  //FIN SPEC-005 - 06
});
//FIN SPEC-004 - 04
