import React, { useRef } from 'react';
import dayjs from 'dayjs';
//INI SPEC-003 - 02
// Tipos y utilidades para categorización en formulario
import type { CalendarEvent, EventCategory } from '../../types/calendar';
import { resolveEventCategory, getCategoryMeta, DEFAULT_CATEGORY } from '../../utils/categoryUtils';
//FIN SPEC-003 - 02
import {
  findDuplicate,
  formatEventTime,
  normalizeTitle,
  validateEventForm,
  type EventFormErrors,
  type EventFormValues,
} from '../../utils/eventValidation';
import type { NewEventData } from '../EventFormModal/EventFormModal';

//INI SPEC-003 - 02
// Los colores por defecto ahora se resuelven mediante getCategoryMeta(selectedCategory).color
//FIN SPEC-003 - 02
export const FIELD_ORDER: (keyof EventFormValues)[] = [
  'title',
  'description',
  'date',
  'startTime',
  'endTime',
];

interface UseEventFormOptions {
  initialValues: EventFormValues;
  event?: CalendarEvent | null;
  existingEvents: CalendarEvent[];
  onSave: (event: NewEventData) => void;
  onDirtyChange: (dirty: boolean) => void;
}

export const useEventForm = ({
  initialValues,
  event,
  existingEvents,
  onSave,
  onDirtyChange,
}: UseEventFormOptions) => {
  //INI SPEC-003 - 02
  // Inicialización de categoría del evento y soporte en estado
  const initialCategory: EventCategory =
    initialValues.category ?? (event ? resolveEventCategory(event) : DEFAULT_CATEGORY);

  const [values, setValues] = React.useState<EventFormValues>({
    ...initialValues,
    category: initialCategory,
  });
  //FIN SPEC-003 - 02
  const [touched, setTouched] = React.useState<Partial<Record<keyof EventFormValues, boolean>>>({});
  const [submitted, setSubmitted] = React.useState(false);
  const submittingRef = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);

  const errors: EventFormErrors = validateEventForm(values);
  //INI SPEC-003 - 02
  // Detección de cambios considerando campos base y categoría seleccionada
  const isDirty =
    FIELD_ORDER.some((k) => values[k] !== initialValues[k]) ||
    (values.category ?? DEFAULT_CATEGORY) !== initialCategory;
  //FIN SPEC-003 - 02
  const isPast = !errors.date && dayjs(values.date).isBefore(dayjs(), 'day');
  const duplicate =
    !errors.title && !errors.date
      ? findDuplicate(values, existingEvents, event?.id)
      : undefined;

  React.useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  const showError = (field: keyof EventFormValues) =>
    (submitted || touched[field]) && errors[field];

  const setField =
    (field: keyof EventFormValues) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setValues((prev) => ({ ...prev, [field]: e.target.value }));

  //INI SPEC-003 - 02
  // Manejador específico para cambiar de categoría
  const setCategory = (category: EventCategory) => {
    setValues((prev) => ({ ...prev, category }));
  };
  //FIN SPEC-003 - 02

  const markTouched = (field: keyof EventFormValues) => () =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    const firstInvalid = FIELD_ORDER.find((k) => errors[k]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`#event-${firstInvalid}`)?.focus();
      return;
    }
    if (submittingRef.current) return; // Evita doble envío
    submittingRef.current = true;
    //INI SPEC-003 - 02
    // Sincroniza la categoría y el color semántico oficial al guardar
    const selectedCategory: EventCategory = values.category ?? initialCategory;
    const categoryMeta = getCategoryMeta(selectedCategory);

    onSave({
      title: normalizeTitle(values.title),
      date: values.date,
      time: formatEventTime(values.startTime, values.endTime),
      description: values.description.trim() || undefined,
      category: selectedCategory,
      color: categoryMeta.color,
    });
    //FIN SPEC-003 - 02
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      formRef.current?.requestSubmit();
    }
  };

  const fieldProps = (field: keyof EventFormValues) => {
    const error = showError(field);
    return {
      id: `event-${field}`,
      'aria-invalid': error ? true : undefined,
      'aria-describedby': error ? `event-${field}-error` : undefined,
      onBlur: markTouched(field),
    };
  };

  return {
    formRef,
    values,
    isDirty,
    isPast,
    duplicate,
    setField,
    //INI SPEC-003 - 02
    setCategory,
    //FIN SPEC-003 - 02
    fieldProps,
    showError,
    handleSubmit,
    handleKeyDown,
  };
};

