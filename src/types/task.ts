export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  category: string;
  pendingDelete?: boolean;
}

export type FilterType = 'all' | 'completed' | 'active';

export type PrioritySortOrder = 'none' | 'asc' | 'desc';

export type TaskAction =
  | { type: 'add'; payload: Omit<Task, 'id' | 'completed' | 'pendingDelete'> }
  | { type: 'toggle'; payload: number }
  | { type: 'update'; payload: { id: number; data: Omit<Task, 'id' | 'pendingDelete'> } }
  | { type: 'requestDelete'; payload: number }
  | { type: 'confirmDelete'; payload: number }
  | { type: 'undoDelete'; payload: number }
  | { type: 'clearCompleted' }
  | { type: 'reset' }
  | { type: 'sync'; payload: Task[] };

export interface ToastNotification {
  id: string;
  taskId?: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isUndoable?: boolean;
  countdown?: number;
}
