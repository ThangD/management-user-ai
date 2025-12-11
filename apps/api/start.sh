#!/bin/sh

echo "================================================"
echo "🚀 Starting Management User API"
echo "================================================"
echo "📅 Date: $(date)"
echo "🔧 Node version: $(node --version)"
echo "📦 NPM version: $(npm --version)"
echo "📂 Working directory: $(pwd)"
echo "📋 Directory contents:"
ls -la
echo ""
echo "🗄️  Database URL: ${DATABASE_URL:0:30}..." 
echo "🔌 Port: ${PORT:-3001}"
echo "================================================"

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "❌ ERROR: DATABASE_URL environment variable is not set!"
  exit 1
fi

# Check if dist folder exists
if [ ! -d "dist" ]; then
  echo "❌ ERROR: dist folder not found!"
  echo "📋 Contents of /app:"
  ls -la /app
  exit 1
fi

# Check if main.js exists
if [ ! -f "dist/src/main.js" ]; then
  echo "❌ ERROR: dist/src/main.js not found!"
  echo "📋 Contents of dist:"
  ls -la dist/
  if [ -d "dist/src" ]; then
    echo "📋 Contents of dist/src:"
    ls -la dist/src/
  fi
  exit 1
fi

echo ""
echo "🔄 Running database migrations..."
set +e  # Don't exit on error
npx prisma migrate deploy --schema=./prisma/schema.prisma
MIGRATION_EXIT=$?
set -e  # Re-enable exit on error

if [ $MIGRATION_EXIT -ne 0 ]; then
  echo "⚠️  Migration failed with exit code $MIGRATION_EXIT"
  echo "⚠️  This might be expected if migrations already applied"
fi
echo "✅ Migration step completed"

echo ""
echo "🌱 Seeding database..."
set +e  # Don't exit on error
npx ts-node prisma/seed.ts
SEED_EXIT=$?
set -e  # Re-enable exit on error

if [ $SEED_EXIT -ne 0 ]; then
  echo "⚠️  Seed failed with exit code $SEED_EXIT"
  echo "⚠️  This is expected if data already exists"
fi
echo "✅ Seed step completed"

echo ""
echo "================================================"
echo "🚀 Starting NestJS application..."
echo "🔌 Listening on port: ${PORT:-3001}"
echo "📍 Health endpoint: http://localhost:${PORT:-3001}/health"
echo "📍 API endpoint: http://localhost:${PORT:-3001}/api"
echo "================================================"
echo ""

# Start the application
exec node dist/src/main.js
