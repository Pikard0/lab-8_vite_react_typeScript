import React, { useEffect, useState } from 'react';
import type { Task } from '../types/task';
import { taskRepository } from '../repositories/taskRepository';
import './TaskDetails.scss';

interface TaskDetailsProps {
  taskId: number;
  onClose: () => void;
}

export const TaskDetails: React.FC<TaskDetailsProps> = ({ taskId, onClose }) => {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    taskRepository
      .getById(taskId, controller.signal)
      .then((data) => {
        setTask(data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        setError(err instanceof Error ? err.message : 'Помилка завантаження деталей завдання');
        setLoading(false);
      });

    return () => {
      controller.abort();
    };
  }, [taskId]);

  return (
    <div className="task-details-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="task-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="task-details-modal__header">
          <h2 className="task-details-modal__title">Деталі завдання (з API)</h2>
          <button
            type="button"
            className="task-details-modal__close-btn"
            onClick={onClose}
            aria-label="Закрити модальне вікно"
          >
            &times;
          </button>
        </div>

        <div className="task-details-modal__body">
          {loading && (
            <div className="task-details-modal__loading">
              <div className="task-details-modal__spinner" aria-hidden="true" />
              <p>Завантаження інформації з сервера...</p>
            </div>
          )}

          {error && (
            <div className="task-details-modal__error">
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && task && (
            <div className="task-details-modal__info">
              <div className="task-details-modal__group">
                <span className="task-details-modal__label">ID завдання:</span>
                <span className="task-details-modal__value">#{task.id}</span>
              </div>

              <div className="task-details-modal__group">
                <span className="task-details-modal__label">Назва (todo):</span>
                <span className="task-details-modal__value task-details-modal__value--title">
                  {task.title}
                </span>
              </div>

              <div className="task-details-modal__group">
                <span className="task-details-modal__label">Статус:</span>
                <span
                  className={`task-details-modal__status-badge ${
                    task.completed
                      ? 'task-details-modal__status-badge--completed'
                      : 'task-details-modal__status-badge--active'
                  }`}
                >
                  {task.completed ? 'Виконано' : 'В процесі'}
                </span>
              </div>

              <div className="task-details-modal__group">
                <span className="task-details-modal__label">Пріоритет:</span>
                <span
                  className={`task-details-modal__priority-badge task-details-modal__priority-badge--${task.priority}`}
                >
                  {task.priority === 'high' ? 'Високий' : task.priority === 'medium' ? 'Середній' : 'Низький'}
                </span>
              </div>

              <div className="task-details-modal__group">
                <span className="task-details-modal__label">Категорія:</span>
                <span className="task-details-modal__value">{task.category}</span>
              </div>

              <div className="task-details-modal__group">
                <span className="task-details-modal__label">ID користувача:</span>
                <span className="task-details-modal__value">{task.userId ?? 1}</span>
              </div>

              <div className="task-details-modal__group task-details-modal__group--block">
                <span className="task-details-modal__label">Опис:</span>
                <p className="task-details-modal__desc">{task.description}</p>
              </div>
            </div>
          )}
        </div>

        <div className="task-details-modal__footer">
          <button type="button" className="task-details-modal__dismiss-btn" onClick={onClose}>
            Закрити
          </button>
        </div>
      </div>
    </div>
  );
};
