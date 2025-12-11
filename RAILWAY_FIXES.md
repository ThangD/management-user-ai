# Railway Deployment Fixes

# Railway Deployment Fixes & Debugging

## 🚨 CRITICAL FIX: Health Endpoint Added

**Just fixed:** Added `/health` endpoint to `apps/api/src/app.controller.ts`

You need to **commit and push** this change!

```bash
git add apps/api/src/app.controller.ts
git commit -m "Add health endpoint for Railway healthcheck"
git push origin main
```

---

## Debugging Healthcheck Failure

### Step 1: Check Railway Logs (MOST IMPORTANT)

In Railway dashboard:
1. Click on your service
2. Click "View Logs" button (top right)
3. Look for these specific messages:

**✅ Good signs:**
```
🔄 Running database migrations...
Environment variables loaded
Datasource "db": PostgreSQL database
Database is now in sync

🌱 Seeding database...
🚀 Starting application...
[Nest] LOG [NestFactory] Starting Nest application...
🚀 Application is running on: http://0.0.0.0:XXXX
```

**❌ Bad signs and fixes:**

| Error Message | Fix |
|--------------|-----|
| `Error: connect ECONNREFUSED` | DATABASE_URL is wrong |
| `Error: P1001: Can't reach database` | Remove `&channel_binding=require` from DATABASE_URL |
| `prisma: command not found` | Dockerfile issue (should be fixed) |
| `Cannot find module` | Build failed, check Dockerfile |
| No logs at all | Build failed, check "Deployments" tab |

### Step 2: Fix DATABASE_URL Connection

Your current DATABASE_URL has `&channel_binding=require` which might cause issues.

**In Railway dashboard > Variables:**

Change from:
```
postgresql://neondb_owner:npg_GBibv0oQW6ka@ep-winter-dust-a4kmfouh-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

To (remove channel_binding):
```
postgresql://neondb_owner:npg_GBibv0oQW6ka@ep-winter-dust-a4kmfouh-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
```

### Step 3: Increase Healthcheck Timeout

Railway healthcheck might be too impatient. Database migrations take time!

**In Railway dashboard > Settings > Healthcheck:**

- **Healthcheck Path:** `/health`
- **Healthcheck Timeout:** `100` seconds (default is 300)
- **Initial Delay:** `60` seconds

Or temporarily **disable healthcheck** to test if app starts:
1. Go to Settings
2. Find "Health Check"  
3. Toggle OFF

This helps identify if issue is healthcheck or app startup.

### Step 4: Verify Environment Variables

Required variables in Railway:

```
DATABASE_URL=postgresql://neondb_owner:...@ep-winter-dust-a4kmfouh-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
```

**DO NOT SET PORT** - Railway sets this automatically.

---

## Issues Fixed

### 1. Healthcheck Failure
**Problem:** Railway healthcheck was failing because:
- Database migrations weren't running before app start
- No proper startup sequence
- Healthcheck timing was too short

**Solution:**
- Created `start.sh` script that runs in this order:
  1. Run database migrations (`prisma migrate deploy`)
  2. Seed database (fails gracefully if already seeded)
  3. Start the application
- Added Docker HEALTHCHECK with 40s start period
- App now listens on `0.0.0.0:3001` (required for Railway)

### 2. Docker Configuration
**Updated Dockerfile:**
- Copies `start.sh` script
- Installs `ts-node` and `typescript` for seed script
- Copies prisma files to production image
- Sets proper healthcheck with `/health` endpoint
- Uses startup script as CMD

### 3. Environment Variables Required
Make sure these are set in Railway:
```
DATABASE_URL=postgresql://neondb_owner:...@ep-winter-dust....neon.tech/neondb?sslmode=require
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3001
```

## Files Changed
1. `apps/api/Dockerfile` - Added startup script, healthcheck, ts-node
2. `apps/api/start.sh` - New startup script for migrations + app start
3. `apps/api/package.json` - Reverted prisma seed command

## How to Redeploy on Railway

1. **Push changes to GitHub:**
   ```bash
   git push origin main
   ```

2. **Railway will auto-deploy** or manually trigger in Railway dashboard

3. **Check logs** in Railway:
   - Should see "🔄 Running database migrations..."
   - Then "🌱 Seeding database..."
   - Finally "🚀 Starting application..."
   - App should start on port 3001

4. **Verify healthcheck:**
   - Visit: `https://your-app.railway.app/health`
   - Should return: `{"status":"ok","timestamp":"..."}`

5. **Test API:**
   - Visit: `https://your-app.railway.app/api-docs`
   - Should see Swagger documentation

## Next Steps

Once API is deployed successfully:
1. Deploy frontend to Vercel
2. Update frontend `NEXT_PUBLIC_API_URL` to Railway URL
3. Test login with admin@example.com / Admin@123
