import { Modal } from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Aceptar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title}>
      <p style={{ marginBottom: '24px', color: 'var(--text-secondary)' }}>
        {message}
      </p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        <button className="btn btn-secondary" onClick={onCancel}>
          {cancelLabel}
        </button>
        <button className="btn btn-danger" onClick={() => { onConfirm(); onCancel(); }}>
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}
