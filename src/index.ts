import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './config/logger.js';

const app = createApp();

const server = app.listen(env.PORT, env.HOST, () => {
  logger.info(` Сервер слушает на порту http://${env.HOST}:${env.PORT} (${env.NODE_ENV})`);
});

const shutdown = (signal: NodeJS.Signals): void => {
  logger.info({ signal }, 'Shutting down gracefully...');

  server.close((err) => {
    if (err) {
      logger.error({ err }, 'Error while closing server');
      process.exit(1);
    }
    logger.info('Server closed');
    process.exit(0);
  });

  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10_000).unref();
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
