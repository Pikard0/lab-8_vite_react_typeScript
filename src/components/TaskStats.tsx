import React from 'react';
import { useTaskContext } from '../hooks/useTaskContext';
import './TaskStats.scss';

export const TaskStats: React.FC = () => {
  const { counts, clearCompletedTasks, resetTasks } = useTaskContext();

  const totalCount = counts.all;
  const completedCount = counts.completed;
  const activeCount = counts.active;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <section className="task-stats">
      <div className="task-stats__grid">
        <div className="task-stats__card task-stats__card--total">
          <div className="task-stats__info">
            <span className="task-stats__label">Загалом завдань</span>
            <span className="task-stats__value">{totalCount}</span>
          </div>
        </div>

        <div className="task-stats__card task-stats__card--active">
          <div className="task-stats__info">
            <span className="task-stats__label">В процесі</span>
            <span className="task-stats__value">{activeCount}</span>
          </div>
        </div>

        <div className="task-stats__card task-stats__card--completed">
          <div className="task-stats__info">
            <span className="task-stats__label">Виконано</span>
            <span className="task-stats__value">{completedCount}</span>
          </div>
        </div>
      </div>

      <div className="task-stats__progress-wrapper">
        <div className="task-stats__progress-header">
          <span className="task-stats__progress-title">Прогрес виконання:</span>
          <span className="task-stats__progress-percent">{progressPercent}%</span>
        </div>
        <div className="task-stats__progress-bar">
          <div
            className="task-stats__progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="task-stats__actions">
        <button
          type="button"
          className="task-stats__reset-btn"
          onClick={resetTasks}
          title="Скинути список завдань до початкових даних"
        >
          Скинути дані
        </button>

        {completedCount > 0 && (
          <button
            type="button"
            className="task-stats__clear-btn"
            onClick={clearCompletedTasks}
            title="Видалити всі завершені завдання зі списку"
          >
            Очистити виконані ({completedCount})
          </button>
        )}
      </div>
    </section>
  );
};
