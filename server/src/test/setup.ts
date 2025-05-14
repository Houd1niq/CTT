import { PrismaClient } from '@prisma/client';
import { Client } from '@elastic/elasticsearch';
import { config } from 'dotenv-flow';

// Загружаем переменные окружения из .env.test
config({ node_env: 'test' });

// Создаем тестовую базу данных
export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

// Создаем тестовый клиент Elasticsearch
export const elasticsearch = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
});

// Функция для очистки тестовой базы данных
export async function clearDatabase() {
  const tables = await prisma.$queryRaw<
    Array<{ tablename: string }>
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  for (const { tablename } of tables) {
    if (tablename !== '_prisma_migrations') {
      await prisma.$executeRawUnsafe(
        `TRUNCATE TABLE "public"."${tablename}" CASCADE;`,
      );
    }
  }
}

// Функция для очистки индексов Elasticsearch
export async function clearElasticsearch() {
  const indices = await elasticsearch.cat.indices({ format: 'json' });
  const systemIndices = ['.geoip_databases', '.kibana', '.security', '.apm', '.watches'];
  
  for (const index of indices) {
    // Пропускаем системные индексы
    if (!systemIndices.some(systemIndex => index.index.startsWith(systemIndex))) {
      await elasticsearch.indices.delete({ index: index.index });
    }
  }
}

// Глобальная настройка для всех тестов
beforeAll(async () => {
  // Очищаем базу данных перед всеми тестами
  await clearDatabase();
  await clearElasticsearch();
});

// Очистка после каждого теста
afterEach(async () => {
  await clearDatabase();
  await clearElasticsearch();
});

// Закрытие соединений после всех тестов
afterAll(async () => {
  await prisma.$disconnect();
}); 