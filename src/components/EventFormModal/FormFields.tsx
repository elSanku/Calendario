import React from 'react';
import styles from './EventFormModal.module.css';

const COUNTER_RATIO = 0.75;

interface FormInputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string | false;
  maxLength?: number;
  optional?: boolean;
}

export const FormInputField: React.FC<FormInputFieldProps> = ({
  label,
  id,
  error,
  maxLength,
  optional,
  className,
  value,
  ...rest
}) => {
  const currentLength = typeof value === 'string' ? value.length : 0;
  const showCounter = maxLength !== undefined && currentLength >= maxLength * COUNTER_RATIO;
  const isOver = maxLength !== undefined && currentLength > maxLength;

  return (
    <div className={styles.field}>
      <label htmlFor={id}>
        {label} {optional && <span className={styles.optional}>(opcional)</span>}
      </label>
      <input
        id={id}
        value={value}
        maxLength={maxLength}
        className={className}
        {...rest}
      />
      <div className={styles.fieldFooter}>
        {error && (
          <span id={`${id}-error`} className={styles.error} role="alert">
            {error}
          </span>
        )}
        {showCounter && (
          <span
            className={`${styles.counter} ${isOver ? styles.counterOver : ''}`}
            aria-live="polite"
          >
            {currentLength}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
};

interface FormTextareaFieldProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  id: string;
  error?: string | false;
  maxLength?: number;
  optional?: boolean;
}

export const FormTextareaField: React.FC<FormTextareaFieldProps> = ({
  label,
  id,
  error,
  maxLength,
  optional,
  className,
  value,
  ...rest
}) => {
  const currentLength = typeof value === 'string' ? value.length : 0;
  const showCounter = maxLength !== undefined && currentLength >= maxLength * COUNTER_RATIO;
  const isOver = maxLength !== undefined && currentLength > maxLength;

  return (
    <div className={styles.field}>
      <label htmlFor={id}>
        {label} {optional && <span className={styles.optional}>(opcional)</span>}
      </label>
      <textarea
        id={id}
        value={value}
        maxLength={maxLength}
        className={className}
        {...rest}
      />
      <div className={styles.fieldFooter}>
        {error && (
          <span id={`${id}-error`} className={styles.error} role="alert">
            {error}
          </span>
        )}
        {showCounter && (
          <span
            className={`${styles.counter} ${isOver ? styles.counterOver : ''}`}
            aria-live="polite"
          >
            {currentLength}/{maxLength}
          </span>
        )}
      </div>
    </div>
  );
};

