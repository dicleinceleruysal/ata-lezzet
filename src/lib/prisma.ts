import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  // 1. Eğer harici bir bulut veritabanı (Vercel Postgres, Supabase, Neon vb.) tanımlanmışsa doğrudan onu kullan
  if (process.env.DATABASE_URL) {
    return new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
      log: ['error'],
    });
  }

  const isServerless = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);

  if (isServerless) {
    const tmpDbPath = '/tmp/dev.db';

    if (!fs.existsSync(tmpDbPath)) {
      const candidates = [
        path.join(process.cwd(), 'prisma', 'dev.db'),
        path.resolve('./prisma/dev.db'),
        path.join('/var/task', 'prisma', 'dev.db'),
        path.join('/var/task', '.next', 'server', 'prisma', 'dev.db'),
        path.join(process.cwd(), '.next', 'server', 'prisma', 'dev.db'),
        path.resolve(__dirname, '..', '..', '..', 'prisma', 'dev.db'),
        path.resolve(__dirname, '..', '..', 'prisma', 'dev.db'),
      ];

      for (const cand of candidates) {
        if (fs.existsSync(/*turbopackIgnore: true*/ cand)) {
          try {
            fs.copyFileSync(cand, tmpDbPath);
            console.log(`[Prisma] dev.db successfully copied from ${cand} to ${tmpDbPath}`);
            break;
          } catch (err) {
            console.error(`[Prisma] Failed to copy from ${cand}:`, err);
          }
        }
      }
    }

    return new PrismaClient({
      datasources: {
        db: {
          url: `file:${tmpDbPath}`,
        },
      },
      log: ['error'],
    });
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
