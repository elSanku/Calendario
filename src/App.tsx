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
//INI SPEC-001 - 02
// Iconos para barra de navegación en vista móvil
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
//FIN SPEC-001 - 02
//INI SPEC-002 - 06
// Importaciones para sincronización dinámica de feriados nacionales
import type { Holiday, HolidaysMap } from './types/holiday';
import { fetchHolidaysForYear, createHolidaysMap } from './utils/holidaysApi';
//FIN SPEC-002 - 06
//INI SPEC-003 - 07
// Tipos de categorías y utilidades de filtrado reactivo
import type { EventCategory } from './types/calendar';
import { ALL_CATEGORIES, filterEvents } from './utils/categoryUtils';
//FIN SPEC-003 - 07
//INI SPEC-004 - 01
// Tipos y constantes para perfil de usuario y conmutador de contexto
import type { UserProfile, UserProfileRole } from './types/user';
import { USER_PROFILE_STORAGE_KEY, DEFAULT_USER_PROFILE } from './types/user';
//FIN SPEC-004 - 01
import styles from './App.module.css';

const EVENTS_STORAGE_KEY = 'calendar-events';

//INI SPEC-004 - 01
// Carga autoritaria de eventos: si existe clave en localStorage, no se reinyectan mocks
const loadEvents = (): CalendarEvent[] => {
  try {
    const raw = localStorage.getItem(EVENTS_STORAGE_KEY);
    if (raw !== null) {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return sanitizeEvents(parsed);
      }
    }
  } catch {
    // Fallback ante error de lectura
  }
  return mockEvents;
};
//FIN SPEC-004 - 01

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

  //INI SPEC-004 - 01
  // Estado para el perfil del usuario activo y persistencia en localStorage
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const raw = localStorage.getItem(USER_PROFILE_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UserProfile;
        if (parsed && typeof parsed.name === 'string' && parsed.activeRole) {
          return parsed;
        }
      }
    } catch {
      // Fallback a perfil predeterminado
    }
    return DEFAULT_USER_PROFILE;
  });

  useEffect(() => {
    try {
      localStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(userProfile));
    } catch {
      // LocalStorage lleno o restringido
    }
  }, [userProfile]);

  const handleRoleChange = (newRole: UserProfileRole) => {
    setUserProfile((prev) => ({
      ...prev,
      activeRole: newRole,
    }));
  };
  //FIN SPEC-004 - 01

  // Estado del modal de creación de eventos
  const [isEventModalOpen, setIsEventModalOpen] = useState<boolean>(false);
  // Evento en edición (null = modo creación)
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  // Evento pendiente de confirmación para eliminar
  const [deletingEvent, setDeletingEvent] = useState<CalendarEvent | null>(null);

  //INI SPEC-003 - 07
  // Estados para filtros de categorías y buscador en vivo
  const [activeCategories, setActiveCategories] = useState<EventCategory[]>(ALL_CATEGORIES);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleToggleCategory = (category: EventCategory) => {
    setActiveCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleResetFilters = () => {
    setActiveCategories(ALL_CATEGORIES);
    setSearchQuery('');
  };

  // Cálculo reactivo de eventos filtrados para toda la interfaz
  const filteredEvents = useMemo(() => {
    return filterEvents(events, activeCategories, searchQuery);
  }, [events, activeCategories, searchQuery]);
  //FIN SPEC-003 - 07

  //INI SPEC-002 - 06
  // Estado para feriados nacionales oficiales del año visualizado
  const [holidays, setHolidays] = useState<Holiday[]>([]);

  useEffect(() => {
    let isActive = true;
    const controller = new AbortController();

    fetchHolidaysForYear(currentYear, controller.signal).then((data) => {
      if (isActive) {
        setHolidays(data);
      }
    });

    return () => {
      isActive = false;
      controller.abort();
    };
  }, [currentYear]);

  // Mapa reactivo de feriados por fecha YYYY-MM-DD para lookup O(1)
  const holidaysMap: HolidaysMap = useMemo(() => {
    return createHolidaysMap(holidays);
  }, [holidays]);
  //FIN SPEC-002 - 06

  //INI SPEC-001 - 02
  // Estados para drawers colapsables en móvil
  const [isSidebarDrawerOpen, setIsSidebarDrawerOpen] = useState<boolean>(false);
  const [isDayPanelDrawerOpen, setIsDayPanelDrawerOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSidebarDrawerOpen(false);
        setIsDayPanelDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  //FIN SPEC-001 - 02

  // Elimina el evento (por ID) tras la confirmación
  const handleConfirmDelete = () => {
    if (deletingEvent) {
      setEvents((prev) => prev.filter((e) => e.id !== deletingEvent.id));
    }
    setDeletingEvent(null);
  };

  // Conteo de eventos por mes para el año visualizado
  //INI SPEC-003 - 07
  // Conteo reactivo derivado de eventos filtrados
  const eventCounts = useMemo(() => {
    return getEventCountsByMonth(currentYear, filteredEvents);
  }, [currentYear, filteredEvents]);
  //FIN SPEC-003 - 07

  // Celdas de la cuadrícula de 42 días
  const gridCells = useMemo(() => {
    //INI SPEC-002 - 06
    // Inyectar el mapa de feriados a la cuadrícula de 42 celdas
    //INI SPEC-003 - 07
    // Reemplazar events por filteredEvents para reflejar filtros y búsqueda en vivo
    return generateMonthGrid(
      currentYear,
      currentMonthIndex,
      selectedDateStr,
      filteredEvents,
      holidaysMap
    );
    //FIN SPEC-003 - 07
    //FIN SPEC-002 - 06
  }, [currentYear, currentMonthIndex, selectedDateStr, filteredEvents, holidaysMap]);

  // Eventos correspondientes al día seleccionado
  //INI SPEC-003 - 07
  // Eventos del día seleccionado derivados de filteredEvents
  const selectedDayEvents = useMemo(() => {
    return sortEventsByTime(filteredEvents.filter((e) => e.date === selectedDateStr));
  }, [selectedDateStr, filteredEvents]);
  //FIN SPEC-003 - 07

  // Manejador para cambio de año
  const handleYearChange = (newYear: number) => {
    setCurrentYear(newYear);
  };

  // Manejador para selección de mes desde el sidebar
  const handleMonthSelect = (monthIndex: number) => {
    setCurrentMonthIndex(monthIndex);
    //INI SPEC-001 - 02
    setIsSidebarDrawerOpen(false);
    //FIN SPEC-001 - 02
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

  //INI SPEC-003 - 07
  // Navegación mensual rápida y botón Hoy
  const handlePrevMonth = () => {
    setCurrentMonthIndex((prev) => {
      if (prev === 0) {
        setCurrentYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonthIndex((prev) => {
      if (prev === 11) {
        setCurrentYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  const handleGoToToday = () => {
    const now = dayjs();
    setCurrentYear(now.year());
    setCurrentMonthIndex(now.month());
    setSelectedDateStr(now.format('YYYY-MM-DD'));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorar si hay modales o diálogos abiertos
      if (isEventModalOpen || deletingEvent !== null) return;

      // Ignorar si el foco está en un campo editable
      const target = e.target as HTMLElement | null;
      if (target) {
        const tagName = target.tagName;
        if (
          tagName === 'INPUT' ||
          tagName === 'TEXTAREA' ||
          tagName === 'SELECT' ||
          target.isContentEditable
        ) {
          return;
        }
      }

      if (e.key === 't' || e.key === 'T') {
        handleGoToToday();
      } else if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setEditingEvent(null);
        setIsEventModalOpen(true);
      } else if (e.key === 'ArrowLeft') {
        handlePrevMonth();
      } else if (e.key === 'ArrowRight') {
        handleNextMonth();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEventModalOpen, deletingEvent]);
  //FIN SPEC-003 - 07

  return (
    <div className={styles.appContainer}>
      <div className={styles.calendarCard}>
        {/* INI SPEC-001 - 02 */}
        {/* Barra superior visible en móviles para abrir paneles laterales */}
        <div className={styles.mobileBar}>
          <button
            type="button"
            className={styles.mobileToggleBtn}
            onClick={() => setIsSidebarDrawerOpen(true)}
            aria-label="Abrir navegación de meses"
          >
            <CalendarIcon size={16} />
            <span>Meses</span>
          </button>
          <button
            type="button"
            className={styles.mobileToggleBtn}
            onClick={() => setIsDayPanelDrawerOpen(true)}
            aria-label="Abrir agenda del día"
          >
            <Clock size={16} />
            <span>Agenda</span>
          </button>
        </div>

        {/* Sidebar con navegación de año y meses envuelto en drawer para móvil */}
        <div className={`${styles.sidebarWrapper} ${isSidebarDrawerOpen ? styles.open : ''}`}>
          {/* INI SPEC-003 - 07 */}
          <Sidebar
            year={currentYear}
            selectedMonth={currentMonthIndex}
            eventCounts={eventCounts}
            onYearChange={handleYearChange}
            onMonthSelect={handleMonthSelect}
            activeCategories={activeCategories}
            onToggleCategory={handleToggleCategory}
          />
          {/* FIN SPEC-003 - 07 */}
        </div>

        {/* Área Central: Header + Cuadrícula mensual */}
        <main className={styles.centerArea}>
          {/* INI SPEC-003 - 07 */}
          {/* INI SPEC-004 - 03 */}
          {/* Header con perfil y conmutador de rol; remoción de prop onNewEvent */}
          <Header
            currentMonthIndex={currentMonthIndex}
            currentYear={currentYear}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            onToday={handleGoToToday}
            profile={userProfile}
            onRoleChange={handleRoleChange}
          />
          {/* FIN SPEC-004 - 03 */}
          <CalendarGrid
            cells={gridCells}
            onSelectDay={handleSelectDay}
            onEditEvent={handleEditEvent}
          />
          {/* FIN SPEC-003 - 07 */}
        </main>

        {/* Panel lateral derecho: Detalle del día y botón + envuelto en drawer para móvil */}
        <div className={`${styles.dayPanelWrapper} ${isDayPanelDrawerOpen ? styles.open : ''}`}>
          <DayPanel
            selectedDateStr={selectedDateStr}
            events={selectedDayEvents}
            //INI SPEC-002 - 06
            // Inyectar el feriado correspondiente a la fecha seleccionada
            holiday={holidaysMap[selectedDateStr] || null}
            //FIN SPEC-002 - 06
            //INI SPEC-003 - 07
            hasActiveFilters={
              activeCategories.length < ALL_CATEGORIES.length || searchQuery.trim().length > 0
            }
            onResetFilters={handleResetFilters}
            onAddEventClick={() => {
              setEditingEvent(null);
              setIsEventModalOpen(true);
            }}
            //FIN SPEC-003 - 07
            onEditEvent={handleEditEvent}
            onDeleteEvent={setDeletingEvent}
          />
        </div>

        {/* Backdrop para cerrar drawers al tocar fuera en pantallas móviles */}
        {(isSidebarDrawerOpen || isDayPanelDrawerOpen) && (
          <div
            className={styles.drawerBackdrop}
            onClick={() => {
              setIsSidebarDrawerOpen(false);
              setIsDayPanelDrawerOpen(false);
            }}
            aria-hidden="true"
          />
        )}
        {/* FIN SPEC-001 - 02 */}

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
