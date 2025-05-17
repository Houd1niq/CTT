#!/bin/bash

echo 'Build client'
cd ../../client
npm run build

echo 'copying files'
cp -r dist/* ../server/static
cd ../server

echo "Stopping and removing existing containers..."
docker compose down

echo "Pruning unused volumes..."
docker volume prune -f

echo "Building and starting containers..."
docker compose up --build -d

echo "Checking container status..."
docker compose ps

echo "Deployment ended!"
