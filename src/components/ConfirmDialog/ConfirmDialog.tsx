import React, { useEffect, useRef } from 'react';
import formStyles from '../EventFormModal/EventFormModal.module.css';
import styles from './ConfirmDialog.module.css';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}

/** Ventana de confirmación basada en el elemento nativo <dialog>. */
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  onCancel,
  onConfirm,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      className={`${formStyles.dialog} ${styles.dialog}`}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-message"
      {...({ closedby: 'any' } as Record<string, string>)}
      onClose={onCancel}
    >
      <h2 id="confirm-dialog-title" className={formStyles.title}>
        {title}
      </h2>
      <p id="confirm-dialog-message" className={styles.message}>
        {message}
      </p>
      <div className={formStyles.actions}>
        <button type="button" className={formStyles.cancelBtn} onClick={onCancel} autoFocus>
          Cancelar
        </button>
        <button type="button" className={styles.confirmBtn} onClick={onConfirm}>
          Confirmar
        </button>
      </div>
    </dialog>
  );
};

