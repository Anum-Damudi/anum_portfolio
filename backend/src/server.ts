import { app } from './app.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { prisma } from './services/prisma.service.js';

const PORT = env.PORT;

const server = app.listen(PORT, () => {
  logger.info(`🚀 Anum's Portfolio Backend listening at http://localhost:${PORT}`);
  logger.info(`📚 Swagger OpenAPI documentation available at http://localhost:${PORT}/api/docs`);
  logger.info(`✨ Mode: ${env.NODE_ENV}`);
});

const gracefulShutdown = async (signal: string) => {
  logger.info(`Received ${signal}. Starting graceful shutdown...`);
  server.close(async () => {
    logger.info('HTTP server closed.');
    await prisma.$disconnect();
    logger.info('Prisma disconnected. Exiting process.');
    process.exit(0);
  });

  // Force shutdown after 10 seconds if hanging
  setTimeout(() => {
    logger.error('Forced shutdown after timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
