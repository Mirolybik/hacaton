import axios, { AxiosError } from 'axios';
import { appConfig } from '../config/app-config';

export interface ApiErrorBody {
  error?: string;
  message?: string;
  details?: unknown;
}

const STATUS_MESSAGES: Record<number, string> = {
  400: 'Некорректный запрос',
  401: 'Требуется авторизация',
  403: 'Недостаточно прав',
  404: 'Ресурс не найден',
  409: 'Конфликт данных',
  422: 'Не удалось обработать данные',
  500: 'Внутренняя ошибка сервера',
  502: 'Бэкенд недоступен',
  503: 'Сервис временно недоступен',
};

/** Единый тип ошибки для всего UI — не тащим AxiosError в компоненты. */
export class ApiError extends Error {
  readonly status?: number;
  readonly code?: string;
  readonly details?: unknown;

  constructor(
    message: string,
    options: { status?: number; code?: string; details?: unknown; cause?: unknown } = {},
  ) {
    super(message, { cause: options.cause });
    this.name = 'ApiError';
    this.status = options.status;
    this.code = options.code;
    this.details = options.details;
  }
}

function normalizeApiError(error: AxiosError<ApiErrorBody>): ApiError {
  if (error.code === AxiosError.ERR_CANCELED) {
    return new ApiError('Запрос отменён', { code: error.code, cause: error });
  }

  if (error.code === AxiosError.ECONNABORTED || error.code === AxiosError.ETIMEDOUT) {
    return new ApiError('Превышено время ожидания ответа API', {
      code: error.code,
      cause: error,
    });
  }

  if (!error.response) {
    return new ApiError('Не удалось связаться с API. Проверьте, что бэкенд запущен.', {
      code: error.code,
      cause: error,
    });
  }

  const { status, data } = error.response;
  const message =
    data?.message ?? STATUS_MESSAGES[status] ?? `Запрос завершился с ошибкой ${status}`;

  return new ApiError(message, {
    status,
    code: data?.error,
    details: data?.details,
    cause: error,
  });
}

export const api = axios.create({
  baseURL: appConfig.apiBaseUrl,
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => Promise.reject(normalizeApiError(error)),
);
