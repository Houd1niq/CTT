# Настройка тестового окружения

## 1. Создание тестовой базы данных

1. Создайте тестовую базу данных PostgreSQL:
```bash
createdb ctt_test
```

2. Создайте файл `.env.test` в корневой директории проекта со следующим содержимым:
```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ctt_test"
TEST_DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ctt_test"
TEST_ELASTICSEARCH_URL="http://localhost:9200"
AT_SECRET="test-at-secret"
RT_SECRET="test-rt-secret"
SMTP_LOGIN="test@test.com"
SMTP_PASS="test-password"
```

3. Примените миграции к тестовой базе данных:
```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ctt_test" npx prisma migrate dev
```

## 2. Настройка Elasticsearch

1. Убедитесь, что Elasticsearch запущен и доступен по адресу http://localhost:9200
2. Для тестов используется отдельный индекс, который автоматически очищается между тестами

## 3. Запуск тестов

1. Модульные тесты:
```bash
npm test
```

2. Тесты с отслеживанием изменений:
```bash
npm run test:watch
```

3. Тесты с отчетом о покрытии:
```bash
npm run test:cov
```

4. E2E тесты:
```bash
npm run test:e2e
```

## 4. Структура тестов

- Модульные тесты находятся в директории `src/__tests__`
- E2E тесты находятся в директории `test`
- Фикстуры и моки находятся в директории `src/test`

## 5. Очистка тестового окружения

После завершения тестирования можно удалить тестовую базу данных:
```bash
dropdb ctt_test
``` 