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
    title: 'Підготовка до захисту Лабораторної №8',
    description: 'Відповісти на контрольні запитання та підготувати демонстрацію коду',
    completed: false,
    priority: 'high',
    category: 'Навчання',
  },
  {
    id: 4,
    title: 'Огляд Git та Conventional Commits',
    description: 'Ознайомитися з семантичними повідомленнями комітів (feat, fix, refactor)',
    completed: true,
    priority: 'low',
    category: 'Git',
  },
];
