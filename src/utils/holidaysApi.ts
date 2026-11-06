//INI SPEC-002 - 02
// Servicio de consulta de feriados oficiales de Chile con soporte de caché en localStorage y fallback resiliente

import type { Holiday, HolidayApiResponse, HolidaysMap } from '../types/holiday';

export const HOLIDAYS_BASE_URL = 'https://privados.cl/apiholidays/public/CL';

export const getHolidayStorageKey = (year: number): string => `holidays-CL-${year}`;

/**
 * Consulta los feriados para un año específico.
 * Prioriza la lectura de caché en localStorage. Si no existe, consulta la API pública
 * y persiste el resultado. Si la petición falla o no hay conexión, retorna un arreglo vacío
 * sin interrumpir el calendario.
 */
export async function fetchHolidaysForYear(year: number, signal?: AbortSignal): Promise<Holiday[]> {
  const cacheKey = getHolidayStorageKey(year);

  // 1. Intentar leer desde caché en localStorage
  try {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed)) {
        return parsed as Holiday[];
      }
    }
  } catch {
    // Si localStorage está bloqueado o dañado, continuamos a la red
  }

  // 2. Consulta a la API pública
  try {
    const url = `${HOLIDAYS_BASE_URL}/${year}`;
    const response = await fetch(url, { signal });

    if (!response.ok) {
      return [];
    }

    const data: HolidayApiResponse = await response.json();
    const records = Array.isArray(data?.records) ? data.records : [];

    const holidays: Holiday[] = records
      .filter((r) => Boolean(r && r.date && (r.description || r.name)))
      .map((r) => ({
        id: r.id ?? r.date,
        date: r.date,
        title: r.description?.trim() || r.name?.trim() || 'Feriado Nacional',
        type: r.type ?? '',
      }));

    // 3. Persistir en caché local
    try {
      localStorage.setItem(cacheKey, JSON.stringify(holidays));
    } catch {
      // Ignorar fallos de escritura de cuota en localStorage
    }

    return holidays;
  } catch {
    // Error de red, timeout o petición abortada: fallback silencioso
    return [];
  }
}

/**
 * Convierte una lista de feriados en un mapa indexado por fecha (YYYY-MM-DD) para acceso O(1).
 */
export function createHolidaysMap(holidays: Holiday[]): HolidaysMap {
  const map: HolidaysMap = {};

  holidays.forEach((h) => {
    if (!h.date) return;
    if (map[h.date]) {
      // Si coinciden múltiples festividades en el mismo día, se concatenan sus nombres
      map[h.date] = {
        ...map[h.date],
        title: `${map[h.date].title} / ${h.title}`,
      };
    } else {
      map[h.date] = h;
    }
  });

  return map;
}

/**
 * Limpia la caché de feriados en localStorage para pruebas o recarga forzada.
 */
export function clearHolidaysCache(year?: number): void {
  try {
    if (year) {
      localStorage.removeItem(getHolidayStorageKey(year));
    } else {
      // Limpiar todas las claves que comiencen con holidays-CL-
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('holidays-CL-')) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));
    }
  } catch {
    // Ignorar si localStorage no está accesible
  }
}
//FIN SPEC-002 - 02
