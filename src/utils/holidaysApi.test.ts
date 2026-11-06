//INI SPEC-002 - 02
// Pruebas unitarias para el servicio de feriados de Chile (holidaysApi.ts)

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  fetchHolidaysForYear,
  createHolidaysMap,
  clearHolidaysCache,
  getHolidayStorageKey,
  HOLIDAYS_BASE_URL,
} from './holidaysApi';
import type { Holiday } from '../types/holiday';

describe('holidaysApi', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    localStorage.clear();
  });

  describe('fetchHolidaysForYear', () => {
    it('consulta la API pública y persiste en localStorage cuando no está en caché', async () => {
      const mockApiResponse = {
        records: [
          {
            id: 1,
            name: 'Año Nuevo',
            date: '2027-01-01',
            description: 'Año Nuevo',
            country: 'Chile',
          },
          {
            id: 2,
            name: 'Navidad',
            date: '2027-12-25',
            description: 'Navidad',
            country: 'Chile',
          },
        ],
      };

      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockApiResponse,
      });
      globalThis.fetch = mockFetch;

      const holidays = await fetchHolidaysForYear(2027);

      expect(mockFetch).toHaveBeenCalledWith(`${HOLIDAYS_BASE_URL}/2027`, { signal: undefined });
      expect(holidays).toHaveLength(2);
      expect(holidays[0]).toEqual({
        id: 1,
        date: '2027-01-01',
        title: 'Año Nuevo',
        type: '',
      });

      // Verificar que se guardó en localStorage
      const cached = localStorage.getItem(getHolidayStorageKey(2027));
      expect(cached).toBeTruthy();
      expect(JSON.parse(cached!)).toEqual(holidays);
    });

    it('retorna los datos desde localStorage sin realizar petición fetch (cache hit)', async () => {
      const preCached: Holiday[] = [
        { id: 99, date: '2026-05-01', title: 'Día del Trabajador', type: '' },
      ];
      localStorage.setItem(getHolidayStorageKey(2026), JSON.stringify(preCached));

      const mockFetch = vi.fn();
      globalThis.fetch = mockFetch;

      const holidays = await fetchHolidaysForYear(2026);

      expect(mockFetch).not.toHaveBeenCalled();
      expect(holidays).toEqual(preCached);
    });

    it('retorna un arreglo vacío de forma resiliente si fetch falla por error de red', async () => {
      globalThis.fetch = vi.fn().mockRejectedValue(new Error('Network offline'));

      const holidays = await fetchHolidaysForYear(2027);

      expect(holidays).toEqual([]);
    });

    it('retorna un arreglo vacío si la respuesta de la API no es exitosa (ej. 500)', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
      });

      const holidays = await fetchHolidaysForYear(2027);

      expect(holidays).toEqual([]);
    });

    it('maneja pacíficamente un año sin feriados (records vacío o indefinido)', async () => {
      globalThis.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ records: [] }),
      });

      const holidays = await fetchHolidaysForYear(2035);

      expect(holidays).toEqual([]);
    });
  });

  describe('createHolidaysMap', () => {
    it('genera un mapa indexado por fecha YYYY-MM-DD', () => {
      const list: Holiday[] = [
        { id: 1, date: '2026-01-01', title: 'Año Nuevo' },
        { id: 2, date: '2026-09-18', title: 'Fiestas Patrias' },
      ];

      const map = createHolidaysMap(list);

      expect(map['2026-01-01']?.title).toBe('Año Nuevo');
      expect(map['2026-09-18']?.title).toBe('Fiestas Patrias');
      expect(map['2026-12-25']).toBeUndefined();
    });

    it('concatena nombres de festividades si coinciden en la misma fecha', () => {
      const list: Holiday[] = [
        { id: 1, date: '2026-09-18', title: 'Fiestas Patrias' },
        { id: 2, date: '2026-09-18', title: 'Día de la Independencia' },
      ];

      const map = createHolidaysMap(list);

      expect(map['2026-09-18']?.title).toBe('Fiestas Patrias / Día de la Independencia');
    });
  });

  describe('clearHolidaysCache', () => {
    it('elimina la caché de un año específico o de todos los años', () => {
      localStorage.setItem('holidays-CL-2026', '[]');
      localStorage.setItem('holidays-CL-2027', '[]');
      localStorage.setItem('other-key', 'keep-me');

      clearHolidaysCache(2026);
      expect(localStorage.getItem('holidays-CL-2026')).toBeNull();
      expect(localStorage.getItem('holidays-CL-2027')).not.toBeNull();

      clearHolidaysCache();
      expect(localStorage.getItem('holidays-CL-2027')).toBeNull();
      expect(localStorage.getItem('other-key')).toBe('keep-me');
    });
  });
});
//FIN SPEC-002 - 02
