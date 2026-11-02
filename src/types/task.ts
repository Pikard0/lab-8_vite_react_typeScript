export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  category: string;
}

export type FilterType = 'all' | 'completed' | 'active';

export type PrioritySortOrder = 'none' | 'asc' | 'desc';
