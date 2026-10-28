import express from 'express';
import pinoHttp from 'pino-http';
import { ZodError } from 'zod';
import logger from './logger.js';
import usersRouter from './routes/users.js';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(
    pinoHttp({
      logger,
      // не логируем заголовки и тело целиком
      serializers: {
        req: (req) => ({ id: req.id, method: req.method, url: req.url }),
        res: (res) => ({ statusCode: res.statusCode }),
      },
    }),
  );
  app.use(express.json());

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  app.use('/api/users', usersRouter);

  app.use((_req, res) => res.status(404).json({ error: 'Not found' }));

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err instanceof ZodError) {
      return res.status(422).json({
        error: 'Validation failed',
        details: err.issues.map(({ path, message }) => ({
          path: path.join('.'),
          message,
        })),
      });
    }

    const status = err.status ?? 500;
    (req.log ?? logger).error({ err }, err.message);
    res.status(status).json({
      error: status >= 500 ? 'Internal server error' : err.message,
    });
  });

  return app;
}

export default createApp;
