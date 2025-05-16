import {PrismaClient} from '@prisma/client';
import {config} from 'dotenv-flow';
// Загружаем переменные окружения из .env.test
config({node_env: 'test'});

// Создаем тестовую базу данных
export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Константы для тестового окружения

// Функция для очистки базы данных
export async function clearDatabase() {
  const tables = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename
    FROM pg_tables
    WHERE schemaname = 'public'`;

  for (const {tablename} of tables) {
    if (tablename !== '_prisma_migrations') {
      await prisma.$executeRawUnsafe(
        `TRUNCATE TABLE "public"."${tablename}" CASCADE;`,
      );
    }
  }
}

// Глобальная настройка для всех тестов
beforeAll(async () => {
  // Очищаем базу данных перед всеми тестами
  await clearDatabase();
});

// Очистка после каждого теста
afterEach(async () => {
  await clearDatabase();
});

// Очистка после всех тестов
afterAll(async () => {
  await prisma.$disconnect();
});
