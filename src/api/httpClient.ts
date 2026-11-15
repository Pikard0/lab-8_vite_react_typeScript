const BASE_URL = import.meta.env.VITE_API_URL || 'https://dummyjson.com';

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number>;
}

export class HttpError extends Error {
  status: number;
  statusText: string;

  constructor(status: number, statusText: string, message: string) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.statusText = statusText;
  }
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, ...fetchOptions } = options;

  let url = `${BASE_URL.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      searchParams.append(key, String(val));
    });
    url += `?${searchParams.toString()}`;
  }

  try {
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      throw new HttpError(
        response.status,
        response.statusText,
        `HTTP Error ${response.status}: ${response.statusText}`
      );
    }

    return (await response.json()) as T;
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw err;
    }
    if (err instanceof HttpError) {
      throw err;
    }
    throw new Error(err instanceof Error ? err.message : 'Unknown network error', { cause: err });
  }
}

export const httpClient = {
  get: <T>(endpoint: string, options: RequestOptions = {}): Promise<T> =>
    request<T>(endpoint, { ...options, method: 'GET' }),

  post: <T>(endpoint: string, data?: unknown, options: RequestOptions = {}): Promise<T> =>
    request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    }),

  put: <T>(endpoint: string, data?: unknown, options: RequestOptions = {}): Promise<T> =>
    request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    }),

  patch: <T>(endpoint: string, data?: unknown, options: RequestOptions = {}): Promise<T> =>
    request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    }),

  delete: <T>(endpoint: string, options: RequestOptions = {}): Promise<T> =>
    request<T>(endpoint, { ...options, method: 'DELETE' }),

  request,
};
