import axios from 'axios';
import { env } from '../config/env';

export const api = axios.create({
  baseURL: env.apiUrl,
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Единая точка для логирования и обработки 401/403.
    return Promise.reject(error);
  },
);
