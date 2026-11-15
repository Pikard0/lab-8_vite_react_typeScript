import { createContext } from 'react';
import type { Task, FilterType, PrioritySortOrder, ToastNotification, FetchStatus } from '../types/task';

export interface TaskContextType {
  tasks: Task[];
  displayedTasks: Task[];
  status: FetchStatus;
  error: string | null;
  refetch: () => void;
  page: number;
  setPage: (page: number) => void;
  limit: number;
  total: number;
  totalPages: number;
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  prioritySort: PrioritySortOrder;
  setPrioritySort: (sort: PrioritySortOrder) => void;
  selectedTaskId: number | null;
  setSelectedTaskId: (id: number | null) => void;
  editingTask: Task | null;
  setEditingTask: (task: Task | null) => void;
  toasts: ToastNotification[];
  hideToast: (id: string) => void;
  addTask: (task: Omit<Task, 'id' | 'completed' | 'pendingDelete'>) => Promise<void>;
  toggleTask: (id: number) => Promise<void>;
  updateTask: (id: number, data: Omit<Task, 'id' | 'pendingDelete'>) => Promise<void>;
  requestDeleteTask: (id: number) => void;
  confirmDeleteTask: (id: number) => Promise<void>;
  undoDeleteTask: (taskId: number) => void;
  clearCompletedTasks: () => void;
  resetTasks: () => void;
  counts: {
    all: number;
    active: number;
    completed: number;
  };
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);
