# Vercel Environment Variable Fix

## Issue
405 Method Not Allowed error when calling API from Vercel deployment.

## Root Cause
`NEXT_PUBLIC_API_URL` environment variable not properly set in Vercel.

## Solution

### 1. Set Environment Variable in Vercel
1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://management-user-ai-production.up.railway.app`
   - **Environment**: Production, Preview, Development (check all)
4. Click **Save**

### 2. Redeploy
After setting the env var, you MUST redeploy:
- Go to **Deployments** tab
- Click the **3 dots** on latest deployment
- Click **Redeploy**

OR just push a new commit to trigger redeployment.

### 3. Verify
After redeployment, open browser console and check:
```javascript
console.log(process.env.NEXT_PUBLIC_API_URL)
```

It should show: `https://management-user-ai-production.up.railway.app`

## Important Notes
- Environment variables starting with `NEXT_PUBLIC_` are embedded at BUILD time
- Changing them requires a REBUILD/REDEPLOY
- They are exposed to the browser (so don't put secrets there)
