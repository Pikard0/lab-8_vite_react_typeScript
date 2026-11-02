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

  if (tasks.length === 0) {
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
