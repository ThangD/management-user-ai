# 🚀 Deployment Progress Tracker

Use this checklist to track your deployment progress!

## ✅ Pre-Deployment (Complete!)

- [x] Application built and tested
- [x] All features working locally
- [x] Code committed to Git
- [x] Documentation created
- [x] Deployment configs ready

---

## 📤 Step 1: Push to GitHub (2 mins)

- [ ] Run: `git push origin main`
- [ ] Verify push successful
- [ ] Check repository on GitHub

**Commands:**
```bash
git push origin main
```

**Verification:**
Visit: https://github.com/ThangD/management-user-ai

---

## 🚂 Step 2: Deploy Backend to Railway (15 mins)

### Account Setup
- [ ] Sign up at https://railway.app
- [ ] Connect GitHub account
- [ ] Verify email

### PostgreSQL Database
- [ ] Create new project
- [ ] Provision PostgreSQL
- [ ] Copy DATABASE_URL
- [ ] Save URL somewhere safe

**DATABASE_URL format:**
```
postgresql://postgres:xxx@xxx.railway.app:5432/railway
```

### API Service
- [ ] Create new service
- [ ] Connect to GitHub repo: `ThangD/management-user-ai`
- [ ] Set root directory: `apps/api`
- [ ] Verify build command: `npm install && npm run build`
- [ ] Verify start command: `npm run start:prod`

### Environment Variables
Add these in Railway Variables tab:

- [ ] `NODE_ENV=production`
- [ ] `PORT=3001`
- [ ] `DATABASE_URL=<paste from database>`
- [ ] `JWT_SECRET=<generate with: openssl rand -base64 32>`
- [ ] `JWT_EXPIRES_IN=7d`
- [ ] `CORS_ORIGIN=*` (will update later)

### Domain
- [ ] Generate domain
- [ ] Copy API URL
- [ ] Save URL: ___________________________________

### Verification
- [ ] Check deployment logs
- [ ] Test health endpoint: `curl https://your-api.railway.app/health`
- [ ] Should return: `{"status":"ok"}`

---

## ▲ Step 3: Deploy Frontend to Vercel (10 mins)

### Account Setup
- [ ] Sign up at https://vercel.com
- [ ] Connect GitHub account
- [ ] Verify email

### Import Project
- [ ] Click "Add New..." → "Project"
- [ ] Find repository: `ThangD/management-user-ai`
- [ ] Click "Import"

### Configure Project
- [ ] Verify Framework: Next.js
- [ ] Set Root Directory: `apps/web`
- [ ] Verify Build Command: `npm run build`
- [ ] Verify Output Directory: `.next`

### Environment Variables
Add these in Vercel Environment Variables:

- [ ] `NEXT_PUBLIC_API_URL=<your Railway API URL>`
- [ ] `NEXT_PUBLIC_GEMINI_API_KEY=<optional>`

**Example:**
```
NEXT_PUBLIC_API_URL=https://management-user-ai-production.up.railway.app
```

### Deploy
- [ ] Click "Deploy"
- [ ] Wait for deployment (2-3 mins)
- [ ] Copy frontend URL
- [ ] Save URL: ___________________________________

---

## 🔧 Step 4: Update CORS (5 mins)

### Update Railway Backend
- [ ] Go back to Railway
- [ ] Open API service
- [ ] Go to Variables tab
- [ ] Edit `CORS_ORIGIN`
- [ ] Change from `*` to your Vercel URL
- [ ] Example: `https://your-app.vercel.app`
- [ ] Service will auto-redeploy

---

## 🧪 Step 5: Test Live Application (5 mins)

### Access Application
- [ ] Visit your Vercel URL
- [ ] Page loads successfully
- [ ] No console errors

### Test Login
- [ ] Email: `admin@example.com`
- [ ] Password: `Admin@123`
- [ ] Login successful
- [ ] Redirected to dashboard

### Test Dashboard
- [ ] Dashboard loads
- [ ] Stats display correctly
- [ ] Navigation works

### Test User Management
- [ ] View users list
- [ ] Create new user
- [ ] Edit existing user
- [ ] Delete user (with confirmation)
- [ ] All operations successful

### Test Role Management
- [ ] View roles list
- [ ] Create new role
- [ ] Edit existing role
- [ ] Delete role
- [ ] Assign role to user

### Test Permission Management
- [ ] View permissions list
- [ ] Create new permission
- [ ] Edit existing permission
- [ ] Assign permission to role

### Test Logout
- [ ] Click logout
- [ ] Redirected to login
- [ ] Cannot access dashboard without login

---

## 🎉 Step 6: Final Touches (Optional)

### Custom Domain (Optional)
- [ ] Purchase domain ($10-15/year)
- [ ] Add to Vercel: Settings → Domains
- [ ] Update DNS records
- [ ] Wait for SSL certificate

### Monitoring
- [ ] Check Railway metrics
- [ ] Check Vercel analytics
- [ ] Setup error tracking (optional)

### Documentation
- [ ] Update README with live URLs
- [ ] Share with team
- [ ] Document any custom changes

---

## 📝 Record Your URLs

Write down your live URLs here:

**Production URLs:**
```
Frontend:  https://_____________________________________.vercel.app
Backend:   https://_____________________________________.railway.app
Database:  Railway PostgreSQL (managed)
```

**Admin Credentials:**
```
Email:     admin@example.com
Password:  Admin@123
```

**Important Tokens:**
```
JWT Secret:      ___________________________________
Gemini API Key:  ___________________________________
GitHub Token:    ___________________________________
```

---

## ✅ Success Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Database connected and seeded
- [ ] CORS configured correctly
- [ ] All features tested and working
- [ ] No console errors
- [ ] No build errors
- [ ] Documentation updated
- [ ] URLs recorded

---

## 🎊 Deployment Complete!

When all items above are checked, you're LIVE! 🚀

**Time Spent:** _____ minutes
**Issues Encountered:** _________________________________
**Notes:** _____________________________________________

---

## 🆘 Troubleshooting

If something doesn't work, check:

1. **Backend Issues:**
   - [ ] Railway logs for errors
   - [ ] DATABASE_URL format correct
   - [ ] All environment variables set
   - [ ] Build succeeded

2. **Frontend Issues:**
   - [ ] Vercel deployment logs
   - [ ] NEXT_PUBLIC_API_URL correct
   - [ ] Build succeeded
   - [ ] No console errors

3. **Connection Issues:**
   - [ ] CORS_ORIGIN matches frontend URL
   - [ ] API URL accessible
   - [ ] No network errors in browser

4. **Database Issues:**
   - [ ] Railway PostgreSQL running
   - [ ] Connection string correct
   - [ ] Migrations ran successfully
   - [ ] Seeds ran successfully

---

## 📞 Need Help?

Review these documents:
- DEPLOY_NOW.md (detailed steps)
- DEPLOYMENT_GUIDE.md (comprehensive guide)
- TESTING_GUIDE.md (testing help)

---

**🎉 Congratulations on deploying your app!** 🎉

Share your live URL: https://_________________________________.vercel.app

**You did it! 🚀🌍**
