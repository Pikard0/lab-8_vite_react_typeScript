import React from 'react';
import type { Task } from '../types/task';
import { TaskItem } from './TaskItem';
import './TaskList.scss';

interface TaskListProps {
  tasks: Task[];
  hasAnyTasks: boolean;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  hasAnyTasks,
  onToggle,
  onDelete,
}) => {
  // Умовний рендеринг 1: Якщо взагалі немає завдань
  if (!hasAnyTasks) {
    return (
      <div className="task-list task-list--empty">
        <div className="task-list__empty-state">
          <span className="task-list__empty-icon" role="img" aria-label="empty">
            📝
          </span>
          <h3 className="task-list__empty-title">Завдань поки немає</h3>
          <p className="task-list__empty-desc">
            Додайте перше навчальне завдання за допомогою форми вище.
          </p>
        </div>
      </div>
    );
  }

  // Умовний рендеринг 2: Якщо фільтр або пошук дав порожній результат
  if (tasks.length === 0) {
    return (
      <div className="task-list task-list--empty">
        <div className="task-list__empty-state">
          <span className="task-list__empty-icon" role="img" aria-label="no-results">
            🔍
          </span>
          <h3 className="task-list__empty-title">За цим фільтром завдань немає</h3>
          <p className="task-list__empty-desc">
            Спробуйте змінити категорію, статус фільтра або скинути рядок пошуку.
          </p>
        </div>
      </div>
    );
  }

  // Рендеринг списку за допомогою методу map зі стабільним key={task.id}
  return (
    <div className="task-list">
      <div className="task-list__items">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};
