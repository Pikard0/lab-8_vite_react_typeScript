import type { Task } from '../types/task';

export const initialTasks: Task[] = [
  {
    id: 1,
    title: 'React Components',
    description: 'Опрацювати базові принципи компонентів React',
    completed: false,
    priority: 'high',
    category: 'React',
  },
  {
    id: 2,
    title: 'TypeScript Exercises',
    description: 'Виконати практичні вправи',
    completed: true,
    priority: 'medium',
    category: 'TypeScript',
  },
  {
    id: 3,
    title: 'Здати лабу №8 з React',
    description: 'Показати роботу компонентів і відповісти на контрольні питання',
    completed: false,
    priority: 'high',
    category: 'React',
  },
  {
    id: 4,
    title: 'Повторити конспект',
    description: 'Розібратися зі станом useState та передачею props',
    completed: true,
    priority: 'low',
    category: 'Навчання',
  },
];
