import React from 'react';
import type { Priority, Task } from '../types/task';
import './TaskItem.scss';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const priorityLabels: Record<Priority, string> = {
  low: 'Низький',
  medium: 'Середній',
  high: 'Високий',
};

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  return (
    <article
      className={`task-item ${task.completed ? 'task-item--completed' : ''}`}
      aria-label={`Завдання: ${task.title}`}
    >
      <div className="task-item__main">
        {/* Чекбокс перемикання стану */}
        <label className="task-item__checkbox-label" title={task.completed ? 'Позначити невиконаним' : 'Позначити виконаним'}>
          <input
            type="checkbox"
            className="task-item__checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
          />
          <span className="task-item__checkbox-custom" />
        </label>

        {/* Контент завдання */}
        <div className="task-item__content">
          <div className="task-item__header-row">
            <h3
              className={`task-item__title ${
                task.completed ? 'task-item__title--completed' : ''
              }`}
            >
              {task.title}
            </h3>

            {/* Бейджі метаданих */}
            <div className="task-item__badges">
              <span className="task-item__category-badge">{task.category}</span>
              <span
                className={`task-item__priority-badge task-item__priority-badge--${task.priority}`}
              >
                ● {priorityLabels[task.priority]}
              </span>
            </div>
          </div>

          {task.description && (
            <p
              className={`task-item__description ${
                task.completed ? 'task-item__description--completed' : ''
              }`}
            >
              {task.description}
            </p>
          )}

          <div className="task-item__status-info">
            <span
              className={`task-item__status-text ${
                task.completed
                  ? 'task-item__status-text--done'
                  : 'task-item__status-text--pending'
              }`}
            >
              {task.completed ? '✓ Виконано' : '⏳ Потрібно зробити'}
            </span>
          </div>
        </div>
      </div>

      {/* Кнопка видалення */}
      <div className="task-item__actions">
        <button
          type="button"
          className="task-item__delete-btn"
          onClick={() => onDelete(task.id)}
          title="Видалити завдання"
          aria-label={`Видалити завдання ${task.title}`}
        >
          🗑️
        </button>
      </div>
    </article>
  );
};
