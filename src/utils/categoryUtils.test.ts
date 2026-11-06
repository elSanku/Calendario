//INI SPEC-003 - 01
// Pruebas unitarias para las utilidades de categorías, extracción horaria y filtrado reactivo

import { describe, it, expect } from 'vitest';
import {
  ALL_CATEGORIES,
  DEFAULT_CATEGORY,
  EVENT_CATEGORIES,
  EVENT_CATEGORY_MAP,
  isValidCategory,
  resolveEventCategory,
  getCategoryMeta,
  extractStartTime,
  filterEvents,
} from './categoryUtils';
import type { CalendarEvent } from '../types/calendar';

describe('categoryUtils', () => {
  describe('constantes y metadatos', () => {
    it('define las 4 categorías oficiales en español en el orden esperado', () => {
      expect(ALL_CATEGORIES).toEqual(['work', 'personal', 'health', 'important']);
      expect(DEFAULT_CATEGORY).toBe('work');
      expect(EVENT_CATEGORIES.map((c) => c.label)).toEqual([
        'Trabajo',
        'Personal',
        'Salud',
        'Importante',
      ]);
      expect(EVENT_CATEGORY_MAP.work.label).toBe('Trabajo');
      expect(EVENT_CATEGORY_MAP.personal.label).toBe('Personal');
      expect(EVENT_CATEGORY_MAP.health.label).toBe('Salud');
      expect(EVENT_CATEGORY_MAP.important.label).toBe('Importante');
    });

    it('valida correctamente valores de categoría con isValidCategory', () => {
      expect(isValidCategory('work')).toBe(true);
      expect(isValidCategory('personal')).toBe(true);
      expect(isValidCategory('health')).toBe(true);
      expect(isValidCategory('important')).toBe(true);

      expect(isValidCategory('other')).toBe(false);
      expect(isValidCategory('')).toBe(false);
      expect(isValidCategory(undefined)).toBe(false);
      expect(isValidCategory(null)).toBe(false);
      expect(isValidCategory(123)).toBe(false);
    });

    it('retorna los metadatos correctos en getCategoryMeta y aplica fallback a Trabajo', () => {
      expect(getCategoryMeta('health').label).toBe('Salud');
      expect(getCategoryMeta('important').bgVar).toBe('var(--cat-important-bg)');
      expect(getCategoryMeta(undefined).id).toBe('work');
    });
  });

  describe('resolveEventCategory', () => {
    it('respeta la categoría explícita cuando es válida sin importar el color', () => {
      expect(
        resolveEventCategory({ title: 'Cita médica', category: 'health', color: '#3498db' }),
      ).toBe('health');
      expect(
        resolveEventCategory({ title: 'Entrega urgente', category: 'important' }),
      ).toBe('important');
    });

    it('infiere determinísticamente la categoría para todos los colores legados', () => {
      expect(resolveEventCategory({ title: 'Tenis', color: '#2ecc71' })).toBe('health');
      expect(resolveEventCategory({ title: 'Tenis mayúsculas', color: ' #2ECC71 ' })).toBe('health');

      expect(resolveEventCategory({ title: 'Código', color: '#3498db' })).toBe('work');
      expect(resolveEventCategory({ title: 'Cliente', color: '#9b59b6' })).toBe('work');

      expect(resolveEventCategory({ title: 'Aniversario', color: '#e74c3c' })).toBe('important');

      expect(resolveEventCategory({ title: 'Almuerzo', color: '#f39c12' })).toBe('personal');
      expect(resolveEventCategory({ title: 'Amigos', color: '#1abc9c' })).toBe('personal');
      expect(resolveEventCategory({ title: 'Vacaciones', color: '#e84393' })).toBe('personal');
    });

    it('usa fallback a work cuando no hay categoría ni color reconocido', () => {
      expect(resolveEventCategory({ title: 'Sin color' })).toBe('work');
      expect(resolveEventCategory({ title: 'Color desconocido', color: '#000000' })).toBe('work');
    });
  });

  describe('extractStartTime', () => {
    it('extrae HH:mm inicial de un rango horario o de una hora simple', () => {
      expect(extractStartTime('09:30 - 11:00')).toBe('09:30');
      expect(extractStartTime('07:05-08:15')).toBe('07:05');
      expect(extractStartTime('  14:00  ')).toBe('14:00');
      expect(extractStartTime('00:00 - 23:59')).toBe('00:00');
    });

    it('retorna null cuando está vacío, es Todo el día o el formato no es válido', () => {
      expect(extractStartTime(undefined)).toBeNull();
      expect(extractStartTime('')).toBeNull();
      expect(extractStartTime('   ')).toBeNull();
      expect(extractStartTime('Todo el día')).toBeNull();
      expect(extractStartTime('todo el dia')).toBeNull();
      expect(extractStartTime('25:00 - 26:00')).toBeNull();
      expect(extractStartTime('Sin horario')).toBeNull();
    });
  });

  describe('filterEvents', () => {
    const sampleEvents: CalendarEvent[] = [
      {
        id: '1',
        title: 'Reunión de Planificación Estratégica',
        description: 'Revisión trimestral del equipo técnico',
        date: '2026-11-10',
        time: '09:30 - 11:00',
        category: 'work',
      },
      {
        id: '2',
        title: 'Sesión de Natación Olímpica',
        description: 'Entrenamiento cardiovascular en piscina',
        date: '2026-11-10',
        time: '07:00 - 08:00',
        color: '#2ecc71', // legado -> health
      },
      {
        id: '3',
        title: 'Cumpleaños de Mamá',
        description: 'Celebración familiar y reunión en casa',
        date: '2026-11-11',
        time: '19:00 - 22:00',
        category: 'important',
      },
      {
        id: '4',
        title: 'Salida con Amigos',
        description: 'Café y conversación en el centro',
        date: '2026-11-12',
        time: '18:30 - 20:00',
        category: 'personal',
      },
    ];

    it('retorna todos los eventos cuando todas las categorías están activas y la búsqueda está vacía', () => {
      const result = filterEvents(sampleEvents, ALL_CATEGORIES, '   ');
      expect(result).toHaveLength(4);
    });

    it('retorna un arreglo vacío si hay 0 categorías activas (CL-3)', () => {
      expect(filterEvents(sampleEvents, [], '')).toEqual([]);
      expect(filterEvents(sampleEvents, [], 'Reunión')).toEqual([]);
    });

    it('filtra por categorías activas incluyendo eventos con categoría inferida por color legado', () => {
      const result = filterEvents(sampleEvents, ['health', 'personal'], '');
      expect(result.map((e) => e.id)).toEqual(['2', '4']);
    });

    it('busca en título y descripción ignorando mayúsculas, minúsculas y tildes', () => {
      // 'reunion' sin tilde coincide en título del id '1' ("Reunión") y descripción del id '3' ("reunión")
      const byKeyword = filterEvents(sampleEvents, ALL_CATEGORIES, 'REUNION');
      expect(byKeyword.map((e) => e.id)).toEqual(['1', '3']);

      // 'natacion' sin tilde coincide con "Natación"
      const bySport = filterEvents(sampleEvents, ALL_CATEGORIES, 'natacion');
      expect(bySport.map((e) => e.id)).toEqual(['2']);

      // Búsqueda en descripción con tildes en el query ("conversación" -> "CONVERSACION")
      const byDesc = filterEvents(sampleEvents, ALL_CATEGORIES, 'conversacion');
      expect(byDesc.map((e) => e.id)).toEqual(['4']);
    });

    it('combina búsqueda de texto e intersección lógica AND con el filtro de categorías (CL-2)', () => {
      const result = filterEvents(sampleEvents, ['work'], 'reunion');
      expect(result.map((e) => e.id)).toEqual(['1']);
    });
  });
});
//FIN SPEC-003 - 01
