# ⚠️ CRITICAL: Railway Healthcheck Failing - Fix Now

## Problem
✅ Docker build succeeds  
❌ Healthcheck fails - app not responding on `/health`

## Root Cause
The app likely isn't starting because:
1. Database migrations are failing silently
2. Seed script is hanging
3. App crashes before reaching listen()

## Immediate Solution

### Fix 1: Simplify Startup (Remove Migrations from Docker)

The migrations might be failing in Docker. Let's run them separately:

**Update `apps/api/Dockerfile`** - Remove migrations from startup:

```dockerfile
# Keep existing file the same, just update the CMD:
CMD ["node", "dist/main.js"]
```

Remove the `start.sh` from Dockerfile:
```bash
cd apps/api
git mv Dockerfile Dockerfile.working
```

Then create new simplified Dockerfile:

```dockerfile
FROM node:22-alpine

WORKDIR /app

# Install OpenSSL
RUN apk add --no-cache openssl

# Copy package files
COPY package*.json ./
COPY prisma ./prisma

# Install dependencies and generate Prisma
RUN npm install --production && \
    npm install prisma@^5.22.0 && \
    npx prisma generate

# Copy built files
COPY dist ./dist

# Expose port
EXPOSE 3001

# Start app directly (no migrations, no seed)
CMD ["node", "dist/main.js"]
```

### Fix 2: Run Migrations Manually After Deploy

1. Wait for deployment to fail healthcheck but container runs
2. In Railway dashboard, go to your service
3. Click on "..." menu → "Run Command"
4. Run: `npx prisma migrate deploy`
5. Run: `npx ts-node prisma/seed.ts` (if needed)
6. Restart the deployment

### Fix 3: Use Nixpacks Instead of Docker (RECOMMENDED - EASIEST)

Railway's Nixpacks is simpler and handles everything automatically:

1. **Rename Dockerfile:**
   ```bash
   cd /Users/thangdinh/working/management-user-ai/apps/api
   mv Dockerfile Dockerfile.backup
   ```

2. **Create `railway.toml` instead:**
   ```bash
   cat > railway.toml << 'RAIL'
   [build]
   builder = "NIXPACKS"

   [deploy]
   startCommand = "npx prisma migrate deploy && node dist/main.js"
   healthcheckPath = "/health"
   healthcheckTimeout = 100
   RAIL
   ```

3. **Push and redeploy**

## Alternative: Check What's Actually Happening

Add logging to see what's failing:

**Update `apps/api/src/main.ts`:**

```typescript
async function bootstrap() {
  try {
    console.log('🔧 Starting bootstrap...');
    
    const app = await NestFactory.create(AppModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });
    
    console.log('✅ NestJS app created');

    app.enableCors({
      origin: true,
      credentials: true,
    });
    console.log('✅ CORS enabled');

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );
    console.log('✅ Validation pipe configured');

    // Swagger
    const config = new DocumentBuilder()
      .setTitle('Management Users API')
      .setDescription('API for managing users, roles, and permissions')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);
    console.log('✅ Swagger configured');

    const port = process.env.PORT || 3001;
    console.log(`🔌 Attempting to listen on port ${port}...`);
    
    await app.listen(port, '0.0.0.0');
    
    console.log(`\n🚀 APPLICATION IS RUNNING!`);
    console.log(`📍 Port: ${port}`);
    console.log(`🏥 Health: http://0.0.0.0:${port}/health`);
    console.log(`📚 Docs: http://0.0.0.0:${port}/api-docs\n`);
    
  } catch (error) {
    console.error('❌ FATAL ERROR during bootstrap:', error);
    process.exit(1);
  }
}

bootstrap().catch((error) => {
  console.error('❌ FATAL ERROR:', error);
  process.exit(1);
});
```

## What To Do Right Now

**Option A - Quick Test (5 minutes):**
1. Switch to Nixpacks (rename Dockerfile)
2. Redeploy
3. Watch logs

**Option B - Docker Fix (10 minutes):**
1. Update Dockerfile to skip migrations
2. Just start the Node app
3. Run migrations manually after deploy

**Option C - Debug (15 minutes):**
1. Add verbose logging to main.ts
2. Redeploy
3. Check Railway logs to see exact error
4. Fix the actual issue

## Expected Railway Logs (Success):

```
🔧 Starting bootstrap...
✅ NestJS app created
✅ CORS enabled  
✅ Validation pipe configured
✅ Swagger configured
🔌 Attempting to listen on port 3001...

🚀 APPLICATION IS RUNNING!
📍 Port: 3001
🏥 Health: http://0.0.0.0:3001/health
```

## Quick Commands

```bash
# Go to API directory
cd /Users/thangdinh/working/management-user-ai/apps/api

# Try Nixpacks approach
mv Dockerfile Dockerfile.backup
git add -A
git commit -m "Switch to Nixpacks for Railway deployment"
git push

# OR keep Docker but simplify
# Edit Dockerfile to just: CMD ["node", "dist/main.js"]
git add Dockerfile
git commit -m "Simplify Docker startup - remove migrations"
git push
```

**Your choice - which do you want to try first?**
