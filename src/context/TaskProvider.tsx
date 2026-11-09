import React, { useReducer, useEffect, useState, useMemo, useCallback } from 'react';
import type { Task, FilterType, PrioritySortOrder, ToastNotification } from '../types/task';
import { initialTasks } from '../data/initialTasks';
import { taskReducer } from './taskReducer';
import { TaskContext } from './TaskContext';
import { useLocalStorage } from '../hooks/useLocalStorage';

const TASKS_STORAGE_KEY = 'study_planner_tasks';

const initTasks = (): Task[] => {
  try {
    const stored = localStorage.getItem(TASKS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed.map((item) => ({ ...item, pendingDelete: false }));
      }
    }
  } catch {
    return initialTasks;
  }
  return initialTasks;
};

const priorityWeight = {
  high: 3,
  medium: 2,
  low: 1,
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, dispatch] = useReducer(taskReducer, [], initTasks);
  const [filter, setFilter] = useLocalStorage<FilterType>('study_planner_filter', 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [prioritySort, setPrioritySort] = useState<PrioritySortOrder>('none');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  useEffect(() => {
    try {
      const activeTasks = tasks.filter((t) => !t.pendingDelete);
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(activeTasks));
    } catch {
      // ignore
    }
  }, [tasks]);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === TASKS_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            dispatch({ type: 'sync', payload: parsed });
          }
        } catch {
          // ignore
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const uncompletedCount = tasks.filter((t) => !t.completed && !t.pendingDelete).length;
    if (uncompletedCount > 0) {
      document.title = `Study Planner (${uncompletedCount} невиконаних)`;
    } else {
      document.title = 'Study Planner (Всі виконано)';
    }
  }, [tasks]);

  useEffect(() => {
    const hasUndoable = toasts.some((t) => t.isUndoable);
    if (!hasUndoable) {
      return;
    }

    const interval = setInterval(() => {
      setToasts((prevToasts) => {
        let hasChanges = false;
        const updated = prevToasts.map((toast) => {
          if (!toast.isUndoable || toast.countdown === undefined) {
            return toast;
          }
          hasChanges = true;
          const next = toast.countdown - 1;
          if (next <= 0) {
            if (toast.taskId !== undefined) {
              dispatch({ type: 'confirmDelete', payload: toast.taskId });
            }
            return {
              ...toast,
              message: 'Завдання остаточно видалено',
              type: 'info' as const,
              isUndoable: false,
              countdown: undefined,
            };
          }
          const baseText = toast.message.split(' буде видалено')[0];
          return {
            ...toast,
            message: `${baseText} буде видалено через ${next} сек`,
            countdown: next,
          };
        });
        return hasChanges ? updated : prevToasts;
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [toasts]);

  useEffect(() => {
    const autoDismissable = toasts.filter((t) => !t.isUndoable);
    if (autoDismissable.length === 0) {
      return;
    }

    const timers = autoDismissable.map((toast) =>
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 3000)
    );

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
    };
  }, [toasts]);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addTask = useCallback((data: Omit<Task, 'id' | 'completed' | 'pendingDelete'>) => {
    dispatch({ type: 'add', payload: data });
    const newToast: ToastNotification = {
      id: `add_${Date.now()}`,
      message: 'Нове завдання успішно додано',
      type: 'success',
      isUndoable: false,
    };
    setToasts((prev) => [...prev, newToast]);
  }, []);

  const toggleTask = useCallback((id: number) => {
    dispatch({ type: 'toggle', payload: id });
  }, []);

  const updateTask = useCallback((id: number, data: Omit<Task, 'id' | 'pendingDelete'>) => {
    dispatch({ type: 'update', payload: { id, data } });
    setEditingTask(null);
    const newToast: ToastNotification = {
      id: `update_${Date.now()}`,
      message: 'Завдання успішно оновлено',
      type: 'success',
      isUndoable: false,
    };
    setToasts((prev) => [...prev, newToast]);
  }, []);

  const requestDeleteTask = useCallback((id: number) => {
    const taskToDelete = tasks.find((t) => t.id === id);
    const title = taskToDelete ? taskToDelete.title : '';

    dispatch({ type: 'requestDelete', payload: id });

    const newToast: ToastNotification = {
      id: `delete_${id}_${Date.now()}`,
      taskId: id,
      message: title ? `"${title}" буде видалено через 5 сек` : 'Завдання буде видалено через 5 сек',
      type: 'warning',
      isUndoable: true,
      countdown: 5,
    };

    setToasts((prev) => [...prev.filter((t) => t.taskId !== id), newToast]);
  }, [tasks]);

  const confirmDeleteTask = useCallback((id: number) => {
    dispatch({ type: 'confirmDelete', payload: id });
    setToasts((prev) => prev.filter((t) => t.taskId !== id));
  }, []);

  const undoDeleteTask = useCallback((taskId: number) => {
    dispatch({ type: 'undoDelete', payload: taskId });
    setToasts((prev) => [
      ...prev.filter((t) => t.taskId !== taskId),
      {
        id: `undo_${Date.now()}`,
        message: 'Видалення завдання скасовано',
        type: 'info',
        isUndoable: false,
      },
    ]);
  }, []);

  const clearCompletedTasks = useCallback(() => {
    dispatch({ type: 'clearCompleted' });
    const newToast: ToastNotification = {
      id: `clear_${Date.now()}`,
      message: 'Виконані завдання видалено',
      type: 'info',
      isUndoable: false,
    };
    setToasts((prev) => [...prev, newToast]);
  }, []);

  const resetTasks = useCallback(() => {
    dispatch({ type: 'reset' });
    setEditingTask(null);
    setToasts([
      {
        id: `reset_${Date.now()}`,
        message: 'Дані скинуто до початкових',
        type: 'info',
        isUndoable: false,
      },
    ]);
  }, []);

  const counts = useMemo(() => {
    const validTasks = tasks.filter((t) => !t.pendingDelete);
    const all = validTasks.length;
    const completed = validTasks.filter((t) => t.completed).length;
    const active = all - completed;
    return { all, completed, active };
  }, [tasks]);

  const displayedTasks = useMemo(() => {
    let result = [...tasks];

    if (filter === 'completed') {
      result = result.filter((task) => task.completed);
    } else if (filter === 'active') {
      result = result.filter((task) => !task.completed);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query) ||
          task.category.toLowerCase().includes(query)
      );
    }

    if (prioritySort === 'desc') {
      result.sort((a, b) => priorityWeight[b.priority] - priorityWeight[a.priority]);
    } else if (prioritySort === 'asc') {
      result.sort((a, b) => priorityWeight[a.priority] - priorityWeight[b.priority]);
    }

    return result;
  }, [tasks, filter, searchQuery, prioritySort]);

  const contextValue = useMemo(
    () => ({
      tasks,
      displayedTasks,
      filter,
      setFilter,
      searchQuery,
      setSearchQuery,
      prioritySort,
      setPrioritySort,
      editingTask,
      setEditingTask,
      toasts,
      hideToast,
      addTask,
      toggleTask,
      updateTask,
      requestDeleteTask,
      confirmDeleteTask,
      undoDeleteTask,
      clearCompletedTasks,
      resetTasks,
      counts,
    }),
    [
      tasks,
      displayedTasks,
      filter,
      setFilter,
      searchQuery,
      prioritySort,
      editingTask,
      toasts,
      hideToast,
      addTask,
      toggleTask,
      updateTask,
      requestDeleteTask,
      confirmDeleteTask,
      undoDeleteTask,
      clearCompletedTasks,
      resetTasks,
      counts,
    ]
  );

  return <TaskContext.Provider value={contextValue}>{children}</TaskContext.Provider>;
};
