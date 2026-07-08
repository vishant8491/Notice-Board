import { useEffect, useRef } from 'react';

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  danger = false,
}) {
  const confirmRef = useRef(null);

  useEffect(() => {
    if (open) confirmRef.current?.focus();
  }, [open]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onCancel();
    }
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-lg bg-paper border border-line shadow-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="confirm-dialog-title" className="font-display text-lg font-semibold text-ink">
          {title}
        </h2>
        {description && <p className="mt-2 text-sm text-ink/70">{description}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="focus-ring rounded-md px-3.5 py-2 text-sm font-medium text-ink/70 hover:bg-ink/5 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            className={`focus-ring rounded-md px-3.5 py-2 text-sm font-medium text-white transition-colors ${
              danger ? 'bg-urgent hover:bg-urgent/90' : 'bg-accent hover:bg-accent/90'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
