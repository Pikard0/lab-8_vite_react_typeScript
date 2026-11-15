import React from 'react';
import { useTaskContext } from '../hooks/useTaskContext';
import { TaskItem } from './TaskItem';
import { Pagination } from './Pagination';
import './TaskList.scss';

export const TaskList: React.FC = () => {
  const { tasks, displayedTasks, status, error, refetch } = useTaskContext();

  if (status === 'loading') {
    return (
      <div className="task-list task-list--loading">
        <div className="task-list__loading-state">
          <div className="task-list__spinner" aria-hidden="true" />
          <h3 className="task-list__loading-title">Завантаження завдань з API...</h3>
          <p className="task-list__loading-desc">Отримання актуальних даних з віддаленого сервера</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="task-list task-list--error">
        <div className="task-list__error-state">
          <h3 className="task-list__error-title">Помилка завантаження</h3>
          <p className="task-list__error-desc">
            {error || 'Не вдалося завантажити завдання з API. Перевірте з’єднання.'}
          </p>
          <button type="button" className="task-list__retry-btn" onClick={refetch}>
            Повторити запит
          </button>
        </div>
      </div>
    );
  }

  const hasAnyTasks = tasks.some((t) => !t.pendingDelete);

  if (!hasAnyTasks) {
    return (
      <div className="task-list task-list--empty">
        <div className="task-list__empty-state">
          <h3 className="task-list__empty-title">Завдань поки немає</h3>
          <p className="task-list__empty-desc">
            Додайте перше завдання за допомогою форми зверху.
          </p>
        </div>
      </div>
    );
  }

  if (displayedTasks.length === 0) {
    return (
      <div className="task-list task-list--empty">
        <div className="task-list__empty-state">
          <h3 className="task-list__empty-title">За цим фільтром завдань немає</h3>
          <p className="task-list__empty-desc">
            Спробуйте перемкнути фільтр або очистити пошук.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="task-list">
      <div className="task-list__items">
        {displayedTasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
      <Pagination />
    </div>
  );
};
