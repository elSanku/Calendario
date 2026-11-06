import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EventActionsMenu } from './EventActionsMenu';

beforeAll(() => {
  HTMLElement.prototype.showPopover = function () {
    this.setAttribute(':popover-open', '');
  };
  HTMLElement.prototype.hidePopover = function () {
    this.removeAttribute(':popover-open');
  };
});

describe('EventActionsMenu', () => {
  it('renderiza el disparador con etiqueta accesible y estado cerrado', () => {
    render(<EventActionsMenu eventTitle="Reunión" />);
    const trigger = screen.getByRole('button', { name: 'Opciones del evento Reunión', hidden: true });
    expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('incluye las opciones Editar y Eliminar dentro del popover', () => {
    const { container } = render(<EventActionsMenu eventTitle="Reunión" />);
    const menu = container.querySelector('[popover="auto"]');
    expect(menu).not.toBeNull();
    expect(menu?.textContent).toContain('Editar');
    expect(menu?.textContent).toContain('Eliminar');
  });

  it('ejecuta los callbacks onEdit y onDelete al hacer clic en las opciones correspondientes', () => {
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    render(
      <EventActionsMenu
        eventTitle="Reunión"
        onEdit={onEdit}
        onDelete={onDelete}
      />,
    );

    const editBtn = screen.getByRole('menuitem', { name: 'Editar', hidden: true });
    fireEvent.click(editBtn);
    expect(onEdit).toHaveBeenCalledTimes(1);

    const deleteBtn = screen.getByRole('menuitem', { name: 'Eliminar', hidden: true });
    fireEvent.click(deleteBtn);
    expect(onDelete).toHaveBeenCalledTimes(1);
  });
});
