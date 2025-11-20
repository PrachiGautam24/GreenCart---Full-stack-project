# Deploy GreenCart Without npm - Step by Step

Since you don't have npm/Node.js locally, you'll deploy directly through hosting platforms' web interfaces. They'll build your code for you!

## Prerequisites

✅ Code is committed to Git (Done!)

Now you need:
1. GitHub account
2. Hosting platform accounts (free)

---

## Step 1: Push to GitHub (5 minutes)

### 1.1 Create GitHub Repository

1. Go to https://github.com
2. Click "+" → "New repository"
3. Name: `greencart-marketplace`
4. Keep it Public or Private (your choice)
5. **Don't** initialize with README (we already have one)
6. Click "Create repository"

### 1.2 Push Your Code

GitHub will show you commands. Run these in your terminal:

```bash
git remote add origin https://github.com/YOUR_USERNAME/greencart-marketplace.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username.

---

## Step 2: Setup External Services (10 minutes)

### 2.1 MongoDB Atlas (Database)

1. Go to https://cloud.mongodb.com
2. Sign up / Login
3. Click "Build a Database"
4. Choose **FREE** M0 tier
5. Choose a cloud provider and region (any)
6. Cluster Name: `greencart` (or keep default)
7. Click "Create"
8. **Create Database User:**
   - Username: `greencart_user`
   - Password: Click "Autogenerate Secure Password" and **SAVE IT**
9. **Add IP Address:**
   - Click "Add My Current IP Address"
   - Also add `0.0.0.0/0` (allows from anywhere)
10. Click "Finish and Close"
11. Click "Connect" → "Connect your application"
12. Copy the connection string (looks like: `mongodb+srv://greencart_user:<password>@...`)
13. Replace `<password>` with your actual password
14. **SAVE THIS CONNECTION STRING** - you'll need it!

### 2.2 Cloudinary (Image Storage)

1. Go to https://cloudinary.com
2. Sign up for free account
3. After signup, go to Dashboard
4. **SAVE THESE VALUES:**
   - Cloud Name: `dxxxxx`
   - API Key: `123456789012345`
   - API Secret: `abcdefghijklmnopqrstuvwxyz`

---

## Step 3: Deploy Backend to Railway (10 minutes)

### 3.1 Create Railway Account

1. Go to https://railway.app
2. Click "Login" → "Login with GitHub"
3. Authorize Railway

### 3.2 Deploy Backend

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Select your `greencart-marketplace` repository
4. Railway will detect it's a Node.js project

### 3.3 Configure Backend Service

1. Click on the deployed service
2. Go to "Settings" tab
3. Change "Root Directory" to `backend`
4. Click "Variables" tab
5. Add these environment variables (click "New Variable" for each):

```
NODE_ENV = production
PORT = 5000
MONGODB_URI = <paste your MongoDB connection string>
JWT_SECRET = <generate random 64-character string>
JWT_EXPIRE = 24h
CLOUDINARY_CLOUD_NAME = <your cloudinary cloud name>
CLOUDINARY_API_KEY = <your cloudinary api key>
CLOUDINARY_API_SECRET = <your cloudinary api secret>
FRONTEND_URL = https://your-app.vercel.app
```

**For JWT_SECRET:** Use a password generator or random string generator online (64 characters)

**For FRONTEND_URL:** We'll update this after deploying frontend

6. Click "Deploy" or wait for auto-deploy

### 3.4 Get Backend URL

1. Go to "Settings" → "Networking"
2. Click "Generate Domain"
3. Copy the URL (e.g., `https://greencart-production.up.railway.app`)
4. **SAVE THIS URL** - you'll need it for frontend!

---

## Step 4: Deploy Frontend to Vercel (5 minutes)

### 4.1 Create Vercel Account

1. Go to https://vercel.com
2. Click "Sign Up" → "Continue with GitHub"
3. Authorize Vercel

### 4.2 Deploy Frontend

1. Click "Add New..." → "Project"
2. Import your `greencart-marketplace` repository
3. Configure project:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `dist` (auto-detected)

### 4.3 Add Environment Variable

1. Expand "Environment Variables"
2. Add variable:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://your-backend-url.railway.app/api`
   - (Use the Railway URL from Step 3.4, add `/api` at the end)
3. Click "Deploy"

### 4.4 Get Frontend URL

1. Wait for deployment to complete (2-3 minutes)
2. Vercel will show your URL (e.g., `https://greencart-marketplace.vercel.app`)
3. **SAVE THIS URL**

---

## Step 5: Update Backend with Frontend URL (2 minutes)

1. Go back to Railway dashboard
2. Click on your backend service
3. Go to "Variables" tab
4. Find `FRONTEND_URL` variable
5. Update it with your Vercel URL (e.g., `https://greencart-marketplace.vercel.app`)
6. Save - Railway will auto-redeploy

---

## Step 6: Verify Deployment (5 minutes)

### 6.1 Test Backend

Open in browser: `https://your-backend-url.railway.app/api/health`

Should see: `{"status":"ok"}`

### 6.2 Test Frontend

1. Open your Vercel URL in browser
2. You should see the GreenCart homepage
3. Try to register a new account
4. If registration works, deployment is successful!

---

## Troubleshooting

### Backend won't start

**Check Railway logs:**
1. Go to Railway dashboard
2. Click your service
3. Click "Deployments" tab
4. Click latest deployment
5. Check logs for errors

**Common issues:**
- MongoDB connection string incorrect
- Missing environment variables
- Wrong root directory (should be `backend`)

### Frontend shows errors

**Check Vercel logs:**
1. Go to Vercel dashboard
2. Click your project
3. Click "Deployments"
4. Click latest deployment
5. Check build logs

**Common issues:**
- `VITE_API_URL` not set or incorrect
- Backend URL doesn't end with `/api`
- Backend not deployed yet

### CORS errors

- Make sure `FRONTEND_URL` in Railway matches your Vercel URL exactly
- No trailing slash
- Include `https://`

---

## Summary of URLs

After deployment, you'll have:

- **Frontend:** `https://your-app.vercel.app`
- **Backend:** `https://your-app.railway.app`
- **Database:** MongoDB Atlas (managed)
- **Images:** Cloudinary (managed)

---

## Next Steps

1. **Seed Database:** You'll need to run seed script manually or create admin account through registration
2. **Test All Features:** Follow TESTING_GUIDE.md
3. **Monitor:** Check Railway and Vercel dashboards for errors
4. **Custom Domain:** (Optional) Add custom domain in Vercel settings

---

## Cost

- **MongoDB Atlas:** Free (M0 tier)
- **Cloudinary:** Free (25GB storage)
- **Railway:** $5/month credit (usually enough for small apps)
- **Vercel:** Free (hobby plan)

**Total: $0-5/month**

---

## Need Help?

If you get stuck:
1. Check the error logs in Railway/Vercel
2. Verify all environment variables are set correctly
3. Make sure MongoDB Atlas IP whitelist includes 0.0.0.0/0
4. Ensure backend is deployed before frontend

---

**Deployment Complete!** 🎉

Your GreenCart Marketplace is now live on the internet!
