import { httpClient } from '../api/httpClient';
import type { Task, TodoDto, TodosResponseDto, Priority } from '../types/task';

export interface GetAllParams {
  limit?: number;
  skip?: number;
  signal?: AbortSignal;
}

export interface GetAllResult {
  tasks: Task[];
  total: number;
  limit: number;
  skip: number;
}

interface TaskMetadata {
  description: string;
  priority: Priority;
  category: string;
}

const METADATA_STORAGE_KEY = 'study_planner_task_metadata';

const loadMetadataMap = (): Record<number, TaskMetadata> => {
  try {
    const raw = localStorage.getItem(METADATA_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveMetadata = (id: number, meta: TaskMetadata): void => {
  try {
    const map = loadMetadataMap();
    map[id] = meta;
    localStorage.setItem(METADATA_STORAGE_KEY, JSON.stringify(map));
  } catch {
    void 0;
  }
};

const deleteMetadata = (id: number): void => {
  try {
    const map = loadMetadataMap();
    delete map[id];
    localStorage.setItem(METADATA_STORAGE_KEY, JSON.stringify(map));
  } catch {
    void 0;
  }
};

const mapDtoToTask = (dto: TodoDto): Task => {
  const map = loadMetadataMap();
  const meta = map[dto.id];

  return {
    id: dto.id,
    title: dto.todo,
    completed: dto.completed,
    userId: dto.userId,
    description: meta?.description ?? 'Опис відсутній у віддаленому API',
    priority: meta?.priority ?? 'medium',
    category: meta?.category ?? 'Загальне',
    pendingDelete: false,
  };
};

export const taskRepository = {
  async getAll(params: GetAllParams = {}): Promise<GetAllResult> {
    const { limit = 0, skip = 0, signal } = params;

    const queryParams: Record<string, string | number> = { limit };
    if (skip > 0) {
      queryParams.skip = skip;
    }

    const response = await httpClient.get<TodosResponseDto>('/todos', {
      params: queryParams,
      signal,
    });

    return {
      tasks: response.todos.map(mapDtoToTask),
      total: response.total,
      limit: response.limit,
      skip: response.skip,
    };
  },

  async getById(id: number, signal?: AbortSignal): Promise<Task> {
    const dto = await httpClient.get<TodoDto>(`/todos/${id}`, { signal });
    return mapDtoToTask(dto);
  },

  async create(data: Omit<Task, 'id' | 'pendingDelete' | 'completed'> & { completed?: boolean }): Promise<Task> {
    const payload = {
      todo: data.title,
      completed: data.completed ?? false,
      userId: data.userId ?? 1,
    };

    const dto = await httpClient.post<TodoDto>('/todos/add', payload);

    const clientMeta: TaskMetadata = {
      description: data.description,
      priority: data.priority,
      category: data.category,
    };
    saveMetadata(dto.id, clientMeta);

    return {
      id: dto.id,
      title: dto.todo,
      completed: dto.completed,
      userId: dto.userId,
      description: data.description,
      priority: data.priority,
      category: data.category,
      pendingDelete: false,
    };
  },

  async update(id: number, updates: Partial<Omit<Task, 'id' | 'pendingDelete'>>): Promise<Task> {
    const payload: Record<string, unknown> = {};

    if (updates.title !== undefined) {
      payload.todo = updates.title;
    }
    if (updates.completed !== undefined) {
      payload.completed = updates.completed;
    }

    let dto: TodoDto;
    try {
      dto = await httpClient.patch<TodoDto>(`/todos/${id}`, payload);
    } catch {
      dto = {
        id,
        todo: updates.title || '',
        completed: updates.completed ?? false,
        userId: 1,
      };
    }

    const currentMap = loadMetadataMap();
    const existingMeta = currentMap[id];
    const newMeta: TaskMetadata = {
      description: updates.description !== undefined ? updates.description : (existingMeta?.description ?? ''),
      priority: updates.priority !== undefined ? updates.priority : (existingMeta?.priority ?? 'medium'),
      category: updates.category !== undefined ? updates.category : (existingMeta?.category ?? 'Загальне'),
    };
    saveMetadata(id, newMeta);

    return {
      id,
      title: dto.todo || updates.title || '',
      completed: dto.completed !== undefined ? dto.completed : (updates.completed ?? false),
      userId: dto.userId || 1,
      description: newMeta.description,
      priority: newMeta.priority,
      category: newMeta.category,
      pendingDelete: false,
    };
  },

  async delete(id: number): Promise<void> {
    await httpClient.delete<unknown>(`/todos/${id}`);
    deleteMetadata(id);
  },
};
