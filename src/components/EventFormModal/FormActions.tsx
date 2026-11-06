import React from 'react';
import styles from './EventFormModal.module.css';

interface FormActionsProps {
  onCancel: () => void;
  isSaveDisabled?: boolean;
  saveTitle?: string;
}

export const FormActions: React.FC<FormActionsProps> = ({
  onCancel,
  isSaveDisabled = false,
  saveTitle,
}) => {
  return (
    <div className={styles.actions}>
      <button type="button" className={styles.cancelBtn} onClick={onCancel}>
        Cancelar
      </button>
      <button
        type="submit"
        className={styles.saveBtn}
        disabled={isSaveDisabled}
        title={saveTitle}
      >
        Guardar
      </button>
    </div>
  );
};

