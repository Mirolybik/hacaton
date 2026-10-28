import { createApp } from './app';
import { env } from './config/env';
import { connectDatabase } from './db';
import { logger } from './lib/logger';

async function bootstrap(): Promise<void> {
  await connectDatabase();

  const app = createApp();

  app.listen(env.PORT, () => {
    logger.info({ port: env.PORT }, 'server started');
  });
}

bootstrap().catch((err) => {
  logger.error({ err }, 'failed to start server');
  process.exit(1);
});
