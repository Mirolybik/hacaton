import config from './config.js';
import logger from './logger.js';
import createApp from './app.js';

const app = createApp();

const server = app.listen(config.PORT, () => {
  logger.info(`Server listening on http://localhost:${config.PORT}`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    logger.info({ signal }, 'Shutting down');
    server.close(() => process.exit(0));
  });
}
