# Production Environment Variables

This document provides templates and guidance for setting up environment variables in production.

## Backend Environment Variables

### Required Variables

Copy these to your production hosting platform (Railway, Render, Heroku, etc.):

```bash
# Server Configuration
NODE_ENV=production
PORT=5000

# Database Configuration
# Get this from MongoDB Atlas: Clusters → Connect → Connect your application
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/greencart?retryWrites=true&w=majority

# JWT Configuration
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
JWT_SECRET=<your-64-character-hex-string>
JWT_EXPIRE=24h

# Cloudinary Configuration
# Get these from: https://cloudinary.com/console
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>

# CORS Configuration
# Set this to your deployed frontend URL
FRONTEND_URL=https://your-app.vercel.app
```

### How to Generate JWT_SECRET

Run this command in your terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Example output (DO NOT use this, generate your own):
```
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

### MongoDB Atlas Setup

1. Go to https://cloud.mongodb.com
2. Create account or login
3. Create a new cluster (free M0 tier available)
4. Click "Connect" on your cluster
5. Choose "Connect your application"
6. Copy the connection string
7. Replace `<password>` with your database user password
8. Replace `<cluster>` with your cluster name
9. Ensure database name is `greencart`

Example:
```
mongodb+srv://greencart_user:MySecurePassword123@cluster0.abc123.mongodb.net/greencart?retryWrites=true&w=majority
```

### Cloudinary Setup

1. Go to https://cloudinary.com
2. Sign up for free account
3. Go to Dashboard
4. Copy the following from your dashboard:
   - Cloud Name
   - API Key
   - API Secret

### Security Checklist

- [ ] JWT_SECRET is at least 32 characters and randomly generated
- [ ] MongoDB password is strong (16+ characters, mixed case, numbers, symbols)
- [ ] Cloudinary API Secret is kept confidential
- [ ] FRONTEND_URL matches your actual frontend domain exactly
- [ ] NODE_ENV is set to "production"
- [ ] No secrets are committed to Git

## Frontend Environment Variables

### Required Variables

Set these in your frontend hosting platform (Vercel, Netlify, etc.):

```bash
# API Configuration
# Set this to your deployed backend URL + /api
VITE_API_URL=https://your-backend.railway.app/api
```

### Platform-Specific Instructions

#### Vercel

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add variable:
   - Name: `VITE_API_URL`
   - Value: `https://your-backend.railway.app/api`
4. Select all environments (Production, Preview, Development)
5. Click "Save"
6. Redeploy if needed

#### Netlify

1. Go to Site settings → Build & deploy → Environment
2. Click "Edit variables"
3. Add variable:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend.railway.app/api`
4. Click "Save"
5. Trigger new deploy

#### Cloudflare Pages

1. Go to Settings → Environment variables
2. Add variable for Production:
   - Variable name: `VITE_API_URL`
   - Value: `https://your-backend.railway.app/api`
3. Click "Save"
4. Redeploy

## Environment Variables Verification

### Backend Verification

After setting environment variables, verify they're loaded:

1. Add a health check endpoint (if not already present):

```javascript
// In backend/server.js or routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV,
    database: process.env.MONGODB_URI ? 'configured' : 'missing',
    cloudinary: process.env.CLOUDINARY_CLOUD_NAME ? 'configured' : 'missing',
    jwt: process.env.JWT_SECRET ? 'configured' : 'missing'
  });
});
```

2. Access the endpoint:
```bash
curl https://your-backend.railway.app/api/health
```

3. Expected response:
```json
{
  "status": "ok",
  "environment": "production",
  "database": "configured",
  "cloudinary": "configured",
  "jwt": "configured"
}
```

### Frontend Verification

1. Open browser console on your deployed frontend
2. Run:
```javascript
console.log('API URL:', import.meta.env.VITE_API_URL);
```

3. Should output your backend URL

## Common Issues

### Issue: "JWT_SECRET is not defined"

**Solution:**
- Verify JWT_SECRET is set in your hosting platform
- Restart your backend service
- Check for typos in variable name

### Issue: "Cannot connect to MongoDB"

**Solution:**
- Verify MONGODB_URI is correct
- Check MongoDB Atlas IP whitelist (add 0.0.0.0/0 for all IPs)
- Ensure database user has read/write permissions
- Verify password doesn't contain special characters that need URL encoding

### Issue: "CORS error when calling API"

**Solution:**
- Verify FRONTEND_URL in backend matches your frontend domain exactly
- Include protocol (https://)
- Don't include trailing slash
- Restart backend after changing

### Issue: "Cloudinary upload fails"

**Solution:**
- Verify all three Cloudinary variables are set correctly
- Check Cloudinary dashboard for API key status
- Ensure no extra spaces in variable values

## Environment Variables Template Files

### For Railway

Create `railway.json` in backend directory:

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

### For Render

Create `render.yaml` in backend directory:

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

### For Heroku

Create `Procfile` in backend directory:

```
web: npm start
```

Set variables via CLI:
```bash
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI="your-uri"
heroku config:set JWT_SECRET="your-secret"
# ... etc
```

## Security Best Practices

1. **Never commit .env files to Git**
   - Ensure .env is in .gitignore
   - Only commit .env.example with placeholder values

2. **Use strong secrets**
   - JWT_SECRET: 64+ characters, randomly generated
   - Database passwords: 16+ characters, mixed case, numbers, symbols

3. **Rotate secrets regularly**
   - Change JWT_SECRET every 3-6 months
   - Update database passwords quarterly
   - Regenerate API keys if compromised

4. **Limit access**
   - Only give team members access to production secrets when necessary
   - Use hosting platform's team features for access control

5. **Monitor usage**
   - Check Cloudinary usage regularly
   - Monitor MongoDB Atlas for unusual activity
   - Review access logs

## Backup Configuration

Keep a secure backup of your production environment variables:

1. Use a password manager (1Password, LastPass, etc.)
2. Store in encrypted document
3. Share with team leads only
4. Update backup when variables change

## Deployment Checklist

Before deploying, verify:

- [ ] All required backend variables are set
- [ ] All required frontend variables are set
- [ ] JWT_SECRET is strong and unique
- [ ] MONGODB_URI is correct and tested
- [ ] Cloudinary credentials are valid
- [ ] FRONTEND_URL matches deployed frontend
- [ ] VITE_API_URL matches deployed backend
- [ ] NODE_ENV is set to "production"
- [ ] No .env files are committed to Git
- [ ] Backup of variables is stored securely

---

**Last Updated:** _____________

**Updated By:** _____________
