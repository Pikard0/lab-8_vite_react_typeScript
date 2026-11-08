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

  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);
  const [toast, setToast] = useState<ToastNotification | null>(null);

  useEffect(() => {
    try {
      const activeTasks = tasks.filter((t) => !t.pendingDelete);
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(activeTasks));
    } catch {
      // ignore
    }
  }, [tasks]);

  useEffect(() => {
    const uncompletedCount = tasks.filter((t) => !t.completed && !t.pendingDelete).length;
    if (uncompletedCount > 0) {
      document.title = `Study Planner (${uncompletedCount} невиконаних)`;
    } else {
      document.title = 'Study Planner (Всі виконано)';
    }
  }, [tasks]);

  useEffect(() => {
    if (pendingDeleteId === null) {
      return;
    }

    const interval = setInterval(() => {
      setToast((currentToast) => {
        if (!currentToast || !currentToast.isUndoable) {
          return currentToast;
        }
        const currentCount = currentToast.countdown ?? 5;
        const next = currentCount - 1;

        if (next <= 0) {
          clearInterval(interval);
          dispatch({ type: 'confirmDelete', payload: pendingDeleteId });
          setPendingDeleteId(null);
          return {
            id: String(Date.now()),
            message: 'Завдання остаточно видалено',
            type: 'info',
            isUndoable: false,
          };
        }

        return {
          ...currentToast,
          message: `Завдання буде видалено через ${next} сек`,
          countdown: next,
        };
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [pendingDeleteId]);

  useEffect(() => {
    if (!toast || toast.isUndoable) {
      return;
    }
    const timer = setTimeout(() => {
      setToast(null);
    }, 3500);

    return () => {
      clearTimeout(timer);
    };
  }, [toast]);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  const addTask = useCallback((data: Omit<Task, 'id' | 'completed' | 'pendingDelete'>) => {
    dispatch({ type: 'add', payload: data });
    setToast({
      id: String(Date.now()),
      message: 'Нове завдання успішно додано',
      type: 'success',
      isUndoable: false,
    });
  }, []);

  const toggleTask = useCallback((id: number) => {
    dispatch({ type: 'toggle', payload: id });
  }, []);

  const updateTask = useCallback((id: number, data: Omit<Task, 'id' | 'pendingDelete'>) => {
    dispatch({ type: 'update', payload: { id, data } });
    setEditingTask(null);
    setToast({
      id: String(Date.now()),
      message: 'Завдання успішно оновлено',
      type: 'success',
      isUndoable: false,
    });
  }, []);

  const requestDeleteTask = useCallback((id: number) => {
    if (pendingDeleteId !== null) {
      dispatch({ type: 'confirmDelete', payload: pendingDeleteId });
    }
    dispatch({ type: 'requestDelete', payload: id });
    setPendingDeleteId(id);
    setToast({
      id: String(Date.now()),
      message: 'Завдання буде видалено через 5 сек',
      type: 'warning',
      isUndoable: true,
      countdown: 5,
    });
  }, [pendingDeleteId]);

  const confirmDeleteTask = useCallback((id: number) => {
    dispatch({ type: 'confirmDelete', payload: id });
    if (pendingDeleteId === id) {
      setPendingDeleteId(null);
      setToast(null);
    }
  }, [pendingDeleteId]);

  const undoDeleteTask = useCallback(() => {
    if (pendingDeleteId !== null) {
      dispatch({ type: 'undoDelete', payload: pendingDeleteId });
      setPendingDeleteId(null);
      setToast({
        id: String(Date.now()),
        message: 'Видалення завдання скасовано',
        type: 'info',
        isUndoable: false,
      });
    }
  }, [pendingDeleteId]);

  const clearCompletedTasks = useCallback(() => {
    dispatch({ type: 'clearCompleted' });
    setToast({
      id: String(Date.now()),
      message: 'Виконані завдання видалено',
      type: 'info',
      isUndoable: false,
    });
  }, []);

  const resetTasks = useCallback(() => {
    if (pendingDeleteId !== null) {
      setPendingDeleteId(null);
    }
    dispatch({ type: 'reset' });
    setEditingTask(null);
    setToast({
      id: String(Date.now()),
      message: 'Дані скинуто до початкових',
      type: 'info',
      isUndoable: false,
    });
  }, [pendingDeleteId]);

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
      toast,
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
      toast,
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
