//INI SPEC-002 - 01
// Tipos de dominio para la integración de Feriados de Chile (API privados.cl)

export interface HolidayRecord {
  id: number | string;
  name?: string;
  date: string; // Formato ISO YYYY-MM-DD
  description: string; // Nombre oficial de la festividad
  country?: string;
  legal?: number;
  sigla?: string;
  type?: string;
  active?: number;
}

export interface HolidayApiResponse {
  records?: HolidayRecord[];
}

export interface Holiday {
  id: string | number;
  date: string; // YYYY-MM-DD
  title: string; // Nombre formateado de la festividad (extraído de description)
  type?: string;
}

export type HolidaysMap = Record<string, Holiday>;
//FIN SPEC-002 - 01
