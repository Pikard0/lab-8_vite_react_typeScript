import { createContext } from 'react';
import type { Task, FilterType, PrioritySortOrder, ToastNotification } from '../types/task';

export interface TaskContextType {
  tasks: Task[];
  displayedTasks: Task[];
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  prioritySort: PrioritySortOrder;
  setPrioritySort: (sort: PrioritySortOrder) => void;
  editingTask: Task | null;
  setEditingTask: (task: Task | null) => void;
  toast: ToastNotification | null;
  hideToast: () => void;
  addTask: (task: Omit<Task, 'id' | 'completed' | 'pendingDelete'>) => void;
  toggleTask: (id: number) => void;
  updateTask: (id: number, data: Omit<Task, 'id' | 'pendingDelete'>) => void;
  requestDeleteTask: (id: number) => void;
  confirmDeleteTask: (id: number) => void;
  undoDeleteTask: () => void;
  clearCompletedTasks: () => void;
  resetTasks: () => void;
  counts: {
    all: number;
    active: number;
    completed: number;
  };
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);
