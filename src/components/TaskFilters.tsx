import React from 'react';
import type { FilterType, PrioritySortOrder } from '../types/task';
import './TaskFilters.scss';

interface TaskFiltersProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  counts: {
    all: number;
    completed: number;
    active: number;
  };
  searchQuery: string;
  onSearchChange: (query: string) => void;
  prioritySort: PrioritySortOrder;
  onPrioritySortChange: (sort: PrioritySortOrder) => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  currentFilter,
  onFilterChange,
  counts,
  searchQuery,
  onSearchChange,
  prioritySort,
  onPrioritySortChange,
}) => {
  return (
    <div className="task-filters">
      <div className="task-filters__controls-row">
        {/* Кнопки вибору фільтрів за статусом */}
        <div className="task-filters__buttons" role="group" aria-label="Фільтри завдань">
          <button
            type="button"
            className={`task-filters__button ${
              currentFilter === 'all' ? 'task-filters__button--active' : ''
            }`}
            onClick={() => onFilterChange('all')}
          >
            Всі
            <span className="task-filters__badge">{counts.all}</span>
          </button>

          <button
            type="button"
            className={`task-filters__button ${
              currentFilter === 'active' ? 'task-filters__button--active' : ''
            }`}
            onClick={() => onFilterChange('active')}
          >
            Не виконані
            <span className="task-filters__badge">{counts.active}</span>
          </button>

          <button
            type="button"
            className={`task-filters__button ${
              currentFilter === 'completed' ? 'task-filters__button--active' : ''
            }`}
            onClick={() => onFilterChange('completed')}
          >
            Виконані
            <span className="task-filters__badge">{counts.completed}</span>
          </button>
        </div>

        {/* Додаткове завдання 2: Сортування за пріоритетом */}
        <div className="task-filters__sort">
          <label htmlFor="priority-sort" className="task-filters__sort-label">
            Сортування:
          </label>
          <select
            id="priority-sort"
            className="task-filters__sort-select"
            value={prioritySort}
            onChange={(e) => onPrioritySortChange(e.target.value as PrioritySortOrder)}
          >
            <option value="none">За замовчуванням</option>
            <option value="desc">Пріоритет: High → Low</option>
            <option value="asc">Пріоритет: Low → High</option>
          </select>
        </div>
      </div>

      {/* Додаткове завдання 1: Пошук завдань за назвою */}
      <div className="task-filters__search-wrapper">
        <span className="task-filters__search-icon" aria-hidden="true">
          🔍
        </span>
        <input
          type="text"
          className="task-filters__search-input"
          placeholder="Пошук завдання..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button
            type="button"
            className="task-filters__search-clear"
            onClick={() => onSearchChange('')}
            aria-label="Очистити пошук"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
};
