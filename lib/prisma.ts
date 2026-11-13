import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

function createPrismaClient() {
  const isProduction = process.env.NODE_ENV === 'production';
  const connectionString = process.env.DATABASE_URL;

  // الحفاظ الصارم على max: 1 لحماية سحابة Supabase وVercel من تجاوز حد الاتصالات (EMAXCONNSESSION)
  // في البيئة المحلية: زيادة مهلة الانتظار ومهلة الخمول لاستيعاب زمن المصافحة الدولية للاتصال دون حدوث Timeout
  const pool =
    globalForPrisma.pool ??
    new Pool({
      connectionString,
      max: 1, // اتصال واحد فقط دائماً لمنع استنزاف السيرفر
      idleTimeoutMillis: isProduction ? 10000 : 120000, // دقيقتان محلياً للحفاظ على دفء الاتصال، و10 ثوانٍ في Vercel
      connectionTimeoutMillis: isProduction ? 15000 : 90000, // 90 ثانية محلياً لاستيعاب زمن المصافحة الدولية الأولية
    });

  pool.on('error', (err) => {
    console.error('[pg-pool] Unexpected error on idle client:', err.message);
  });

  if (!isProduction) {
    globalForPrisma.pool = pool;
  }

  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma =
  globalForPrisma.prisma ??
  createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
