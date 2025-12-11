#!/bin/sh
set -e

echo "🔄 Running database migrations..."
npx prisma migrate deploy --schema=./prisma/schema.prisma

echo "🌱 Seeding database..."
npx ts-node prisma/seed.ts || echo "⚠️  Seed failed or already seeded"

echo "🚀 Starting application..."
node dist/main.js
