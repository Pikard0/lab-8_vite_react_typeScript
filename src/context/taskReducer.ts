import type { Task, TaskAction } from '../types/task';
import { initialTasks } from '../data/initialTasks';

export const taskReducer = (state: Task[], action: TaskAction): Task[] => {
  switch (action.type) {
    case 'add': {
      const newTask: Task = {
        ...action.payload,
        id: Date.now(),
        completed: false,
        pendingDelete: false,
      };
      return [newTask, ...state];
    }

    case 'toggle': {
      return state.map((task) =>
        task.id === action.payload
          ? { ...task, completed: !task.completed }
          : task
      );
    }

    case 'update': {
      return state.map((task) =>
        task.id === action.payload.id
          ? { ...task, ...action.payload.data }
          : task
      );
    }

    case 'requestDelete': {
      return state.map((task) =>
        task.id === action.payload
          ? { ...task, pendingDelete: true }
          : task
      );
    }

    case 'confirmDelete': {
      return state.filter((task) => task.id !== action.payload);
    }

    case 'undoDelete': {
      return state.map((task) =>
        task.id === action.payload
          ? { ...task, pendingDelete: false }
          : task
      );
    }

    case 'clearCompleted': {
      return state.filter((task) => !task.completed);
    }

    case 'reset': {
      return initialTasks.map((task) => ({ ...task, pendingDelete: false }));
    }

    case 'sync': {
      return action.payload;
    }

    default:
      return state;
  }
};
