import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import dayjs from 'dayjs';
import { EventFormModal } from './EventFormModal';

beforeAll(() => {
  // jsdom no implementa showModal/close del <dialog>
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute('open');
  };
});

describe('EventFormModal', () => {
  it('usa la fecha de hoy por defecto', () => {
    render(<EventFormModal isOpen onClose={() => {}} onSave={() => {}} />);
    const dateInput = screen.getByLabelText('Fecha') as HTMLInputElement;
    expect(dateInput.value).toBe(dayjs().format('YYYY-MM-DD'));
  });

  it('guarda el evento con los datos ingresados', () => {
    const onSave = vi.fn();
    render(<EventFormModal isOpen onClose={() => {}} onSave={onSave} />);
    fireEvent.change(screen.getByLabelText('Título'), { target: { value: '  Dentista ' } });
    fireEvent.change(screen.getByLabelText(/Hora inicio/), { target: { value: '10:30' } });
    fireEvent.change(screen.getByLabelText(/Hora fin/), { target: { value: '11:30' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave.mock.calls[0][0]).toMatchObject({
      title: 'Dentista',
      time: '10:30 - 11:30',
      description: undefined,
      //INI SPEC-003 - 02
      category: 'work',
      color: '#2b6cb0',
      //FIN SPEC-003 - 02
    });
  });

  it('no guarda si la hora de inicio es superior a la de fin', () => {
    const onSave = vi.fn();
    render(<EventFormModal isOpen onClose={() => {}} onSave={onSave} />);
    fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Entrenamiento' } });
    fireEvent.change(screen.getByLabelText(/Hora inicio/), { target: { value: '15:00' } });
    fireEvent.change(screen.getByLabelText(/Hora fin/), { target: { value: '14:00' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getByText('La hora de inicio debe ser anterior a la de fin.')).toBeTruthy();
  });

  it('no guarda si el título está vacío', () => {
    const onSave = vi.fn();
    render(<EventFormModal isOpen onClose={() => {}} onSave={onSave} />);
    fireEvent.change(screen.getByLabelText('Título'), { target: { value: '   ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getByText('El título no puede estar vacío.')).toBeTruthy();
  });

  it('usa la fecha por defecto recibida', () => {
    render(<EventFormModal isOpen onClose={() => {}} onSave={() => {}} defaultDate="2026-12-24" />);
    expect((screen.getByLabelText('Fecha') as HTMLInputElement).value).toBe('2026-12-24');
  });

  it('pide confirmación al cerrar con cambios sin guardar', () => {
    const onClose = vi.fn();
    render(<EventFormModal isOpen onClose={onClose} onSave={() => {}} />);
    fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Algo' } });
    fireEvent.click(screen.getByRole('button', { name: 'Cerrar' }));
    expect(onClose).not.toHaveBeenCalled();
    expect(screen.getByText('Tienes cambios sin guardar. ¿Deseas descartarlos?')).toBeTruthy();
  });

  it('en modo edición precarga los campos y guarda los cambios', () => {
    const onSave = vi.fn();
    //INI SPEC-003 - 02
    // Actualización de evento existente con categoría oficial
    const event = {
      id: 'abc',
      title: 'Reunión',
      description: 'Sala 2',
      date: '2026-11-05',
      time: '09:00',
      category: 'work' as const,
      color: '#2b6cb0',
    };
    //FIN SPEC-003 - 02
    render(<EventFormModal isOpen onClose={() => {}} onSave={onSave} event={event} />);
    expect(screen.getByText('Editar evento')).toBeTruthy();
    expect((screen.getByLabelText('Título') as HTMLInputElement).value).toBe('Reunión');
    expect((screen.getByLabelText(/Descripción/) as HTMLTextAreaElement).value).toBe('Sala 2');
    expect((screen.getByLabelText('Fecha') as HTMLInputElement).value).toBe('2026-11-05');
    expect((screen.getByLabelText(/Hora inicio/) as HTMLInputElement).value).toBe('09:00');
    fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Reunión editada' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
    //INI SPEC-003 - 02
    // Verificación de sincronización de categoría y color oficial al guardar edición
    expect(onSave.mock.calls[0][0]).toMatchObject({
      title: 'Reunión editada',
      category: 'work',
      color: '#2b6cb0',
    });
    //FIN SPEC-003 - 02
  });

  //INI SPEC-003 - 02
  // Pruebas unitarias de selección de categorías y sincronización de colores
  it('permite seleccionar una categoría distinta y la guarda con su color semántico', () => {
    const onSave = vi.fn();
    render(<EventFormModal isOpen onClose={() => {}} onSave={onSave} />);

    // Verificar selector accesible con role="radiogroup" y opciones en español
    const radiogroup = screen.getByRole('radiogroup', { name: 'Categoría del evento' });
    expect(radiogroup).toBeTruthy();
    expect(screen.getByLabelText('Trabajo')).toBeTruthy();
    expect(screen.getByLabelText('Personal')).toBeTruthy();
    expect(screen.getByLabelText('Salud')).toBeTruthy();
    expect(screen.getByLabelText('Importante')).toBeTruthy();

    // Por defecto 'Trabajo' está seleccionado
    expect((screen.getByLabelText('Trabajo') as HTMLInputElement).checked).toBe(true);

    // Seleccionar 'Salud'
    fireEvent.click(screen.getByLabelText('Salud'));
    expect((screen.getByLabelText('Salud') as HTMLInputElement).checked).toBe(true);
    expect((screen.getByLabelText('Trabajo') as HTMLInputElement).checked).toBe(false);

    // Llenar campos obligatorios y guardar
    fireEvent.change(screen.getByLabelText('Título'), { target: { value: 'Consulta Médica' } });
    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave.mock.calls[0][0]).toMatchObject({
      title: 'Consulta Médica',
      category: 'health',
      color: '#6b46c1',
    });
  });

  it('permite cambiar la categoría en modo edición y habilita el guardado', () => {
    const onSave = vi.fn();
    const event = {
      id: 'evt-edit-cat',
      title: 'Entrega Crítica',
      date: '2026-11-10',
      category: 'work' as const,
      color: '#2b6cb0',
    };
    render(<EventFormModal isOpen onClose={() => {}} onSave={onSave} event={event} />);

    // El botón Guardar debe estar inicialmente deshabilitado porque no hay cambios
    const saveBtn = screen.getByRole('button', { name: 'Guardar' });
    expect(saveBtn.hasAttribute('disabled')).toBe(true);

    // Cambiar la categoría a 'Importante'
    fireEvent.click(screen.getByLabelText('Importante'));
    expect(saveBtn.hasAttribute('disabled')).toBe(false);

    // Guardar los cambios
    fireEvent.click(saveBtn);
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave.mock.calls[0][0]).toMatchObject({
      title: 'Entrega Crítica',
      category: 'important',
      color: '#c53030',
    });
  });
  //FIN SPEC-003 - 02
});

