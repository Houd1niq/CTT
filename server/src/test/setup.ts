import {PrismaClient} from '@prisma/client';
import {Client} from '@elastic/elasticsearch';
import {config} from 'dotenv-flow';
import {TEST_INDEX_PREFIX, TEST_INDICES} from "./const";

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

// Создаем тестовый клиент Elasticsearch
export const elasticsearch = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
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

// Функция для очистки тестовых индексов Elasticsearch
export async function clearElasticsearch() {
  const indices = await elasticsearch.cat.indices({format: 'json'});

  for (const index of indices) {
    // Удаляем только тестовые индексы
    if (index.index.startsWith(TEST_INDEX_PREFIX)) {
      try {
        await elasticsearch.indices.delete({index: index.index});
      } catch (error) {
        console.log(error)
      }
    }
  }
}

// Функция для инициализации тестовых индексов
export async function initializeTestIndices() {
  // Создаем тестовый индекс для патентов
  const patentsIndexExists = await elasticsearch.indices.exists({
    index: TEST_INDICES.PATENTS,
  });

  if (!patentsIndexExists) {
    try {
      await elasticsearch.indices.create({
        index: TEST_INDICES.PATENTS,
        body: {
          mappings: {
            properties: {
              patentNumber: {type: 'keyword'},
              name: {type: 'text', analyzer: 'russian'},
              pdfContent: {type: 'text', analyzer: 'russian'},
            },
          },
        },
      });
    } catch (error) {
      console.log(error)
    }
  }
}

// Глобальная настройка для всех тестов
beforeAll(async () => {
  // Очищаем базу данных перед всеми тестами
  await clearDatabase();
  await clearElasticsearch();
  await initializeTestIndices();
});

// Очистка после каждого теста
afterEach(async () => {
  await clearDatabase();
  await clearElasticsearch();
  await initializeTestIndices();
});

// Очистка после всех тестов
afterAll(async () => {
  await prisma.$disconnect();
  await clearElasticsearch();
});
