interface ApiError {
  success: false;
  message?: string;
  errors?: { field: string; message: string }[];
}

interface ApiSuccess<T> {
  success: true;
  message?: string;
  data?: T;
}

type ApiResponse<T> = ApiSuccess<T> | ApiError;

async function request<T>(path: string, options: RequestInit): Promise<ApiResponse<T>> {
  const base = '/api';
  const url = `${base}${path}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw data as ApiError;
  }

  return data as ApiSuccess<T>;
}

export const api = {
  post<T = unknown>(path: string, body: unknown): Promise<ApiResponse<T>> {
    return request<T>(path, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },
};
