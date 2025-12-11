# 🚀 Deploy for FREE in 30 Minutes!

## ✅ Quick Checklist

### 1️⃣ Database - Neon (5 mins)
- [ ] Go to https://neon.tech
- [ ] Sign up with GitHub (no card!)
- [ ] Create project: `management-users-db`
- [ ] On the dashboard, find **"Connection Details"** section
- [ ] Select **"Pooled connection"** from dropdown
- [ ] Copy the connection string (starts with `postgresql://...`)
- [ ] Save it - you'll need it for Render!

### 2️⃣ Backend - Railway (10 mins) ⭐ NO CARD REQUIRED
- [ ] Go to https://railway.app
- [ ] Sign up with GitHub (no card needed!)
- [ ] New Project → Deploy from GitHub repo
- [ ] Select your repository
- [ ] **IMPORTANT Configuration**:
  - Go to Settings → **Root Directory**: Set to `apps/api`
  - Go to Settings → **Builder**: Select **Nixpacks** (NOT Docker!)
  - Railway will auto-detect `railway.json` and use it
  - Leave Build Command and Start Command empty (railway.json handles this)
- [ ] Variables tab - Add these:
  ```
  DATABASE_URL = postgresql://... (from Neon)
  JWT_SECRET = (run: openssl rand -base64 32)
  NODE_ENV = production
  PORT = 3001
  ```
- [ ] Deploy (wait 5-10 mins)
- [ ] Settings → Generate Domain
- [ ] Copy API URL: `https://xxx.up.railway.app`
- [ ] Test: Visit `https://xxx.up.railway.app/api` (should show API docs)

**Alternative: Fly.io** (if Railway asks for card)
- [ ] Go to https://fly.io
- [ ] Sign up (no card for hobby tier)
- [ ] Install flyctl: `brew install flyctl` (Mac) or download
- [ ] Run: `cd apps/api && flyctl launch`
- [ ] Follow prompts, set environment variables
- [ ] Deploy: `flyctl deploy`

### 3️⃣ Frontend - Vercel (10 mins)
- [ ] Go to https://vercel.com
- [ ] Sign up with GitHub (no card!)
- [ ] New Project → Import your repo
- [ ] Settings:
  - Framework: Next.js
  - Root: `apps/web`
- [ ] Environment Variables:
  - `NEXT_PUBLIC_API_URL` = (paste from Render)
  - `NEXT_PUBLIC_GEMINI_API_KEY` = (your key)
- [ ] Deploy (wait 2-3 mins)
- [ ] Copy App URL: `https://xxx.vercel.app`

### 4️⃣ Test (5 mins)
- [ ] Open your app URL
- [ ] Login: `admin@example.com` / `admin123`
- [ ] Create a user
- [ ] Edit the user
- [ ] Delete the user
- [ ] Works? 🎉 YOU'RE LIVE!

---

## 💰 Cost Breakdown

| Service | Cost | Limits |
|---------|------|--------|
| Neon (Database) | **$0** | 0.5GB storage |
| Railway (Backend) | **$0** | $5 credit/month (enough!) |
| Vercel (Frontend) | **$0** | Unlimited |
| **TOTAL** | **$0/month** | ✅ NO CARD NEEDED |

---

## ⚡ Before You Start

```bash
# 1. Make sure everything works locally
cd apps/api && npm run build
cd apps/web && npm run build

# 2. Push to GitHub
git add .
git commit -m "feat: ready for deployment"
git push origin main

# 3. Generate JWT secret (save this)
openssl rand -base64 32
```

---

## 🆘 Common Issues

**Railway: Out of credits**
- You get $5/month free credits
- Should be enough for small apps
- Optimize by setting sleep after inactivity

**Vercel: CORS error**
- Add your Vercel URL to CORS in `apps/api/src/main.ts`
- Redeploy backend

**Can't login**
- Wait for first API request to complete (30s)
- Check browser console for errors
- Check API URL in Vercel env vars

---

## 🎯 You're Ready!

Time needed: **30 minutes**
Cost: **$0**
Difficulty: **Easy**

Go to [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions!

Let's go LIVE! 🚀
