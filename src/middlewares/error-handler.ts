import type { ErrorRequestHandler } from 'express';

import { isProduction } from '../config/env.js';
import { logger } from '../config/logger.js';
import { HttpError } from '../utils/http-error.js';

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const isHttpError = err instanceof HttpError;
  const statusCode = isHttpError ? err.statusCode : 500;
  const message = isHttpError ? err.message : 'Internal Server Error';

  if (statusCode >= 500) {
    logger.error({ err, method: req.method, url: req.originalUrl }, 'Request failed');
  } else {
    logger.warn({ message, method: req.method, url: req.originalUrl }, 'Request rejected');
  }

  res.status(statusCode).json({
    error: {
      statusCode,
      message,
      ...(isHttpError && err.details !== undefined ? { details: err.details } : {}),
      ...(!isProduction && statusCode >= 500 && err instanceof Error
        ? { stack: err.stack }
        : {}),
    },
  });
};
