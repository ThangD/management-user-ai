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
npx prisma migrate deploy --schema=./prisma/schema.prisma || {
  echo "⚠️  Migration failed with exit code $?"
  echo "⚠️  This might be expected if migrations already applied"
  echo "⚠️  Continuing with startup..."
}

echo ""
echo "🌱 Seeding database..."
npx ts-node prisma/seed.ts || {
  echo "⚠️  Seed failed with exit code $?"
  echo "⚠️  This is expected if data already exists"
  echo "⚠️  Continuing with startup..."
}

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
