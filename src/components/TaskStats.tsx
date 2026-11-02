import React from 'react';
import type { Task } from '../types/task';
import './TaskStats.scss';

interface TaskStatsProps {
  tasks: Task[];
  onClearCompleted?: () => void;
}

export const TaskStats: React.FC<TaskStatsProps> = ({ tasks, onClearCompleted }) => {
  const totalCount = tasks.length;
  const completedCount = tasks.filter((task) => task.completed).length;
  const activeCount = totalCount - completedCount;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <section className="task-stats">
      <div className="task-stats__grid">
        <div className="task-stats__card task-stats__card--total">
          <span className="task-stats__icon">📋</span>
          <div className="task-stats__info">
            <span className="task-stats__label">Загалом завдань</span>
            <span className="task-stats__value">{totalCount}</span>
          </div>
        </div>

        <div className="task-stats__card task-stats__card--active">
          <span className="task-stats__icon">⏳</span>
          <div className="task-stats__info">
            <span className="task-stats__label">В процесі</span>
            <span className="task-stats__value">{activeCount}</span>
          </div>
        </div>

        <div className="task-stats__card task-stats__card--completed">
          <span className="task-stats__icon">✅</span>
          <div className="task-stats__info">
            <span className="task-stats__label">Виконано</span>
            <span className="task-stats__value">{completedCount}</span>
          </div>
        </div>
      </div>

      <div className="task-stats__progress-wrapper">
        <div className="task-stats__progress-header">
          <span className="task-stats__progress-title">Прогрес виконання плану:</span>
          <span className="task-stats__progress-percent">{progressPercent}%</span>
        </div>
        <div className="task-stats__progress-bar">
          <div
            className="task-stats__progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {completedCount > 0 && onClearCompleted && (
        <div className="task-stats__actions">
          <button
            type="button"
            className="task-stats__clear-btn"
            onClick={onClearCompleted}
            title="Видалити всі завершені завдання зі списку"
          >
            🗑️ Очистити виконані ({completedCount})
          </button>
        </div>
      )}
    </section>
  );
};
