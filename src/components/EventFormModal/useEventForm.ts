import React, { useRef } from 'react';
import dayjs from 'dayjs';
import type { CalendarEvent } from '../../types/calendar';
import {
  findDuplicate,
  formatEventTime,
  normalizeTitle,
  validateEventForm,
  type EventFormErrors,
  type EventFormValues,
} from '../../utils/eventValidation';
import type { NewEventData } from '../EventFormModal/EventFormModal';

const DEFAULT_EVENT_COLOR = '#48a999';
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
  const [values, setValues] = React.useState<EventFormValues>(initialValues);
  const [touched, setTouched] = React.useState<Partial<Record<keyof EventFormValues, boolean>>>({});
  const [submitted, setSubmitted] = React.useState(false);
  const submittingRef = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);

  const errors: EventFormErrors = validateEventForm(values);
  const isDirty = FIELD_ORDER.some((k) => values[k] !== initialValues[k]);
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
    onSave({
      title: normalizeTitle(values.title),
      date: values.date,
      time: formatEventTime(values.startTime, values.endTime),
      description: values.description.trim() || undefined,
      color: event?.color ?? DEFAULT_EVENT_COLOR,
    });
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
    fieldProps,
    showError,
    handleSubmit,
    handleKeyDown,
  };
};

