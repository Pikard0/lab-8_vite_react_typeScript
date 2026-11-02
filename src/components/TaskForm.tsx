import React, { useState } from 'react';
import type { Priority, Task } from '../types/task';
import './TaskForm.scss';

interface TaskFormProps {
  onAddTask: (task: Omit<Task, 'id' | 'completed'>) => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('React');
  const [priority, setPriority] = useState<Priority>('medium');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Назва завдання є обов’язковою для заповнення!');
      return;
    }

    onAddTask({
      title: trimmedTitle,
      description: description.trim(),
      category: category.trim() || 'Загальне',
      priority,
    });

    // Очищення форми після успішного додавання
    setTitle('');
    setDescription('');
    setCategory('React');
    setPriority('medium');
    setError('');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (error) {
      setError('');
    }
  };

  return (
    <section className="task-form-card">
      <h2 className="task-form-card__title">➕ Додати нове навчальне завдання</h2>
      <form className="task-form" onSubmit={handleSubmit} noValidate>
        <div className="task-form__field">
          <label htmlFor="task-title" className="task-form__label">
            Назва завдання <span className="task-form__required">*</span>
          </label>
          <input
            id="task-title"
            type="text"
            className={`task-form__input ${error ? 'task-form__input--error' : ''}`}
            placeholder="Наприклад: Опрацювати React Props & State"
            value={title}
            onChange={handleTitleChange}
          />
          {error && <p className="task-form__error-message">{error}</p>}
        </div>

        <div className="task-form__field">
          <label htmlFor="task-description" className="task-form__label">
            Короткий опис
          </label>
          <textarea
            id="task-description"
            className="task-form__textarea"
            placeholder="Опишіть завдання, кроки виконання або посилання..."
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="task-form__row">
          <div className="task-form__field task-form__field--half">
            <label htmlFor="task-category" className="task-form__label">
              Категорія
            </label>
            <input
              id="task-category"
              type="text"
              list="categories-list"
              className="task-form__input"
              placeholder="Виберіть або введіть категорію"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <datalist id="categories-list">
              <option value="React" />
              <option value="TypeScript" />
              <option value="JavaScript" />
              <option value="HTML & CSS" />
              <option value="Git" />
              <option value="Навчання" />
            </datalist>
          </div>

          <div className="task-form__field task-form__field--half">
            <label htmlFor="task-priority" className="task-form__label">
              Пріоритет
            </label>
            <select
              id="task-priority"
              className="task-form__select"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
            >
              <option value="low">Низький (Low)</option>
              <option value="medium">Середній (Medium)</option>
              <option value="high">Високий (High)</option>
            </select>
          </div>
        </div>

        <div className="task-form__actions">
          <button type="submit" className="task-form__submit-button">
            Додати завдання
          </button>
        </div>
      </form>
    </section>
  );
};
