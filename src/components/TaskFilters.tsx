import React from 'react';
import type { PrioritySortOrder } from '../types/task';
import { useTaskContext } from '../hooks/useTaskContext';
import './TaskFilters.scss';

export const TaskFilters: React.FC = () => {
  const {
    filter,
    setFilter,
    counts,
    searchQuery,
    setSearchQuery,
    prioritySort,
    setPrioritySort,
  } = useTaskContext();

  return (
    <div className="task-filters">
      <div className="task-filters__controls-row">
        <div className="task-filters__buttons" role="group" aria-label="Фільтри завдань">
          <button
            type="button"
            className={`task-filters__button ${
              filter === 'all' ? 'task-filters__button--active' : ''
            }`}
            onClick={() => setFilter('all')}
          >
            Всі
            <span className="task-filters__badge">{counts.all}</span>
          </button>

          <button
            type="button"
            className={`task-filters__button ${
              filter === 'active' ? 'task-filters__button--active' : ''
            }`}
            onClick={() => setFilter('active')}
          >
            Не виконані
            <span className="task-filters__badge">{counts.active}</span>
          </button>

          <button
            type="button"
            className={`task-filters__button ${
              filter === 'completed' ? 'task-filters__button--active' : ''
            }`}
            onClick={() => setFilter('completed')}
          >
            Виконані
            <span className="task-filters__badge">{counts.completed}</span>
          </button>
        </div>

        <div className="task-filters__sort">
          <label htmlFor="priority-sort" className="task-filters__sort-label">
            Сортування:
          </label>
          <select
            id="priority-sort"
            className="task-filters__sort-select"
            value={prioritySort}
            onChange={(e) => setPrioritySort(e.target.value as PrioritySortOrder)}
          >
            <option value="none">За замовчуванням</option>
            <option value="desc">Пріоритет: High → Low</option>
            <option value="asc">Пріоритет: Low → High</option>
          </select>
        </div>
      </div>

      <div className="task-filters__search-wrapper">
        <input
          type="text"
          className="task-filters__search-input"
          placeholder="Пошук завдання..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            type="button"
            className="task-filters__search-clear"
            onClick={() => setSearchQuery('')}
            aria-label="Очистити пошук"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};
