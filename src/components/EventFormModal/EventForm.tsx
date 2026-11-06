import React from 'react';
import type { CalendarEvent } from '../../types/calendar';
import {
  DATE_MAX,
  DATE_MIN,
  DESCRIPTION_MAX,
  TITLE_MAX,
  type EventFormValues,
} from '../../utils/eventValidation';
import { useEventForm } from './useEventForm';
import { FormInputField, FormTextareaField } from './FormFields';
import { FormActions } from './FormActions';
import type { NewEventData } from './EventFormModal';
import styles from './EventFormModal.module.css';

interface EventFormProps {
  initialValues: EventFormValues;
  event?: CalendarEvent | null;
  existingEvents: CalendarEvent[];
  onCancel: () => void;
  onSave: (event: NewEventData) => void;
  onDirtyChange: (dirty: boolean) => void;
}

export const EventForm: React.FC<EventFormProps> = ({
  initialValues,
  event,
  existingEvents,
  onCancel,
  onSave,
  onDirtyChange,
}) => {
  const {
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
  } = useEventForm({
    initialValues,
    event,
    existingEvents,
    onSave,
    onDirtyChange,
  });

  return (
    <form
      ref={formRef}
      className={styles.form}
      onSubmit={handleSubmit}
      onKeyDown={handleKeyDown}
      noValidate
    >
      <FormInputField
        {...fieldProps('title')}
        label="Título"
        type="text"
        value={values.title}
        onChange={setField('title')}
        error={showError('title')}
        maxLength={TITLE_MAX}
        required
        autoFocus
        autoComplete="off"
        placeholder="Ej: Reunión con el equipo"
      />

      <FormTextareaField
        {...fieldProps('description')}
        label="Descripción"
        optional
        value={values.description}
        onChange={setField('description')}
        error={showError('description')}
        maxLength={DESCRIPTION_MAX}
        rows={3}
        placeholder="Agrega más detalles"
      />

      <div className={styles.row}>
        <FormInputField
          {...fieldProps('date')}
          label="Fecha"
          type="date"
          value={values.date}
          onChange={setField('date')}
          error={showError('date')}
          min={DATE_MIN}
          max={DATE_MAX}
          required
        />
        <FormInputField
          {...fieldProps('startTime')}
          label="Hora inicio"
          optional
          type="time"
          value={values.startTime}
          onChange={setField('startTime')}
          error={showError('startTime')}
        />
        <FormInputField
          {...fieldProps('endTime')}
          label="Hora fin"
          optional
          type="time"
          value={values.endTime}
          onChange={setField('endTime')}
          error={showError('endTime')}
        />
      </div>

      {(isPast || duplicate) && (
        <div className={styles.warnings} aria-live="polite">
          {isPast && <p className={styles.warning}>Esta fecha ya pasó.</p>}
          {duplicate && <p className={styles.warning}>Ya existe un evento igual en esta fecha.</p>}
        </div>
      )}

      <FormActions
        onCancel={onCancel}
        isSaveDisabled={Boolean(event) && !isDirty}
        saveTitle={event && !isDirty ? 'No hay cambios para guardar' : undefined}
      />
    </form>
  );
};

