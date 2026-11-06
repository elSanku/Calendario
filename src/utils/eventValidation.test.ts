import { describe, it, expect } from 'vitest';
import {
  findDuplicate,
  formatEventTime,
  generateId,
  isValidDateStr,
  normalizeTitle,
  parseEventTime,
  sanitizeEvents,
  sortEventsByTime,
  validateEventForm,
} from './eventValidation';

const base = { title: 'Reunión', description: '', date: '2026-11-05', startTime: '', endTime: '' };

describe('validateEventForm', () => {
  it('acepta valores válidos', () => {
    expect(validateEventForm(base)).toEqual({});
  });

  it('rechaza títulos vacíos, solo espacios o demasiado cortos', () => {
    expect(validateEventForm({ ...base, title: '   ' }).title).toBe('El título no puede estar vacío.');
    expect(validateEventForm({ ...base, title: 'a' }).title).toMatch(/al menos 2/);
  });

  it('rechaza descripciones demasiado largas', () => {
    expect(validateEventForm({ ...base, description: 'x'.repeat(501) }).description).toBeDefined();
  });

  it('rechaza fechas inexistentes o fuera de rango', () => {
    expect(validateEventForm({ ...base, date: '2026-02-30' }).date).toBe('La fecha no es válida.');
    expect(validateEventForm({ ...base, date: '20266-01-01' }).date).toBe('La fecha no es válida.');
    expect(validateEventForm({ ...base, date: '1800-01-01' }).date).toMatch(/1900 y 2100/);
    expect(validateEventForm({ ...base, date: '' }).date).toBe('Selecciona una fecha.');
  });

  it('rechaza horas inválidas', () => {
    expect(validateEventForm({ ...base, startTime: '25:00' }).startTime).toBe('La hora de inicio no es válida.');
    expect(validateEventForm({ ...base, endTime: '12:99' }).endTime).toBe('La hora de fin no es válida.');
  });

  it('valida que la hora de inicio no sea superior ni igual a la de fin', () => {
    const errorSuperior = validateEventForm({ ...base, startTime: '15:00', endTime: '14:00' });
    expect(errorSuperior.startTime).toBe('La hora de inicio debe ser anterior a la de fin.');
    expect(errorSuperior.endTime).toBe('La hora de fin debe ser posterior a la de inicio.');

    const errorIgual = validateEventForm({ ...base, startTime: '10:00', endTime: '10:00' });
    expect(errorIgual.startTime).toBe('La hora de inicio debe ser anterior a la de fin.');
    expect(errorIgual.endTime).toBe('La hora de fin debe ser posterior a la de inicio.');

    const valido = validateEventForm({ ...base, startTime: '10:00', endTime: '11:00' });
    expect(valido.startTime).toBeUndefined();
    expect(valido.endTime).toBeUndefined();
  });
});

describe('utilidades', () => {
  it('normaliza espacios del título', () => {
    expect(normalizeTitle('  Hola    mundo ')).toBe('Hola mundo');
  });

  it('valida fechas estrictas', () => {
    expect(isValidDateStr('2024-02-29')).toBe(true);
    expect(isValidDateStr('2025-02-29')).toBe(false);
  });

  it('detecta duplicados ignorando el evento editado', () => {
    const events = [{ id: '1', title: 'reunión', date: '2026-11-05' }];
    expect(findDuplicate(base, events)).toBeDefined();
    expect(findDuplicate(base, events, '1')).toBeUndefined();
  });

  it('descarta eventos mal formados', () => {
    const result = sanitizeEvents([
      { id: '1', title: 'Ok', date: '2026-01-01' },
      { id: '2', title: 'Sin fecha' },
      { title: 'Sin id', date: '2026-01-01' },
      { id: '3', title: 'Fecha mala', date: '2026-13-01' },
      { id: '4', title: 'Con rango', date: '2026-01-01', time: '07:00 - 08:30' },
      { id: '5', title: 'Todo el día', date: '2026-01-01', time: 'Todo el día' },
      null,
    ]);
    expect(result.map((e) => e.id)).toEqual(['1', '4', '5']);
  });

  it('ordena: todo el día primero y luego por hora', () => {
    const sorted = sortEventsByTime([
      { id: 'a', title: 'A', date: '2026-01-01', time: '15:00' },
      { id: 'b', title: 'B', date: '2026-01-01' },
      { id: 'c', title: 'C', date: '2026-01-01', time: '09:00' },
    ]);
    expect(sorted.map((e) => e.id)).toEqual(['b', 'c', 'a']);
  });

  it('genera IDs únicos', () => {
    expect(generateId()).not.toBe(generateId());
  });

  it('formatea y parsea rangos de horas correctamente', () => {
    expect(formatEventTime('09:00', '10:30')).toBe('09:00 - 10:30');
    expect(formatEventTime('09:00', '')).toBe('09:00');
    expect(formatEventTime('', '')).toBeUndefined();

    expect(parseEventTime('09:00 - 10:30')).toEqual({ startTime: '09:00', endTime: '10:30' });
    expect(parseEventTime('14:00')).toEqual({ startTime: '14:00', endTime: '' });
    expect(parseEventTime('Todo el día')).toEqual({ startTime: '', endTime: '' });
  });
});

