#!/bin/bash

# Остановка и удаление существующих контейнеров
echo "Hard migration..."
docker compose exec app npx prisma migrate deploy
