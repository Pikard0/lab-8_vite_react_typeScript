import React from 'react';
import './Header.scss';

export const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header__container">
        <div className="header__brand">
          <span className="header__icon" role="img" aria-label="planner">
            📚
          </span>
          <h1 className="header__title">Study Planner</h1>
          <span className="header__badge">Лабораторна робота №8</span>
        </div>
        <p className="header__subtitle">
          Простий та ефективний планувальник навчальних завдань
        </p>
      </div>
    </header>
  );
};
