import { describe, it, expect, beforeEach, beforeAll } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { App } from './App';

beforeAll(() => {
  // Polyfill de <dialog> y Popover API para JSDOM
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute('open');
  };
  HTMLElement.prototype.showPopover = function () {
    this.setAttribute(':popover-open', '');
  };
  HTMLElement.prototype.hidePopover = function () {
    this.removeAttribute(':popover-open');
  };
});

describe('App (Flujos de Integración)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renderiza correctamente el calendario con el sidebar y el panel del día', () => {
    render(<App />);
    expect(screen.getByText('Enero')).toBeTruthy();
    expect(screen.getByText('LUN')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Agregar nuevo evento' })).toBeTruthy();
  });

  it('permite abrir el modal con el botón +, ingresar un evento y guardarlo en el estado', () => {
    render(<App />);

    // Abrir modal con el botón +
    const addBtn = screen.getByRole('button', { name: 'Agregar nuevo evento' });
    fireEvent.click(addBtn);

    expect(screen.getByText('Nuevo evento')).toBeTruthy();

    // Rellenar formulario
    const titleInput = screen.getByLabelText('Título');
    fireEvent.change(titleInput, { target: { value: 'Mi Evento de Prueba' } });

    // Guardar
    const saveBtn = screen.getByRole('button', { name: 'Guardar' });
    fireEvent.click(saveBtn);

    // Debe mostrarse en el panel del día seleccionado
    expect(screen.getByText('Mi Evento de Prueba')).toBeTruthy();
  });

  it('permite cambiar de mes desde el sidebar y actualiza la vista', () => {
    render(<App />);
    const mayBtn = screen.getByText('Mayo');
    fireEvent.click(mayBtn);

    // Al seleccionar Mayo, la clase del elemento activo contiene 'active'
    const mayLi = mayBtn.closest('li');
    expect(mayLi?.className).toContain('active');
  });

  it('permite eliminar un evento tras confirmar en el diálogo de confirmación', () => {
    render(<App />);

    // Primero agregamos un evento único para poder identificarlo y eliminarlo
    const addBtn = screen.getByRole('button', { name: 'Agregar nuevo evento' });
    fireEvent.click(addBtn);

    fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Evento Para Borrar' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(screen.getByText('Evento Para Borrar')).toBeTruthy();

    // Ubicar el contenedor del evento
    const eventHeading = screen.getByText('Evento Para Borrar');
    const eventCard = eventHeading.closest('li');
    expect(eventCard).toBeTruthy();

    if (eventCard) {
      const deleteBtn = within(eventCard).getByRole('menuitem', { name: 'Eliminar', hidden: true });
      fireEvent.click(deleteBtn);

      // Debe aparecer el diálogo de confirmación
      expect(screen.getByText('Eliminar evento')).toBeTruthy();
      expect(screen.getByText(/¿Seguro que deseas eliminar/)).toBeTruthy();

      // Confirmar eliminación
      const confirmBtn = screen.getByRole('button', { name: 'Confirmar' });
      fireEvent.click(confirmBtn);

      // Ya no debe estar en la lista
      expect(screen.queryByText('Evento Para Borrar')).toBeNull();
    }
  });
});
