import React, { useState, useEffect, useRef } from 'react';
import type { Priority, Task } from '../types/task';
import { useTaskContext } from '../hooks/useTaskContext';
import './TaskForm.scss';

interface FormFieldsProps {
  editingTask: Task | null;
  onSave: (title: string, description: string, category: string, priority: Priority) => void;
  onCancel: () => void;
}

const FormFields: React.FC<FormFieldsProps> = ({ editingTask, onSave, onCancel }) => {
  const [title, setTitle] = useState(editingTask ? editingTask.title : '');
  const [description, setDescription] = useState(editingTask ? editingTask.description : '');
  const [category, setCategory] = useState(editingTask ? editingTask.category : 'React');
  const [priority, setPriority] = useState<Priority>(editingTask ? editingTask.priority : 'medium');
  const [error, setError] = useState('');
  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingTask && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [editingTask]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Введіть назву завдання');
      return;
    }

    onSave(trimmedTitle, description.trim(), category.trim() || 'Інше', priority);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (error) {
      setError('');
    }
  };

  return (
    <section
      id="task-form-card"
      className={`task-form-card ${editingTask ? 'task-form-card--editing' : ''}`}
    >
      <div className="task-form-card__header">
        <h2 className="task-form-card__title">
          {editingTask ? `Редагування завдання: "${editingTask.title}"` : 'Додати завдання'}
        </h2>
        {editingTask && (
          <span className="task-form-card__editing-badge">Режим редагування</span>
        )}
      </div>
      <form className="task-form" onSubmit={handleSubmit} noValidate>
        <div className="task-form__field">
          <label htmlFor="task-title" className="task-form__label">
            Назва завдання <span className="task-form__required">*</span>
          </label>
          <input
            id="task-title"
            ref={titleInputRef}
            type="text"
            className={`task-form__input ${error ? 'task-form__input--error' : ''}`}
            placeholder="Наприклад: Здати лабу з React"
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
            placeholder="Що саме треба зробити..."
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
              placeholder="Предмет (наприклад: React)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
            <datalist id="categories-list">
              <option value="React" />
              <option value="TypeScript" />
              <option value="JavaScript" />
              <option value="HTML & CSS" />
              <option value="Git" />
              <option value="Інше" />
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
              <option value="low">Низький</option>
              <option value="medium">Середній</option>
              <option value="high">Високий</option>
            </select>
          </div>
        </div>

        <div className="task-form__actions">
          {editingTask && (
            <button
              type="button"
              className="task-form__cancel-button"
              onClick={onCancel}
            >
              Скасувати
            </button>
          )}
          <button type="submit" className="task-form__submit-button">
            {editingTask ? 'Зберегти зміни' : 'Додати завдання'}
          </button>
        </div>
      </form>
    </section>
  );
};

export const TaskForm: React.FC = () => {
  const { addTask, updateTask, editingTask, setEditingTask } = useTaskContext();

  const handleSave = (title: string, description: string, category: string, priority: Priority) => {
    if (editingTask) {
      updateTask(editingTask.id, {
        title,
        description,
        category,
        priority,
        completed: editingTask.completed,
      });
    } else {
      addTask({
        title,
        description,
        category,
        priority,
      });
    }
  };

  const handleCancel = () => {
    setEditingTask(null);
  };

  return (
    <FormFields
      key={editingTask ? editingTask.id : 'create'}
      editingTask={editingTask}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
};
