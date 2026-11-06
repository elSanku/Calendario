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

  //INI SPEC-002 - 06
  it('carga dinámicamente los feriados correspondientes al año 2027 al seleccionarlo en el Sidebar', async () => {
    // Simulamos feriados en caché para 2027
    const holidays2027 = [
      { id: 20271, date: '2027-01-01', title: 'Año Nuevo 2027' },
    ];
    localStorage.setItem('holidays-CL-2027', JSON.stringify(holidays2027));

    render(<App />);

    // Avanzar de año usando el botón "Año siguiente"
    const nextYearBtn = screen.getByRole('button', { name: 'Año siguiente' });
    fireEvent.click(nextYearBtn);

    // Seleccionar el mes de Enero en 2027
    const eneroBtn = screen.getByText('Enero');
    fireEvent.click(eneroBtn);

    // Verificar que la píldora de feriado para 2027 aparece en la cuadrícula
    const holidayPill = await screen.findByTestId('holiday-pill');
    expect(holidayPill).toBeTruthy();
    expect(holidayPill.getAttribute('title')).toBe('Feriado: Año Nuevo 2027');

    // Seleccionar el día 1 de enero en la cuadrícula y verificar que el DayPanel muestre el banner
    fireEvent.click(holidayPill);
    const banner = await screen.findByTestId('holiday-banner');
    expect(banner).toBeTruthy();
    expect(within(banner).getByText('Año Nuevo 2027')).toBeTruthy();
  });
  //FIN SPEC-002 - 06

  //INI SPEC-002 - QA
  it('ejecuta el flujo e2e completo: crea 3 eventos en un día (festivo/normal) y los elimina secuencialmente confirmando cada uno', async () => {
    // Configuramos un feriado para asegurar convivencia con feriados
    const holidays2026 = [
      { id: 20261, date: '2026-01-01', title: 'Año Nuevo' },
    ];
    localStorage.setItem('holidays-CL-2026', JSON.stringify(holidays2026));

    render(<App />);

    // 1. Navegar a Enero en el sidebar para ver el feriado del 1 de Enero
    const eneroBtn = screen.getByText('Enero');
    fireEvent.click(eneroBtn);

    // Seleccionar el 1 de Enero (día con feriado) en la cuadrícula
    const holidayPill = await screen.findByTestId('holiday-pill');
    expect(holidayPill).toBeTruthy();
    fireEvent.click(holidayPill);

    // Verificar que el banner del feriado está activo
    expect(await screen.findByTestId('holiday-banner')).toBeTruthy();

    const eventosParaCrear = [
      'QA Evento Alfa',
      'QA Evento Beta',
      'QA Evento Gamma',
    ];

    // 2. Ingresar los 3 eventos secuencialmente
    for (const title of eventosParaCrear) {
      const addBtn = screen.getByRole('button', { name: 'Agregar nuevo evento' });
      fireEvent.click(addBtn);

      const titleInput = screen.getByLabelText('Título');
      fireEvent.change(titleInput, { target: { value: title } });

      const saveBtn = screen.getByRole('button', { name: 'Guardar' });
      fireEvent.click(saveBtn);

      // Constatar que aparece en la interfaz inmediatamente
      expect(screen.getByText(title)).toBeTruthy();
    }

    // 3. Verificar que los 3 eventos están presentes simultáneamente en la vista y en el estado
    for (const title of eventosParaCrear) {
      expect(screen.getByText(title)).toBeTruthy();
    }

    // 4. Eliminar secuencialmente cada uno de los 3 eventos pasando por el modal de confirmación
    for (const title of eventosParaCrear) {
      const eventHeading = screen.getByText(title);
      const eventCard = eventHeading.closest('li');
      expect(eventCard).toBeTruthy();

      if (eventCard) {
        const deleteBtn = within(eventCard).getByRole('menuitem', { name: 'Eliminar', hidden: true });
        fireEvent.click(deleteBtn);

        // Modal de confirmación en español
        expect(screen.getByText('Eliminar evento')).toBeTruthy();
        expect(screen.getByText(/¿Seguro que deseas eliminar/)).toBeTruthy();

        // Confirmar eliminación
        const confirmBtn = screen.getByRole('button', { name: 'Confirmar' });
        fireEvent.click(confirmBtn);

        // Verificar que ya no figura en la pantalla
        expect(screen.queryByText(title)).toBeNull();
      }
    }
  });
  //FIN SPEC-002 - QA
});
