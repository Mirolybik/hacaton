import type express from 'express';
import { ZodError } from 'zod';
import { HttpError } from '../lib/http-error';
import * as logger from '../lib/logger';

export function errorHandler(err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) {
  if (err instanceof ZodError) {
    res.status(400).json({ error: 'validation_error', details: err.flatten() });
    return;
  }

  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.code });
    return;
  }

  logger.logger.error({ err }, 'unhandled error');
  res.status(500).json({ error: 'internal_error' });
}
