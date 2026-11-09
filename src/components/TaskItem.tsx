import React from 'react';
import type { Priority, Task } from '../types/task';
import { useTaskContext } from '../hooks/useTaskContext';
import './TaskItem.scss';

interface TaskItemProps {
  task: Task;
}

const priorityLabels: Record<Priority, string> = {
  low: 'Низький',
  medium: 'Середній',
  high: 'Високий',
};

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { toggleTask, requestDeleteTask, undoDeleteTask, editingTask, setEditingTask } = useTaskContext();

  const isPending = Boolean(task.pendingDelete);
  const isEditing = editingTask?.id === task.id;

  const handleEditClick = () => {
    setEditingTask(task);
    setTimeout(() => {
      const formEl = document.getElementById('task-form-card');
      formEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const inputEl = document.getElementById('task-title') as HTMLInputElement | null;
      inputEl?.focus();
    }, 50);
  };

  return (
    <article
      className={`task-item ${task.completed ? 'task-item--completed' : ''} ${
        isPending ? 'task-item--pending-delete' : ''
      } ${isEditing ? 'task-item--editing' : ''}`}
      aria-label={`Завдання: ${task.title}`}
    >
      <div className="task-item__main">
        <label
          className="task-item__checkbox-label"
          title={task.completed ? 'Позначити невиконаним' : 'Позначити виконаним'}
        >
          <input
            type="checkbox"
            className="task-item__checkbox"
            checked={task.completed}
            disabled={isPending || isEditing}
            onChange={() => toggleTask(task.id)}
          />
          <span className="task-item__checkbox-custom" />
        </label>

        <div className="task-item__content">
          <div className="task-item__header-row">
            <h3
              className={`task-item__title ${
                task.completed ? 'task-item__title--completed' : ''
              }`}
            >
              {task.title}
            </h3>

            <div className="task-item__badges">
              <span className="task-item__category-badge">{task.category}</span>
              <span
                className={`task-item__priority-badge task-item__priority-badge--${task.priority}`}
              >
                {priorityLabels[task.priority]}
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
            {isPending ? (
              <span className="task-item__status-text task-item__status-text--pending-delete">
                Очікує видалення (5 сек)...
              </span>
            ) : isEditing ? (
              <span className="task-item__status-text task-item__status-text--editing">
                Редагується у формі зверху
              </span>
            ) : (
              <span
                className={`task-item__status-text ${
                  task.completed
                    ? 'task-item__status-text--done'
                    : 'task-item__status-text--pending'
                }`}
              >
                {task.completed ? 'Виконано' : 'В процесі'}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="task-item__actions">
        {isPending ? (
          <button
            type="button"
            className="task-item__undo-inline-btn"
            onClick={() => undoDeleteTask(task.id)}
          >
            Скасувати
          </button>
        ) : (
          <>
            <button
              type="button"
              className={`task-item__edit-btn ${
                isEditing ? 'task-item__edit-btn--active' : ''
              }`}
              onClick={handleEditClick}
              title="Редагувати завдання"
            >
              {isEditing ? 'Редагується' : 'Редагувати'}
            </button>
            <button
              type="button"
              className="task-item__delete-btn"
              onClick={() => requestDeleteTask(task.id)}
              disabled={isEditing}
              title="Видалити завдання"
              aria-label={`Видалити завдання ${task.title}`}
            >
              Видалити
            </button>
          </>
        )}
      </div>
    </article>
  );
};
