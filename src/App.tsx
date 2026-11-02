import React, { useState, useMemo } from 'react';
import type { Task, FilterType, PrioritySortOrder, Priority } from './types/task';
import { initialTasks } from './data/initialTasks';
import { Header } from './components/Header';
import { TaskForm } from './components/TaskForm';
import { TaskStats } from './components/TaskStats';
import { TaskFilters } from './components/TaskFilters';
import { TaskList } from './components/TaskList';
import './App.scss';

const priorityWeight: Record<Priority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

export const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [prioritySort, setPrioritySort] = useState<PrioritySortOrder>('none');

  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'completed'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: Date.now(),
      completed: false,
    };

    setTasks((prevTasks) => [newTask, ...prevTasks]);
  };

  const handleToggleTask = (id: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleDeleteTask = (id: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const handleClearCompleted = () => {
    setTasks((prevTasks) => prevTasks.filter((task) => !task.completed));
  };

  const filterCounts = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const active = total - completed;
    return { all: total, completed, active };
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

  return (
    <div className="study-planner">
      <div className="study-planner__container">
        <Header />

        <main className="study-planner__content">
          <TaskForm onAddTask={handleAddTask} />

          <TaskStats
            tasks={tasks}
            onClearCompleted={handleClearCompleted}
          />

          <TaskFilters
            currentFilter={filter}
            onFilterChange={setFilter}
            counts={filterCounts}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            prioritySort={prioritySort}
            onPrioritySortChange={setPrioritySort}
          />

          <TaskList
            tasks={displayedTasks}
            hasAnyTasks={tasks.length > 0}
            onToggle={handleToggleTask}
            onDelete={handleDeleteTask}
          />
        </main>

        <footer className="study-planner__footer">
          <p>
            Study Planner &copy; 2026. React 19, TypeScript, SCSS (BEM).
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
