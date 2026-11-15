import React from 'react';
import { useTaskContext } from '../hooks/useTaskContext';
import './Pagination.scss';

export const Pagination: React.FC = () => {
  const { page, setPage, totalPages, total, status } = useTaskContext();

  if (total === 0) {
    return null;
  }

  const handlePrev = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const isLoading = status === 'loading';

  return (
    <nav className="pagination" aria-label="Пагінація списку завдань">
      <button
        type="button"
        className="pagination__button"
        onClick={handlePrev}
        disabled={page <= 1 || isLoading}
      >
        Попередня
      </button>

      <span className="pagination__info">
        Сторінка {page} з {totalPages} (всього {total})
      </span>

      <button
        type="button"
        className="pagination__button"
        onClick={handleNext}
        disabled={page >= totalPages || isLoading}
      >
        Наступна
      </button>
    </nav>
  );
};
