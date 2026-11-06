import React, { useState, useMemo, useEffect } from 'react';
import dayjs from 'dayjs';
import { Sidebar } from './components/Sidebar/Sidebar';
import { Header } from './components/Header/Header';
import { CalendarGrid } from './components/CalendarGrid/CalendarGrid';
import { DayPanel } from './components/DayPanel/DayPanel';
import { EventFormModal, type NewEventData } from './components/EventFormModal/EventFormModal';
import { ConfirmDialog } from './components/ConfirmDialog/ConfirmDialog';
import { mockEvents } from './mocks/events';
import type { CalendarEvent } from './types/calendar';
import { generateMonthGrid, getEventCountsByMonth } from './utils/dateUtils';
import { generateId, sanitizeEvents, sortEventsByTime } from './utils/eventValidation';
import styles from './App.module.css';

const EVENTS_STORAGE_KEY = 'calendar-events';

const loadEvents = (): CalendarEvent[] => {
  try {
    const raw = localStorage.getItem(EVENTS_STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      // Se descartan los eventos mal formados para no romper la cuadrícula
      if (Array.isArray(parsed)) {
        const stored = sanitizeEvents(parsed);
        // Combinamos los eventos base con los guardados/creados por el usuario
        const storedIds = new Set(stored.map((e) => e.id));
        const combined = [...mockEvents.filter((m) => !storedIds.has(m.id)), ...stored];
        return combined;
      }
    }
  } catch {
    // Datos corruptos o localStorage inaccesible: se usan los mocks
  }
  return mockEvents;
};

export const App: React.FC = () => {
  const today = dayjs();

  // Estado para el año y mes en vista
  const [currentYear, setCurrentYear] = useState<number>(today.year());
  const [currentMonthIndex, setCurrentMonthIndex] = useState<number>(today.month());

  // Estado para la fecha seleccionada (por defecto hoy)
  const [selectedDateStr, setSelectedDateStr] = useState<string>(today.format('YYYY-MM-DD'));

  // Estado de eventos inicializado con los eventos simulados (mocks)
  // Los eventos se persisten en localStorage; si no hay datos guardados se usan los mocks
  const [events, setEvents] = useState<CalendarEvent[]>(loadEvents);
  const [storageError, setStorageError] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
      setStorageError(false);
    } catch {
      // Almacenamiento no disponible o lleno: se avisa al usuario
      setStorageError(true);
    }
  }, [events]);

  // Estado del modal de creación de eventos
  const [isEventModalOpen, setIsEventModalOpen] = useState<boolean>(false);
  // Evento en edición (null = modo creación)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  // Evento pendiente de confirmación para eliminar
  const [deletingEvent, setDeletingEvent] = useState<CalendarEvent | null>(null);

  // Elimina el evento (por ID) tras la confirmación
  const handleConfirmDelete = () => {
    if (deletingEvent) {
      setEvents((prev) => prev.filter((e) => e.id !== deletingEvent.id));
    }
    setDeletingEvent(null);
  };

  // Conteo de eventos por mes para el año visualizado
  const eventCounts = useMemo(() => {
    return getEventCountsByMonth(currentYear, events);
  }, [currentYear, events]);

  // Celdas de la cuadrícula de 42 días
  const gridCells = useMemo(() => {
    return generateMonthGrid(currentYear, currentMonthIndex, selectedDateStr, events);
  }, [currentYear, currentMonthIndex, selectedDateStr, events]);

  // Eventos correspondientes al día seleccionado
  const selectedDayEvents = useMemo(() => {
    return sortEventsByTime(events.filter((e) => e.date === selectedDateStr));
  }, [selectedDateStr, events]);

  // Manejador para cambio de año
  const handleYearChange = (newYear: number) => {
    setCurrentYear(newYear);
  };

  // Manejador para selección de mes desde el sidebar
  const handleMonthSelect = (monthIndex: number) => {
    setCurrentMonthIndex(monthIndex);
  };

  // Manejador para selección de día en la grilla
  const handleSelectDay = (dateStr: string) => {
    setSelectedDateStr(dateStr);

    // Si el usuario hace clic en un día que pertenece a otro mes adyacente, sincronizamos el mes/año
    const clickedDay = dayjs(dateStr);
    if (clickedDay.year() !== currentYear) {
      setCurrentYear(clickedDay.year());
    }
    if (clickedDay.month() !== currentMonthIndex) {
      setCurrentMonthIndex(clickedDay.month());
    }
  };

  // Crea el evento, lo almacena en el estado y navega a su fecha
  // Crea o actualiza (por ID) el evento según el modo del modal
  const handleSaveEvent = (data: NewEventData) => {
    if (editingEvent) {
      const updated: CalendarEvent = { ...data, id: editingEvent.id };
      setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
      handleCloseEventModal();
      handleSelectDay(updated.date);
      return;
    }
    const newEvent: CalendarEvent = { ...data, id: generateId() };
    setEvents((prev) => [...prev, newEvent]);
    handleCloseEventModal();
    handleSelectDay(newEvent.date);
  };

  const handleCloseEventModal = () => {
    setIsEventModalOpen(false);
    setEditingEvent(null);
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setIsEventModalOpen(true);
  };

  return (
    <div className={styles.appContainer}>
      <div className={styles.calendarCard}>
        {/* Sidebar morado con navegación de año y meses (Captura 2) */}
        <Sidebar
          year={currentYear}
          selectedMonth={currentMonthIndex}
          eventCounts={eventCounts}
          onYearChange={handleYearChange}
          onMonthSelect={handleMonthSelect}
        />

        {/* Área Central: Header + Cuadrícula mensual (Captura 1) */}
        <main className={styles.centerArea}>
          <Header />
          <CalendarGrid cells={gridCells} onSelectDay={handleSelectDay} />
        </main>

        {/* Panel lateral derecho: Detalle del día y botón + (Captura 1) */}
        <DayPanel
          selectedDateStr={selectedDateStr}
          events={selectedDayEvents}
          onAddEventClick={() => setIsEventModalOpen(true)}
          onEditEvent={handleEditEvent}
          onDeleteEvent={setDeletingEvent}
        />

        {/* Confirmación antes de eliminar un evento */}
        <ConfirmDialog
          isOpen={deletingEvent !== null}
          title="Eliminar evento"
          message={`¿Seguro que deseas eliminar «${deletingEvent?.title ?? ''}»? Esta acción no se puede deshacer.`}
          onCancel={() => setDeletingEvent(null)}
          onConfirm={handleConfirmDelete}
        />

        {/* Modal para crear o editar un evento */}
        <EventFormModal
          isOpen={isEventModalOpen}
          onClose={handleCloseEventModal}
          onSave={handleSaveEvent}
          event={editingEvent}
          defaultDate={selectedDateStr}
          existingEvents={events}
        />
      </div>
      {storageError && (
        <p className={styles.storageError} role="alert">
          No se pudieron guardar los cambios. Libera espacio en el navegador o revisa sus permisos.
        </p>
      )}
    </div>
  );
};

export default App;
