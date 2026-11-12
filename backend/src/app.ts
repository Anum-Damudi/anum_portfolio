import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { httpLogger } from './middleware/logging.middleware.js';
import { notFoundHandler, errorHandler } from './middleware/error.middleware.js';
import apiRouter from './routes/index.js';
import { setupSwagger } from './docs/swagger.js';

export const createApp = (): Express => {
  const app = express();

  // 1. Security Headers via Helmet
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: false, // Allows Swagger UI assets and previewing
    })
  );

  // 2. CORS restricted to configured frontend origins
  const allowedOrigins = [
    env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, postman) or if in allowed list
        if (!origin || allowedOrigins.includes(origin) || origin.endsWith('.anum.dev')) {
          callback(null, true);
        } else {
          callback(new Error(`Origin ${origin} not permitted by CORS`));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key'],
    })
  );

  // 3. Body parsers with strict size limits
  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: true, limit: '100kb' }));

  // 4. Cookie parser for httpOnly admin JWT
  app.use(cookieParser());

  // 5. Structured HTTP Logging
  app.use(httpLogger);

  // 6. OpenAPI Swagger Documentation
  setupSwagger(app);

  // 7. Core API Routes
  app.use('/api', apiRouter);

  // 8. 404 Route Handler
  app.use(notFoundHandler);

  // 9. Centralized Error Handler (Never leaks stack traces in production)
  app.use(errorHandler);

  return app;
};

export const app = createApp();
export default app;
