import React from 'react';
import { useTaskContext } from '../hooks/useTaskContext';
import { TaskItem } from './TaskItem';
import './TaskList.scss';

export const TaskList: React.FC = () => {
  const { tasks, displayedTasks } = useTaskContext();

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
    </div>
  );
};
