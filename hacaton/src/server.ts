import { createApp } from './app';
import { env } from './config/env';
import { connectDatabase } from './db';
import { logger } from './lib/logger';
import { RequestHistory } from './modules/requests/request.history';
import { Request } from './modules/requests/request.model';

async function bootstrap(): Promise<void> {
  await connectDatabase();
  await Request.sync({ alter: true });
  await RequestHistory.sync({ alter: true });

  const app = createApp();

  app.listen(env.PORT, () => {
    logger.info({ port: env.PORT }, 'server started');
  });
}

bootstrap().catch((err) => {
  logger.error({ err }, 'failed to start server');
  process.exit(1);
});
