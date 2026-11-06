# Tareas — Spec 002: Integración de Feriados Nacionales de Chile

Checklist de ejecución atómica para la integración de la API pública de feriados de Chile con soporte de caché y sincronización dinámica por año.

- [x] **T1. Tipos de dominio para feriados en `src/types/holiday.ts` y extensión de `DayCell` en `src/types/calendar.ts`.** RF-8, RNF-1
  - *Hecho cuando*: Se creen las interfaces `HolidayRecord`, `HolidayApiResponse`, `Holiday`, `HolidaysMap` en `src/types/holiday.ts`, se añada `holiday?: Holiday` a `DayCell` en `src/types/calendar.ts`, y `npm run build` compile sin errores.
  - *Marcas*: `//INI SPEC-002 - 01` y `//FIN SPEC-002 - 01`

- [x] **T2. Servicio de consulta a la API y caché local en `src/utils/holidaysApi.ts` con pruebas unitarias.** RF-1, RF-2, RF-3, RF-9, CL-2
  - *Hecho cuando*: Se implemente `fetchHolidaysForYear(year)` con lectura/escritura en `localStorage` (`holidays-CL-{year}`), `createHolidaysMap()`, fallback resiliente sin excepciones bloqueantes, y la suite de pruebas `src/utils/holidaysApi.test.ts` pase al 100%.
  - *Marcas*: `//INI SPEC-002 - 02` y `//FIN SPEC-002 - 02`

- [x] **T3. Actualización de generación de cuadrícula en `src/utils/dateUtils.ts` con mapeo de feriados.** RF-4, RF-5
  - *Hecho cuando*: `generateMonthGrid` acepte opcionalmente el mapa de feriados y asigne la propiedad `holiday` a cada celda de fecha coincidente, con pruebas actualizadas en `src/utils/dateUtils.test.ts` pasando al 100%.
  - *Marcas*: `//INI SPEC-002 - 03` y `//FIN SPEC-002 - 03`

- [x] **T4. Proyección de badge festivo y tooltip en `src/components/CalendarGrid/`.** RF-4, RF-5, RNF-2, RNF-3
  - *Hecho cuando*: Cada celda con feriado renderice una píldora sutil con icono, nombre y tooltip accesible `title`, conviviendo armoniosamente con los dots de eventos personales, con pruebas en `CalendarGrid.test.tsx` en verde.
  - *Marcas*: `//INI SPEC-002 - 04` y `//FIN SPEC-002 - 04`

- [x] **T5. Banner conmemorativo de feriado en `src/components/DayPanel/`.** RF-6, RF-7, RNF-2, RNF-3
  - *Hecho cuando*: Al recibir la prop `holiday`, el `DayPanel` renderice un banner festivo en la cabecera destacando el nombre de la festividad sobre la lista de eventos personales, con pruebas en `DayPanel.test.tsx` en verde.
  - *Marcas*: `//INI SPEC-002 - 05` y `//FIN SPEC-002 - 05`

- [x] **T6. Orquestación y sincronización dinámica por año en `src/App.tsx`.** RF-1, RF-2, RF-8, CL-1
  - *Hecho cuando*: `App.tsx` cargue dinámicamente los feriados al cambiar `currentYear`, controle condiciones de carrera con descarte de peticiones obsoletas, distribuya los feriados al Grid y DayPanel, y `npm run build` compile limpiamente.
  - *Marcas*: `//INI SPEC-002 - 06` y `//FIN SPEC-002 - 06`

- [x] **T7. Verificación integral de la spec y suite de pruebas completa.** RF-1 a RF-9, RNF-1 a RNF-4
  - *Hecho cuando*: `npm run build` compile sin advertencias, `npm run test` ejecute y pase el 100% de las pruebas, y se verifique la navegación funcional entre años (2026, 2027) con feriados cacheados.
  - *Marcas*: Actualización de estado en `spec.md` a `implementada` y reporte final.
