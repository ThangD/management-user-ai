# 🚀 Deploy for FREE in 30 Minutes!

## ✅ Quick Checklist

### 1️⃣ Database - Neon (5 mins)
- [ ] Go to https://neon.tech
- [ ] Sign up with GitHub (no card!)
- [ ] Create project: `management-users-db`
- [ ] Copy connection string
- [ ] Save for later

### 2️⃣ Backend - Render (10 mins)
- [ ] Go to https://render.com
- [ ] Sign up with GitHub (no card!)
- [ ] New Web Service → Connect your repo
- [ ] Settings:
  - Name: `management-users-api`
  - Root: `apps/api`
  - Build: `npm install && npm run build`
  - Start: `npm run start:prod`
- [ ] Environment Variables:
  - `DATABASE_URL` = (paste from Neon)
  - `JWT_SECRET` = (run: `openssl rand -base64 32`)
  - `NODE_ENV` = `production`
  - `PORT` = `3001`
- [ ] Deploy (wait 5-10 mins)
- [ ] Copy API URL: `https://xxx.onrender.com`

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
| Render (Backend) | **$0** | 750 hours/month |
| Vercel (Frontend) | **$0** | Unlimited |
| **TOTAL** | **$0/month** | ✅ Forever FREE |

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

**Render: First request is slow (30s)**
- This is normal for FREE tier
- Service "wakes up" after idle
- Upgrade to $7/month for always-on

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
