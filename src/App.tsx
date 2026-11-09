import React from 'react';
import { ThemeProvider } from './context/ThemeProvider';
import { TaskProvider } from './context/TaskProvider';
import { Header } from './components/Header';
import { TaskForm } from './components/TaskForm';
import { TaskStats } from './components/TaskStats';
import { TaskFilters } from './components/TaskFilters';
import { TaskList } from './components/TaskList';
import { Toast } from './components/Toast';
import './App.scss';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <TaskProvider>
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
                Study Planner &copy; 2026. React 19, TypeScript, Context API, useReducer, Custom Hooks, SCSS (BEM).
              </p>
            </footer>
          </div>

          <Toast />
        </div>
      </TaskProvider>
    </ThemeProvider>
  );
};

export default App;
