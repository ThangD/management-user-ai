# 🚀 DEPLOYMENT: Step-by-Step Instructions

## 📌 You Are Here

✅ Code is complete and committed
✅ Deployment configs ready
✅ Documentation created
⏭️ **NEXT: Push to GitHub and deploy**

---

## Step 1: Push to GitHub (2 mins)

Your code needs to be on GitHub for Railway and Vercel to access it.

```bash
# Push your code
git push origin main

# If you need to authenticate, use:
# - GitHub Personal Access Token (recommended)
# - Or SSH key
```

**Create Personal Access Token (if needed):**
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes: `repo` (all)
4. Copy the token
5. Use as password when pushing

---

## Step 2: Deploy Backend to Railway (15 mins)

### 2.1 Sign Up
1. Go to https://railway.app
2. Click "Login with GitHub"
3. Authorize Railway

### 2.2 Create PostgreSQL Database
1. Click "New Project"
2. Select "Provision PostgreSQL"
3. Click on the PostgreSQL service
4. Go to "Variables" tab
5. **Copy the DATABASE_URL** (looks like: `postgresql://postgres:xxx@xxx.railway.app:5432/railway`)

### 2.3 Deploy API Service
1. In the same project, click "New Service"
2. Select "GitHub Repo"
3. Choose: `ThangD/management-user-ai`
4. Railway will detect the repository

### 2.4 Configure API Service
1. Click on the new service
2. Go to "Settings" tab
3. **Root Directory:** `apps/api`
4. **Build Command:** `npm install && npm run build`
5. **Start Command:** `npm run start:prod`

### 2.5 Add Environment Variables
1. Go to "Variables" tab
2. Click "New Variable" and add these:

```
NODE_ENV=production
PORT=3001
DATABASE_URL=<paste from step 2.2>
JWT_SECRET=<run in terminal: openssl rand -base64 32>
JWT_EXPIRES_IN=7d
CORS_ORIGIN=*
```

### 2.6 Generate Public Domain
1. Go to "Settings" tab
2. Click "Generate Domain"
3. **Copy the URL** (e.g., `https://xxx.up.railway.app`)
4. This is your **BACKEND_URL**

### 2.7 Verify Deployment
```bash
# Test health endpoint
curl https://your-api.up.railway.app/health

# Should return: {"status":"ok"}
```

---

## Step 3: Deploy Frontend to Vercel (10 mins)

### 3.1 Sign Up
1. Go to https://vercel.com
2. Click "Sign Up with GitHub"
3. Authorize Vercel

### 3.2 Import Project
1. Click "Add New..." → "Project"
2. Find `ThangD/management-user-ai`
3. Click "Import"

### 3.3 Configure Build Settings
1. **Framework Preset:** Next.js (auto-detected)
2. **Root Directory:** `apps/web`
3. **Build Command:** `npm run build` (auto-detected)
4. **Output Directory:** `.next` (auto-detected)

### 3.4 Add Environment Variables
Click "Environment Variables" and add:

```
NEXT_PUBLIC_API_URL=<your Railway API URL from step 2.6>
NEXT_PUBLIC_GEMINI_API_KEY=<your Gemini API key (optional)>
```

**Example:**
```
NEXT_PUBLIC_API_URL=https://management-user-ai-production.up.railway.app
```

### 3.5 Deploy
1. Click "Deploy"
2. Wait 2-3 minutes
3. Vercel will show you the URL
4. **Copy your FRONTEND_URL** (e.g., `https://your-app.vercel.app`)

---

## Step 4: Update CORS (Important!)

Now that you have your frontend URL, update the backend CORS:

### 4.1 Update Railway CORS
1. Go back to Railway
2. Click on your API service
3. Go to "Variables" tab
4. Edit `CORS_ORIGIN` variable
5. Change from `*` to your Vercel URL:
   ```
   CORS_ORIGIN=https://your-app.vercel.app
   ```
6. Service will auto-redeploy

---

## Step 5: Test Your Live App! (5 mins)

### 5.1 Open Your App
Visit your Vercel URL: `https://your-app.vercel.app`

### 5.2 Test Login
```
Email: admin@example.com
Password: Admin@123
```

### 5.3 Test Features
- ✅ Dashboard loads
- ✅ View users
- ✅ Create new user
- ✅ Edit user
- ✅ Delete user
- ✅ Manage roles
- ✅ Manage permissions
- ✅ Logout

---

## 🎉 Success Checklist

- [ ] Code pushed to GitHub
- [ ] Railway account created
- [ ] PostgreSQL database deployed
- [ ] API service deployed
- [ ] API URL obtained
- [ ] Vercel account created
- [ ] Frontend deployed
- [ ] Frontend URL obtained
- [ ] CORS updated
- [ ] Login works
- [ ] All features tested

---

## 📋 Your Deployment URLs

Record your URLs here:

```
Frontend: https://________________________________.vercel.app
Backend:  https://________________________________.up.railway.app
Database: Railway PostgreSQL (managed)
```

---

## 🆘 Troubleshooting

### Issue: API Not Responding
**Check:**
```bash
# View Railway logs
# Go to Railway → API service → Deployments → Click latest → Logs

# Common issues:
# - DATABASE_URL incorrect format
# - JWT_SECRET missing
# - Build failed
```

### Issue: Frontend Can't Connect to API
**Check:**
```bash
# Verify environment variable
# Go to Vercel → Project → Settings → Environment Variables

# Should be:
NEXT_PUBLIC_API_URL=https://your-api.railway.app

# Redeploy if changed:
# Vercel → Deployments → Click "..." → Redeploy
```

### Issue: CORS Error
**Check:**
```bash
# Update Railway CORS_ORIGIN
CORS_ORIGIN=https://your-app.vercel.app

# Or temporarily for testing:
CORS_ORIGIN=*
```

### Issue: Database Connection Failed
**Check:**
```bash
# Verify DATABASE_URL format:
postgresql://postgres:password@host.railway.app:5432/railway

# Go to Railway → PostgreSQL → Variables → Copy DATABASE_URL
```

---

## 🔄 Auto-Deployment

Now that everything is set up:

```bash
# Make changes to your code
git add .
git commit -m "Add new feature"
git push origin main

# Railway and Vercel will automatically:
# ✅ Detect the push
# ✅ Build your code
# ✅ Deploy updates
# ✅ Zero downtime!
```

---

## 💰 Cost Breakdown

**FREE TIER LIMITS:**

**Railway:**
- $5 credit/month
- ~500 hours runtime
- 1GB PostgreSQL storage
- Enough for: Small apps, MVPs, testing

**Vercel:**
- 100GB bandwidth/month
- Unlimited deployments
- Unlimited sites
- Enough for: Most small to medium apps

**Total Cost: $0/month** for MVP! 🎉

---

## 📈 Next Steps

### Optional Enhancements:

**1. Custom Domain**
```bash
# Buy domain from:
# - Namecheap (~$10/year)
# - GoDaddy (~$12/year)

# Add to Vercel:
# Settings → Domains → Add Domain
```

**2. Monitoring**
```bash
# Built-in:
# - Railway Metrics (CPU, Memory, Network)
# - Vercel Analytics (Page views, Performance)

# Advanced:
# - Sentry (Error tracking)
# - LogRocket (Session replay)
```

**3. Email Notifications**
```bash
# Add email service:
# - SendGrid
# - Mailgun
# - AWS SES
```

---

## 🎯 You're Live!

**Congratulations!** 🎉

Your User Management System is now:
- ✅ Live and accessible worldwide
- ✅ Running on professional infrastructure
- ✅ Auto-deploying on code changes
- ✅ Backed up automatically
- ✅ Scaled automatically
- ✅ Monitored in real-time

**Share your app:**
```
🌐 https://your-app.vercel.app
```

**Total Time:** ~40 minutes
**Total Cost:** $0/month

Welcome to production! 🚀🌍

---

## 📞 Need Help?

1. Check Railway logs
2. Check Vercel deployment logs
3. Review `DEPLOYMENT_GUIDE.md`
4. Test API with curl
5. Check browser console

**You've got this! 💪**
