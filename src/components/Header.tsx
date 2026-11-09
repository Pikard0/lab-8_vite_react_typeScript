import React from 'react';
import { useTheme } from '../hooks/useTheme';
import './Header.scss';

export const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="header">
      <div className="header__container">
        <div className="header__top-row">
          <div className="header__brand">
            <h1 className="header__title">Study Planner</h1>
            <span className="header__badge">Лабораторна робота №9</span>
          </div>
          <button
            type="button"
            className="header__theme-btn"
            onClick={toggleTheme}
            aria-label="Перемкнути тему інтерфейсу"
          >
            {theme === 'light' ? 'Темна тема' : 'Світла тема'}
          </button>
        </div>
        <p className="header__subtitle">
          Список завдань та дедлайнів на семестр
        </p>
      </div>
    </header>
  );
};
