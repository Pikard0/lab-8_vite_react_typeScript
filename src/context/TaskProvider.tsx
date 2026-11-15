import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import type { Task, FilterType, PrioritySortOrder, ToastNotification, FetchStatus } from '../types/task';
import { TaskContext } from './TaskContext';
import { taskRepository } from '../repositories/taskRepository';
import { useLocalStorage } from '../hooks/useLocalStorage';

const priorityWeight = {
  high: 3,
  medium: 2,
  low: 1,
};

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [status, setStatus] = useState<FetchStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState<number>(1);
  const limit = 10;

  const [filter, setFilter] = useLocalStorage<FilterType>('study_planner_filter', 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [prioritySort, setPrioritySort] = useState<PrioritySortOrder>('none');
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const abortControllerRef = useRef<AbortController | null>(null);

  const refetch = useCallback(() => {
    setReloadTrigger((prev) => prev + 1);
  }, []);

  const handleSetFilter = useCallback(
    (newFilter: FilterType) => {
      setFilter(newFilter);
      setPage(1);
    },
    [setFilter]
  );

  const handleSetSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(1);
  }, []);

  const handleSetPrioritySort = useCallback((sort: PrioritySortOrder) => {
    setPrioritySort(sort);
    setPage(1);
  }, []);

  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setStatus('loading');
    setError(null);

    taskRepository
      .getAll({ limit: 0, signal: controller.signal })
      .then((res) => {
        setTasks(res.tasks);
        setStatus('success');
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name === 'AbortError') {
          return;
        }
        setError(err instanceof Error ? err.message : 'Не вдалося завантажити дані з API');
        setStatus('error');
      });

    return () => {
      controller.abort();
    };
  }, [reloadTrigger]);

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
              const taskIdToDelete = toast.taskId;
              taskRepository.delete(taskIdToDelete).catch(() => {});
              setTasks((prev) => prev.filter((t) => t.id !== taskIdToDelete));
            }
            return null;
          }
          return { ...toast, countdown: next };
        });

        if (hasChanges) {
          return updated.filter((t): t is ToastNotification => t !== null);
        }
        return prevToasts;
      });
    }, 1000);

    return () => clearInterval(interval);
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

  const addTask = useCallback(
    async (data: Omit<Task, 'id' | 'completed' | 'pendingDelete'>) => {
      try {
        const created = await taskRepository.create(data);
        setTasks((prev) => [created, ...prev]);
        setPage(1);

        setToasts((prev) => [
          ...prev,
          {
            id: `add_${Date.now()}`,
            message: 'Нове завдання успішно створено в API',
            type: 'success',
            isUndoable: false,
          },
        ]);
      } catch (err: unknown) {
        setToasts((prev) => [
          ...prev,
          {
            id: `add_err_${Date.now()}`,
            message: err instanceof Error ? err.message : 'Помилка створення завдання',
            type: 'error',
            isUndoable: false,
          },
        ]);
      }
    },
    []
  );

  const toggleTask = useCallback(
    async (id: number) => {
      const target = tasks.find((t) => t.id === id);
      if (!target) {
        return;
      }

      const nextCompleted = !target.completed;
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, completed: nextCompleted } : task))
      );

      try {
        await taskRepository.update(id, {
          title: target.title,
          description: target.description,
          category: target.category,
          priority: target.priority,
          completed: nextCompleted,
          userId: target.userId,
        });

        setToasts((prev) => [
          ...prev,
          {
            id: `toggle_${Date.now()}`,
            message: nextCompleted
              ? 'Завдання позначено як виконане в API'
              : 'Завдання повернено в активні в API',
            type: 'info',
            isUndoable: false,
          },
        ]);
      } catch (err: unknown) {
        setTasks((prev) =>
          prev.map((task) => (task.id === id ? { ...task, completed: target.completed } : task))
        );

        setToasts((prev) => [
          ...prev,
          {
            id: `toggle_err_${Date.now()}`,
            message: err instanceof Error ? err.message : 'Помилка оновлення статусу в API',
            type: 'error',
            isUndoable: false,
          },
        ]);
      }
    },
    [tasks]
  );

  const updateTask = useCallback(
    async (id: number, data: Omit<Task, 'id' | 'pendingDelete'>) => {
      try {
        const updated = await taskRepository.update(id, data);
        setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
        setEditingTask(null);

        setToasts((prev) => [
          ...prev,
          {
            id: `update_${Date.now()}`,
            message: 'Зміни завдання успішно збережено в API',
            type: 'success',
            isUndoable: false,
          },
        ]);
      } catch (err: unknown) {
        setToasts((prev) => [
          ...prev,
          {
            id: `update_err_${Date.now()}`,
            message: err instanceof Error ? err.message : 'Помилка оновлення завдання',
            type: 'error',
            isUndoable: false,
          },
        ]);
      }
    },
    []
  );

  const requestDeleteTask = useCallback(
    (id: number) => {
      const taskToDelete = tasks.find((t) => t.id === id);
      if (!taskToDelete) {
        return;
      }

      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, pendingDelete: true } : t))
      );

      setToasts((prev) => [
        ...prev.filter((t) => t.taskId !== id),
        {
          id: `delete_${id}_${Date.now()}`,
          taskId: id,
          message: `Завдання "${taskToDelete.title}" буде видалено через 5 сек...`,
          type: 'warning',
          isUndoable: true,
          countdown: 5,
        },
      ]);
    },
    [tasks]
  );

  const confirmDeleteTask = useCallback(async (id: number) => {
    try {
      await taskRepository.delete(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
      setToasts((prev) => prev.filter((t) => t.taskId !== id));
    } catch {
      setTasks((prev) => prev.filter((task) => task.id !== id));
      setToasts((prev) => prev.filter((t) => t.taskId !== id));
    }
  }, []);

  const undoDeleteTask = useCallback((taskId: number) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, pendingDelete: false } : t))
    );
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

  const counts = useMemo(() => {
    const validTasks = tasks.filter((t) => !t.pendingDelete);
    const all = validTasks.length;
    const completed = validTasks.filter((t) => t.completed).length;
    const active = all - completed;
    return { all, completed, active };
  }, [tasks]);

  const clearCompletedTasks = useCallback(() => {
    setTasks((prev) => prev.filter((task) => !task.completed));
    setToasts((prev) => [
      ...prev,
      {
        id: `clear_${Date.now()}`,
        message: 'Виконані завдання видалено з поточного списку',
        type: 'info',
        isUndoable: false,
      },
    ]);
  }, []);

  const resetTasks = useCallback(() => {
    setPage(1);
    refetch();
  }, [refetch]);

  const filteredTasks = useMemo(() => {
    let result = tasks.filter((t) => !t.pendingDelete);

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

  const total = filteredTasks.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(Math.max(1, page), totalPages);

  const displayedTasks = useMemo(() => {
    const start = (safePage - 1) * limit;
    return filteredTasks.slice(start, start + limit);
  }, [filteredTasks, safePage, limit]);

  const contextValue = useMemo(
    () => ({
      tasks,
      displayedTasks,
      status,
      error,
      refetch,
      page: safePage,
      setPage,
      limit,
      total,
      totalPages,
      filter,
      setFilter: handleSetFilter,
      searchQuery,
      setSearchQuery: handleSetSearchQuery,
      prioritySort,
      setPrioritySort: handleSetPrioritySort,
      selectedTaskId,
      setSelectedTaskId,
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
      status,
      error,
      refetch,
      safePage,
      limit,
      total,
      totalPages,
      filter,
      handleSetFilter,
      searchQuery,
      handleSetSearchQuery,
      prioritySort,
      handleSetPrioritySort,
      selectedTaskId,
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
