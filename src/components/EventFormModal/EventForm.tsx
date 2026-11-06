import React from 'react';
import type { CalendarEvent } from '../../types/calendar';
//INI SPEC-003 - 02
// Importación de categorías oficiales para selector de formulario
import { EVENT_CATEGORIES } from '../../utils/categoryUtils';
//FIN SPEC-003 - 02
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
    //INI SPEC-003 - 02
    setCategory,
    //FIN SPEC-003 - 02
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

      {/* INI SPEC-003 - 02 */}
      {/* Selector accesible de categorías con radiogroup y píldoras interactivas */}
      <div className={styles.categoryField}>
        <span className={styles.categoryGroupLabel}>
          Categoría
        </span>
        <div
          role="radiogroup"
          aria-label="Categoría del evento"
          className={styles.categoryGrid}
        >
          {EVENT_CATEGORIES.map((cat) => {
            const isSelected = (values.category ?? 'work') === cat.id;
            return (
              <label
                key={cat.id}
                className={`${styles.categoryOption} ${isSelected ? styles.categoryOptionSelected : ''}`}
                style={
                  isSelected
                    ? ({
                        '--cat-active-bg': cat.bgVar,
                        '--cat-active-text': cat.textVar,
                        '--cat-active-dot': cat.dotVar,
                      } as React.CSSProperties)
                    : undefined
                }
              >
                <input
                  type="radio"
                  name="category"
                  value={cat.id}
                  checked={isSelected}
                  onChange={() => setCategory(cat.id)}
                  className={styles.categoryRadioInput}
                />
                <span
                  className={styles.categoryDot}
                  style={{ backgroundColor: cat.color }}
                  aria-hidden="true"
                />
                <span className={styles.categoryLabel}>{cat.label}</span>
              </label>
            );
          })}
        </div>
      </div>
      {/* FIN SPEC-003 - 02 */}

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

