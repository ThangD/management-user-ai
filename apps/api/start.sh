#!/bin/sh

echo "🔄 Running database migrations..."
npx prisma migrate deploy --schema=./prisma/schema.prisma || {
  echo "⚠️  Migrations failed, trying to continue..."
}

echo "🌱 Seeding database..."
npx ts-node prisma/seed.ts || echo "⚠️  Seed failed or already seeded"

echo "🚀 Starting application..."
exec node dist/main.js
