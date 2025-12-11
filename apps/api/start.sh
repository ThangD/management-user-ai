#!/bin/sh
set -e

echo "🔄 Running database migrations..."
npx prisma migrate deploy --schema=./prisma/schema.prisma || {
  echo "⚠️  Migrations failed, trying to continue..."
}

echo "🌱 Seeding database..."
npx ts-node prisma/seed.ts || {
  echo "⚠️  Seed failed or already seeded, continuing..."
}

echo "🚀 Starting NestJS application on port ${PORT:-3000}..."
echo "📍 Health check will be available at /health"
exec node dist/src/main.js
