# hacaton API

REST API для заявок на обслуживание оборудования.

## Запуск

```bash
npm install
cp .env.example .env
npm run dev
```

## Стек

- TypeScript
- Express
- Sequelize
- PostgreSQL
- Zod
- Pino

## Роли

Роль и имя передаются в заголовках:

```text
x-user-role: duty | engineer | director
x-user-name: Имя (URI-encoded)
```

## Эндпоинты

```text
GET    /api/health
POST   /api/requests
GET    /api/requests
GET    /api/requests/stats
GET    /api/requests/:id
PATCH  /api/requests/:id
POST   /api/requests/:id/take
```
