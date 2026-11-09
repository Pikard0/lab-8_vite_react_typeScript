import React from 'react';
import './Header.scss';

export const Header: React.FC = () => {
  return (
    <header className="header">
      <div className="header__container">
        <div className="header__brand">
          <h1 className="header__title">Study Planner</h1>
          <span className="header__badge">Лабораторна робота №9</span>
        </div>
        <p className="header__subtitle">
          Список завдань та дедлайнів на семестр
        </p>
      </div>
    </header>
  );
};
