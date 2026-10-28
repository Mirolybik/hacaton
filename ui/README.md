# hacaton-ui

Фронтенд-каркас проекта: React + Chakra UI + Axios (Vite, TypeScript).

## Запуск

```bash
cd ui
cp .env.example .env
npm install
npm run dev
```

UI будет доступен на http://localhost:5173. Запросы на `/api` проксируются
Vite на бэкенд `http://localhost:3000` (см. `vite.config.ts`), поэтому CORS
для локальной разработки не нужен.

## Скрипты

- `npm run dev` — dev-сервер Vite с HMR
- `npm run build` — проверка типов и production-сборка в `dist/`
- `npm run preview` — локальный предпросмотр сборки
- `npm run lint` — oxlint

## Структура

```
src/
  components/     переиспользуемые компоненты (app-shell, health-check-card)
  config/         конфигурация из import.meta.env
  lib/            axios-клиент и общие утилиты
  pages/          страницы приложения
  services/       запросы к API
  theme/          кастомная тема Chakra UI (брендовые токены)
  App.tsx         корневой компонент
  providers.tsx   провайдеры (ChakraProvider)
  main.tsx        точка входа
```

## Переменные окружения

| Переменная     | По умолчанию | Описание                          |
| -------------- | ------------ | --------------------------------- |
| `VITE_API_URL` | `/api`       | Базовый URL API для axios         |
