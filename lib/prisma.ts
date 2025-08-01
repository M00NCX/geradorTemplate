import { PrismaClient } from '@prisma/client';

// Adiciona o cliente Prisma ao objeto global para evitar múltiplas instâncias em desenvolvimento
// Isso é uma prática comum para hot-reloading em Next.js
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'], // Opcional: loga todas as queries SQL para depuração
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
