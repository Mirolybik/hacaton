const apiUrl = import.meta.env.VITE_API_URL?.trim() || '/api';

export const env = {
  apiUrl,
} as const;
