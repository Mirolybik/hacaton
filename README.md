# hacaton

REST API на Express 5 + TypeScript (ESM).

## Стек

- **Express 5** — HTTP-фреймворк
- **TypeScript** (strict, NodeNext/ESM)
- **Zod** — валидация переменных окружения
- **Pino** — логирование
- **Helmet / CORS** — безопасность
- **Vitest + Supertest** — тесты
- **ESLint + Prettier** — качество кода

## Быстрый старт

```bash
npm install
cp .env.example .env
npm run dev
```

Сервер поднимется на `http://localhost:3000`, health-check — `GET /api/health`.

## Скрипты

| Команда             | Назначение                          |
| ------------------- | ----------------------------------- |
| `npm run dev`       | запуск в режиме разработки (tsx watch) |
| `npm run build`     | компиляция в `dist/`                |
| `npm start`         | запуск собранного приложения        |
| `npm run typecheck` | проверка типов без сборки           |
| `npm run lint`      | ESLint                              |
| `npm run format`    | форматирование Prettier             |
| `npm test`          | тесты (Vitest)                      |

## Структура

```
src/
├── config/          # env, logger
├── controllers/     # обработчики запросов
├── middlewares/     # error handler, 404
├── routes/          # роутеры
├── utils/           # хелперы (HttpError и др.)
├── app.ts           # сборка Express-приложения
└── index.ts         # точка входа, graceful shutdown
tests/               # интеграционные тесты
```

## Добавление эндпоинта

1. Создайте контроллер в `src/controllers/`.
2. Опишите роутер в `src/routes/`.
3. Подключите роутер в `src/routes/index.ts`.

Ошибки бросайте через `HttpError` — их централизованно обработает `errorHandler`.
