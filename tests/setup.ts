import { afterAll } from 'vitest';
import { prisma } from '../src/services/prisma.service.js';

process.env.NODE_ENV = 'test';

afterAll(async () => {
  await prisma.$disconnect();
});
