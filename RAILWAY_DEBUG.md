# Railway Deployment Debugging Guide

## ⚠️ CURRENT ISSUE: Dockerfile Not Found Error

If you see: **"Dockerfile 'Dockerfile' does not exist"**

### Quick Fix:
1. Railway Settings → scroll to **Builder** section
2. Make sure **DOCKERFILE** is selected from dropdown (not Nixpacks)
3. **Dockerfile Path**: Try in this order:
   - Leave empty (let Railway auto-detect)
   - OR type `Dockerfile`
   - OR type `./Dockerfile`
4. **Root Directory**: MUST be `apps/api`
5. **Build Command**: DELETE/CLEAR this field completely
6. **Start Command**: DELETE/CLEAR this field completely
7. Click **Save** and redeploy

---

## ✅ Changes Made

### Enhanced Logging

We've added comprehensive logging to help debug deployment issues:

1. **Start Script (`apps/api/start.sh`)** - Now shows:
   - Container startup timestamp
   - Node and NPM versions
   - Working directory and file listing
   - Database URL (masked)
   - Port configuration
   - File existence checks
   - Migration and seed status
   - Clear startup confirmation

2. **Application (`apps/api/src/main.ts`)** - Now shows:
   - Each initialization step
   - Successful configuration of CORS, validation, Swagger
   - Port binding attempt
   - Final startup confirmation with all endpoints

## 🔍 What to Check in Railway Logs

### During Build (Build Logs)
✅ Look for:
- Successful Docker image build
- "Build time: XX seconds"

### During Deployment (Deploy Logs)
📋 You should now see detailed logs like:

```
================================================
🚀 Starting Management User API
================================================
📅 Date: ...
🔧 Node version: v22.x.x
📦 NPM version: ...
📂 Working directory: /app
📋 Directory contents:
...
🗄️  Database URL: postgresql://...
🔌 Port: 3001
================================================

🔄 Running database migrations...
✔ Generated Prisma Client...
No pending migrations to apply.

🌱 Seeding database...
...

================================================
🚀 Starting NestJS application...
🔌 Listening on port: 3001
================================================

🔧 Initializing NestJS application...
✅ NestJS application created
✅ CORS enabled
✅ Validation pipe configured
✅ Swagger documentation configured
🔌 Attempting to bind to 0.0.0.0:3001...

================================================
🚀 Application is running on: http://0.0.0.0:3001
📚 Swagger documentation: http://localhost:3001/api-docs
🏥 Health check: http://localhost:3001/health
✅ Database: Connected
✅ Authentication: JWT enabled
================================================
```

## 🚨 Common Issues to Look For

### Issue 1: No Logs After "Starting Container"
**Problem**: Application crashes immediately
**Check**: 
- Is DATABASE_URL set correctly in Railway?
- Are there any ERROR messages in the logs?

### Issue 2: Logs Stop at "Running database migrations"
**Problem**: Database connection issue
**Check**:
- Database URL is correct
- Neon database is active and accessible
- Network connectivity from Railway to Neon

### Issue 3: Logs Stop at "Starting NestJS application"
**Problem**: App initialization error
**Check**:
- Look for any error stack traces
- Check if PORT environment variable is set (Railway auto-sets this)

### Issue 4: App Starts but Health Check Fails
**Problem**: Port mismatch or health endpoint issue
**Check**:
- Ensure PORT in Railway matches what app is listening on
- Railway auto-assigns PORT - don't hardcode 3001 in Railway settings
- The app should use `process.env.PORT`

## 🔧 Next Steps for Debugging

### Step 1: Push Changes to Railway
```bash
git push
```
Railway will auto-deploy the new version with logging.

### Step 2: Watch Deploy Logs
In Railway dashboard:
1. Go to your service
2. Click "Deployments" tab
3. Click the latest deployment
4. Watch the logs in real-time

### Step 3: Check for Errors
Look for:
- ❌ ERROR messages
- ⚠️ Warning messages
- Where the logs stop (indicates crash point)

### Step 4: Verify Environment Variables
In Railway dashboard:
1. Go to your service
2. Click "Variables" tab
3. Verify:
   - ✅ `DATABASE_URL` is set (starts with `postgresql://`)
   - ✅ `JWT_SECRET` is set (any secure string)
   - ℹ️ `PORT` is NOT set (Railway auto-assigns)

## 🎯 Expected Behavior

With healthcheck **disabled**:
- Build should complete successfully
- Container should start
- You should see all the detailed logs
- App should show "Application is running"
- Deployment should show as "Active" (not waiting for healthcheck)

## 📝 If Still Failing

Share the **full deploy logs** from Railway:
1. Copy everything from "Starting Container" onwards
2. Look specifically for the LAST message before it stops
3. Check if there are any ERROR or stack trace messages

The enhanced logging will help identify exactly where the startup process is failing.
