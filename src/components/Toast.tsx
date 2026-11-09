import React from 'react';
import { useTaskContext } from '../hooks/useTaskContext';
import './Toast.scss';

export const Toast: React.FC = () => {
  const { toasts, hideToast, undoDeleteTask } = useTaskContext();

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="toast-container" role="region" aria-label="Сповіщення">
      {toasts.map((toast) => {
        const progressPercent =
          toast.isUndoable && toast.countdown !== undefined
            ? (toast.countdown / 5) * 100
            : 100;

        return (
          <aside
            key={toast.id}
            className={`toast toast--${toast.type}`}
            role="status"
            aria-live="polite"
          >
            <div className="toast__content">
              <span className="toast__message">{toast.message}</span>
              <div className="toast__actions">
                {toast.isUndoable && toast.taskId !== undefined && (
                  <button
                    type="button"
                    className="toast__undo-btn"
                    onClick={() => undoDeleteTask(toast.taskId!)}
                  >
                    Скасувати
                  </button>
                )}
                <button
                  type="button"
                  className="toast__close-btn"
                  onClick={() => hideToast(toast.id)}
                  aria-label="Закрити сповіщення"
                >
                  ×
                </button>
              </div>
            </div>
            {toast.isUndoable && (
              <div className="toast__progress-track">
                <div
                  className="toast__progress-bar"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            )}
          </aside>
        );
      })}
    </div>
  );
};
