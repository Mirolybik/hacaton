import pino from 'pino';
import pretty from 'pino-pretty';
import config from './config.js';

export const logger = pino(
  { level: config.LOG_LEVEL },
  config.LOG_PRETTY
    ? pretty({ colorize: true, translateTime: 'SYS:standard' })
    : undefined,
);

export default logger;
