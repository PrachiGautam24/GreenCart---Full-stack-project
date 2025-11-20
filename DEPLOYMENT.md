# GreenCart Marketplace - Deployment Guide

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Production Environment Setup](#production-environment-setup)
3. [Backend Deployment](#backend-deployment)
4. [Frontend Deployment](#frontend-deployment)
5. [Post-Deployment Verification](#post-deployment-verification)
6. [Troubleshooting](#troubleshooting)

## Pre-Deployment Checklist

### Code Quality
- [ ] All tasks in implementation plan completed
- [ ] Code reviewed and tested
- [ ] No console.log statements in production code
- [ ] Error handling implemented for all API calls
- [ ] Input validation on both frontend and backend

### Security
- [ ] Strong JWT_SECRET generated (minimum 32 characters)
- [ ] Environment variables configured (no hardcoded secrets)
- [ ] CORS configured for production frontend URL
- [ ] Rate limiting enabled on authentication endpoints
- [ ] File upload validation implemented
- [ ] Security headers configured (Helmet.js)
- [ ] Input sanitization enabled (XSS, NoSQL injection)

### Database
- [ ] MongoDB Atlas cluster created (or production database ready)
- [ ] Database connection string obtained
- [ ] Database indexes created for performance
- [ ] Backup strategy in place

### External Services
- [ ] Cloudinary account created
- [ ] Cloudinary credentials obtained
- [ ] Image upload tested

### Testing
- [ ] User registration and login flows tested
- [ ] Product CRUD operations tested
- [ ] Shopping cart and checkout tested
- [ ] Review system tested
- [ ] Admin functions tested
- [ ] Mobile responsiveness verified

## Production Environment Setup

### Required Accounts

1. **MongoDB Atlas** (Database)
   - Sign up at https://www.mongodb.com/cloud/atlas
   - Create a free M0 cluster
   - Whitelist IP addresses (0.0.0.0/0 for all IPs or specific IPs)
   - Create database user with read/write permissions
   - Get connection string

2. **Cloudinary** (Image Storage)
   - Sign up at https://cloudinary.com
   - Get Cloud Name, API Key, and API Secret from dashboard

3. **Backend Hosting** (Choose one)
   - Railway: https://railway.app
   - Render: https://render.com
   - Heroku: https://heroku.com
   - AWS EC2, DigitalOcean, etc.

4. **Frontend Hosting** (Choose one)
   - Vercel: https://vercel.com
   - Netlify: https://netlify.com
   - Cloudflare Pages: https://pages.cloudflare.com

### Generate Production Secrets

Generate a strong JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Backend Deployment

### Option 1: Railway Deployment

1. **Install Railway CLI** (optional)
```bash
npm install -g @railway/cli
```

2. **Prepare Backend**
```bash
cd backend
```

3. **Create railway.json** (optional)
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

4. **Deploy via Railway Dashboard**
   - Go to https://railway.app
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Set root directory to `backend`
   - Add environment variables (see below)
   - Deploy

5. **Environment Variables for Railway**
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/greencart?retryWrites=true&w=majority
JWT_SECRET=<your-generated-secret>
JWT_EXPIRE=24h
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

6. **Get Backend URL**
   - Railway will provide a URL like: `https://your-app.railway.app`
   - Note this URL for frontend configuration

### Option 2: Render Deployment

1. **Create render.yaml** in backend directory
```yaml
services:
  - type: web
    name: greencart-api
    env: node
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 5000
      - key: MONGODB_URI
        sync: false
      - key: JWT_SECRET
        generateValue: true
      - key: JWT_EXPIRE
        value: 24h
      - key: CLOUDINARY_CLOUD_NAME
        sync: false
      - key: CLOUDINARY_API_KEY
        sync: false
      - key: CLOUDINARY_API_SECRET
        sync: false
      - key: FRONTEND_URL
        sync: false
```

2. **Deploy via Render Dashboard**
   - Go to https://render.com
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Set root directory to `backend`
   - Add environment variables
   - Deploy

### Option 3: Heroku Deployment

1. **Install Heroku CLI**
```bash
npm install -g heroku
```

2. **Login and Create App**
```bash
cd backend
heroku login
heroku create greencart-api
```

3. **Set Environment Variables**
```bash
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI="your-mongodb-uri"
heroku config:set JWT_SECRET="your-jwt-secret"
heroku config:set JWT_EXPIRE=24h
heroku config:set CLOUDINARY_CLOUD_NAME="your-cloud-name"
heroku config:set CLOUDINARY_API_KEY="your-api-key"
heroku config:set CLOUDINARY_API_SECRET="your-api-secret"
heroku config:set FRONTEND_URL="your-frontend-url"
```

4. **Create Procfile**
```
web: npm start
```

5. **Deploy**
```bash
git add .
git commit -m "Prepare for deployment"
git push heroku main
```

## Frontend Deployment

### Option 1: Vercel Deployment

1. **Prepare Frontend**
```bash
cd frontend
```

2. **Create vercel.json** (optional)
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

3. **Deploy via Vercel Dashboard**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Set root directory to `frontend`
   - Framework Preset: Vite
   - Add environment variable:
     - `VITE_API_URL` = `https://your-backend-url.railway.app/api`
   - Deploy

4. **Or Deploy via CLI**
```bash
npm install -g vercel
cd frontend
vercel
```

### Option 2: Netlify Deployment

1. **Create netlify.toml** in frontend directory
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

2. **Deploy via Netlify Dashboard**
   - Go to https://netlify.com
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Set base directory to `frontend`
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Add environment variable:
     - `VITE_API_URL` = `https://your-backend-url.railway.app/api`
   - Deploy

### Option 3: Cloudflare Pages

1. **Deploy via Cloudflare Dashboard**
   - Go to https://pages.cloudflare.com
   - Click "Create a project"
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set build output directory: `dist`
   - Set root directory: `frontend`
   - Add environment variable:
     - `VITE_API_URL` = `https://your-backend-url.railway.app/api`
   - Deploy

## Production Build Testing

### Test Frontend Build Locally

1. **Build the frontend**
```bash
cd frontend
npm run build
```

2. **Preview the build**
```bash
npm run preview
```

3. **Verify**
   - Check that all pages load correctly
   - Test navigation
   - Verify API calls work
   - Check console for errors

### Test Backend in Production Mode

1. **Set environment to production**
```bash
cd backend
# Create .env.production or set NODE_ENV=production in .env
```

2. **Start server**
```bash
npm start
```

3. **Test API endpoints**
```bash
# Health check
curl https://your-backend-url.railway.app/api/health

# Test authentication
curl -X POST https://your-backend-url.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## Post-Deployment Verification

### Critical User Flows to Test

1. **User Registration & Authentication**
   - [ ] Register new buyer account
   - [ ] Register new seller account
   - [ ] Login with valid credentials
   - [ ] Login with invalid credentials (should fail)
   - [ ] Access protected routes (should redirect if not logged in)
   - [ ] Logout functionality

2. **Product Browsing (Buyer)**
   - [ ] View all products on homepage
   - [ ] Search products by keyword
   - [ ] Filter by sustainability tags
   - [ ] Filter by city
   - [ ] View product details
   - [ ] View seller profile from product page

3. **Shopping Cart & Checkout (Buyer)**
   - [ ] Add product to cart
   - [ ] Update cart item quantity
   - [ ] Remove item from cart
   - [ ] View cart summary with correct total
   - [ ] Complete checkout process
   - [ ] View order history
   - [ ] View order details

4. **Product Management (Seller)**
   - [ ] Create new product with image upload
   - [ ] View own products in dashboard
   - [ ] Edit existing product
   - [ ] Delete product
   - [ ] View own seller profile

5. **Review System (Buyer)**
   - [ ] Submit review after purchase
   - [ ] View reviews on product page
   - [ ] View reviews on seller profile
   - [ ] Verify average rating calculation

6. **Admin Functions (Admin)**
   - [ ] View all users
   - [ ] Update user role
   - [ ] Activate/deactivate user account
   - [ ] Delete inappropriate product
   - [ ] Delete inappropriate review

### Performance Checks

- [ ] Page load times < 3 seconds
- [ ] Images load properly from Cloudinary
- [ ] API response times < 1 second
- [ ] Mobile responsiveness on various devices
- [ ] No console errors in browser

### Security Checks

- [ ] HTTPS enabled on both frontend and backend
- [ ] CORS properly configured
- [ ] Rate limiting working on auth endpoints
- [ ] JWT tokens expire correctly
- [ ] Protected routes require authentication
- [ ] Role-based access control working
- [ ] File upload restrictions enforced

## Monitoring & Maintenance

### Recommended Monitoring Tools

1. **Backend Monitoring**
   - Railway/Render/Heroku built-in logs
   - Sentry for error tracking
   - New Relic or DataDog for APM

2. **Frontend Monitoring**
   - Vercel Analytics
   - Google Analytics
   - Sentry for error tracking

3. **Database Monitoring**
   - MongoDB Atlas built-in monitoring
   - Set up alerts for high CPU/memory usage

### Regular Maintenance Tasks

- Monitor error logs weekly
- Review and rotate JWT secrets quarterly
- Update dependencies monthly
- Backup database regularly
- Review and optimize database indexes
- Monitor Cloudinary storage usage

## Troubleshooting

### Common Issues

**Issue: CORS errors in production**
- Solution: Ensure `FRONTEND_URL` in backend .env matches your deployed frontend URL exactly
- Check CORS configuration in `backend/server.js`

**Issue: Images not uploading**
- Solution: Verify Cloudinary credentials are correct
- Check file size limits (default 5MB)
- Verify Cloudinary storage quota

**Issue: Database connection fails**
- Solution: Check MongoDB Atlas IP whitelist
- Verify connection string format
- Ensure database user has correct permissions

**Issue: JWT authentication fails**
- Solution: Verify `JWT_SECRET` is set in production
- Check token expiration settings
- Clear browser localStorage and re-login

**Issue: Frontend can't reach backend API**
- Solution: Verify `VITE_API_URL` is set correctly
- Check backend is running and accessible
- Verify CORS configuration

**Issue: Build fails on deployment**
- Solution: Check Node.js version compatibility
- Verify all dependencies are in package.json
- Check build logs for specific errors

### Getting Help

- Check deployment platform documentation
- Review application logs
- Test API endpoints with Postman or curl
- Check browser console for frontend errors
- Verify environment variables are set correctly

## Rollback Procedure

If deployment fails or critical issues arise:

1. **Frontend Rollback**
   - Vercel/Netlify: Use dashboard to rollback to previous deployment
   - Or redeploy previous Git commit

2. **Backend Rollback**
   - Railway/Render: Use dashboard to rollback
   - Heroku: `heroku rollback`
   - Or redeploy previous Git commit

3. **Database Rollback**
   - Restore from MongoDB Atlas backup
   - Or use your backup strategy

## Success Criteria

Deployment is successful when:
- [ ] All user flows work end-to-end
- [ ] No critical errors in logs
- [ ] Performance meets requirements
- [ ] Security measures are active
- [ ] Monitoring is in place
- [ ] Documentation is complete

## Next Steps After Deployment

1. Seed production database with initial data (if needed)
2. Create admin account
3. Test with real users
4. Gather feedback
5. Monitor performance and errors
6. Plan iterative improvements

---

**Deployment Date:** _____________

**Deployed By:** _____________

**Backend URL:** _____________

**Frontend URL:** _____________

**Notes:** _____________
