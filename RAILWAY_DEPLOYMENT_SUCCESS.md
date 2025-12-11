# Railway Deployment - Clean Setup Guide

## ✅ Current Status

- ✅ Dockerfile is correct and ready at `apps/api/Dockerfile`
- ✅ No Railway config files (railway.json, railway.toml removed)
- ✅ Application works locally

## 🚀 Railway Setup (Clean Steps)

### 1. GitHub
```bash
git add .
git commit -m "Ready for Railway deployment"
git push origin main
```

### 2. Railway Project Configuration

#### Service Settings
- **Root Directory**: `apps/api` ⚠️ CRITICAL
- **Builder**: Docker (NOT Nixpacks)
- **Dockerfile Path**: Leave EMPTY
- **Build Command**: Leave EMPTY  
- **Start Command**: Leave EMPTY

#### Environment Variables
```
DATABASE_URL=postgresql://neondb_owner:npg_GBibv0oQW6ka@ep-winter-dust-a4kmfouh-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=your-super-secret-jwt-key-change-this
PORT=3001
NODE_ENV=production
```

### 3. How Dockerfile Works

The Dockerfile handles everything automatically:

1. **Build Stage**: Compiles NestJS app
2. **Production Stage**: 
   - Runs `npx prisma migrate deploy` (migrations)
   - Runs `node dist/src/main.js` (starts API)

### 4. Verify Deployment

**Check Deploy Logs** (not Build Logs):
```
=== STARTING API ===
Running migrations...
Prisma schema loaded from prisma/schema.prisma
No pending migrations to apply.
Migrations complete!
Starting NestJS on port 3001...
```

**Test Health Endpoint**:
```bash
curl https://your-app.railway.app/health
```

## 🔧 Troubleshooting

### "Dockerfile not found"
- ✅ Root Directory must be `apps/api`
- ✅ Dockerfile must be committed to git
- ✅ Dockerfile Path should be EMPTY

### App doesn't start
- Check Deploy Logs tab (not Build)
- Verify all environment variables are set
- Make sure DATABASE_URL includes `?sslmode=require`

## 📝 What We Removed

- ❌ Removed `apps/api/railway.json`
- ❌ Removed `apps/api/railway.toml`
- ❌ Removed custom start commands

Railway now uses ONLY the Dockerfile.
