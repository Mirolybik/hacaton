import { Request, Response } from 'express';
import { HealthResponse } from './health.schema';

export const healthController = {
  check(_req: Request, res: Response<HealthResponse>) {
    res.json({ status: 'ok' });
  },
};
