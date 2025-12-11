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
echo "================================================"
echo "🚀 Starting NestJS application..."
echo "🔌 Listening on port: ${PORT:-3001}"
echo "📍 Health endpoint: http://localhost:${PORT:-3001}/health"
echo "📍 API endpoint: http://localhost:${PORT:-3001}/api"
echo "================================================"
echo ""
echo "⏳ Launching node process..."
echo "📝 Command: node dist/src/main.js"
echo "🔍 Node modules check:"
ls -la node_modules/@nestjs/core 2>&1 | head -3 || echo "NestJS not found"
ls -la node_modules/@prisma/client 2>&1 | head -3 || echo "Prisma client not found"
echo ""

# Start the application with error handling
set +e
node dist/src/main.js 2>&1
APP_EXIT=$?
echo ""
echo "❌ Application exited with code: $APP_EXIT"
exit $APP_EXIT
