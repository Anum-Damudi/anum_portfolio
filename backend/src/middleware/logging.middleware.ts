import pinoHttp from 'pino-http';
import { logger } from '../utils/logger.js';
import { env } from '../config/env.js';

export const httpLogger = (pinoHttp as unknown as (opts: any) => any)({
  logger,
  autoLogging: env.NODE_ENV !== 'test',
  serializers: {
    req: (req: any) => ({
      id: req.id,
      method: req.method,
      url: req.url,
      query: req.query,
      remoteAddress: req.remoteAddress,
    }),
    res: (res: any) => ({
      statusCode: res.statusCode,
    }),
  },
});
