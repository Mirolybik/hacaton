# Hacaton UI

Простой каркас фронтенда: React 19 + TypeScript + Vite + Chakra UI + Axios.

## Запуск

Из корня проекта:

```bash
# 1. Запустить бэкенд (порт 3000)
npm run dev

# 2. В другом терминале — фронтенд (порт 5173)
npm run ui:dev
```

Откройте http://localhost:5173. Запросы на `/api` проксируются на `http://localhost:3000`,
поэтому в dev-режиме CORS не требуется.

При первом запуске (если ещё не установлены зависимости фронтенда):

```bash
npm run ui:install
```

## Настройки

Скопируйте `frontend/.env.example` в `frontend/.env` и при необходимости измените:

| Переменная | По умолчанию | Назначение |
| --- | --- | --- |
| `VITE_APP_NAME` | `Hacaton UI` | Название приложения |
| `VITE_API_BASE_URL` | `/api` | Базовый URL API для Axios |
| `VITE_API_PROXY_TARGET` | `http://localhost:3000` | Куда Vite проксирует `/api` |

Для сборки с отдельным доменом API задайте `VITE_API_BASE_URL=https://api.example.com/api`.
Учтите, что бэкенд не настраивает CORS: в production размещайте UI и API на одном домене
через reverse proxy либо добавьте CORS на стороне сервера.

## Структура

```
frontend/src/
├── api/
│   ├── client.ts        # axios-инстанс, ApiError, нормализация ошибок
│   └── health.ts        # пример типизированного эндпоинта
├── components/
│   ├── api-status-card.tsx
│   ├── app-header.tsx
│   └── next-steps-card.tsx
├── config/app-config.ts # настройки из import.meta.env
├── hooks/
│   └── use-health-check.ts
├── pages/home-page.tsx
├── App.tsx
└── main.tsx             # ChakraProvider, StrictMode
```

## Как добавить эндпоинт

1. Создайте модуль в `src/api/`, например `tasks.ts`:

```ts
import { api } from './client';

export interface Task {
  id: string;
  title: string;
}

export async function getTasks(): Promise<Task[]> {
  const { data } = await api.get<Task[]>('/tasks');
  return data;
}
```

2. Используйте функцию в компоненте. Все сетевые ошибки уже приводятся к `ApiError`
   (поля `message`, `status`, `code`, `details`), поэтому обрабатывать `AxiosError`
   в компонентах не нужно.

## Скрипты

- `npm run dev` — dev-сервер Vite
- `npm run build` — проверка типов и production-сборка в `dist/`
- `npm run preview` — локальный предпросмотр собранной версии
- `npm run typecheck` — только проверка типов
