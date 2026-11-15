import React from 'react';
import { TaskProvider } from './context/TaskProvider';
import { useTaskContext } from './hooks/useTaskContext';
import { Header } from './components/Header';
import { TaskForm } from './components/TaskForm';
import { TaskStats } from './components/TaskStats';
import { TaskFilters } from './components/TaskFilters';
import { TaskList } from './components/TaskList';
import { Toast } from './components/Toast';
import { TaskDetails } from './components/TaskDetails';
import './App.scss';

const StudyPlannerContent: React.FC = () => {
  const { selectedTaskId, setSelectedTaskId } = useTaskContext();

  return (
    <div className="study-planner">
      <div className="study-planner__container">
        <Header />

        <main className="study-planner__content">
          <TaskForm />
          <TaskStats />
          <TaskFilters />
          <TaskList />
        </main>

        <footer className="study-planner__footer">
          <p>
            Study Planner &copy; 2026. React 19, TypeScript, REST API, Repository Pattern, Context API, useReducer, Custom Hooks, SCSS (BEM).
          </p>
        </footer>
      </div>

      <Toast />
      {selectedTaskId !== null && (
        <TaskDetails taskId={selectedTaskId} onClose={() => setSelectedTaskId(null)} />
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <TaskProvider>
      <StudyPlannerContent />
    </TaskProvider>
  );
};

export default App;
