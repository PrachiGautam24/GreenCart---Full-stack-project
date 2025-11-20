# Pre-Deployment Checklist

Complete this checklist before deploying GreenCart to production.

**Deployment Date:** _____________  
**Deployment Manager:** _____________  
**Target Environment:** Production

---

## 1. Code Quality & Completeness

### Implementation
- [ ] All tasks in `.kiro/specs/greencart-marketplace/tasks.md` marked complete
- [ ] All features from requirements document implemented
- [ ] No TODO or FIXME comments in production code
- [ ] No commented-out code blocks
- [ ] No console.log statements in production code
- [ ] Code follows consistent style and conventions

### Documentation
- [ ] README.md is up to date
- [ ] API endpoints documented
- [ ] Environment variables documented
- [ ] Deployment guide reviewed (DEPLOYMENT.md)
- [ ] Testing guide reviewed (TESTING_GUIDE.md)

---

## 2. Testing

### Manual Testing
- [ ] All user flows tested (see TESTING_GUIDE.md)
- [ ] Buyer journey: register → browse → cart → checkout → review ✓
- [ ] Seller journey: create product → manage → view profile ✓
- [ ] Admin journey: manage users → moderate content ✓
- [ ] Integration test checklist completed (INTEGRATION_TEST_CHECKLIST.md)

### Automated Testing (if applicable)
- [ ] Backend unit tests pass
- [ ] Frontend unit tests pass
- [ ] Integration tests pass
- [ ] No failing tests

### Cross-Browser Testing
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

### Responsive Testing
- [ ] Mobile (375px) - iPhone SE
- [ ] Mobile (414px) - iPhone Pro Max
- [ ] Tablet (768px) - iPad
- [ ] Desktop (1920px) - Full HD

---

## 3. Security

### Authentication & Authorization
- [ ] JWT secret is strong (32+ characters, randomly generated)
- [ ] JWT expiration configured (24h)
- [ ] Password hashing with bcrypt implemented
- [ ] Protected routes require authentication
- [ ] Role-based access control working
- [ ] Admin routes restricted to admin users only
- [ ] Seller routes restricted to sellers/admins only

### Input Validation & Sanitization
- [ ] All user inputs validated on backend
- [ ] XSS prevention implemented (input sanitization)
- [ ] NoSQL injection prevention implemented
- [ ] File upload validation (type, size, MIME)
- [ ] Email format validation
- [ ] Password strength requirements enforced

### Security Headers & Middleware
- [ ] Helmet.js configured for secure headers
- [ ] CORS configured with specific origin (not *)
- [ ] Rate limiting on authentication endpoints (5 attempts per 15 min)
- [ ] Rate limiting on sensitive endpoints
- [ ] Security logging implemented

### Data Protection
- [ ] Passwords never stored in plain text
- [ ] Sensitive data not logged
- [ ] Database connection string secured
- [ ] API keys not exposed in frontend code
- [ ] .env files not committed to Git

---

## 4. Environment Configuration

### Backend Environment Variables
- [ ] NODE_ENV=production
- [ ] PORT configured
- [ ] MONGODB_URI set (MongoDB Atlas)
- [ ] JWT_SECRET generated and set
- [ ] JWT_EXPIRE configured
- [ ] CLOUDINARY_CLOUD_NAME set
- [ ] CLOUDINARY_API_KEY set
- [ ] CLOUDINARY_API_SECRET set
- [ ] FRONTEND_URL set to production frontend URL

### Frontend Environment Variables
- [ ] VITE_API_URL set to production backend URL

### Verification
- [ ] All required variables documented in PRODUCTION_ENV.md
- [ ] Variables tested in staging/preview environment
- [ ] No hardcoded secrets in code
- [ ] Backup of production variables stored securely

---

## 5. Database

### MongoDB Atlas Setup
- [ ] Production cluster created
- [ ] Database user created with strong password
- [ ] IP whitelist configured (0.0.0.0/0 or specific IPs)
- [ ] Connection string tested
- [ ] Database indexes created for performance
- [ ] Backup strategy configured

### Data
- [ ] Database schema matches models
- [ ] Seed data script available (if needed)
- [ ] Test data removed from production database
- [ ] Admin account created for production

---

## 6. External Services

### Cloudinary
- [ ] Account created
- [ ] API credentials obtained
- [ ] Upload preset configured (if needed)
- [ ] Storage quota checked
- [ ] Image transformations tested

### Hosting Platforms
- [ ] Backend hosting account created (Railway/Render/Heroku)
- [ ] Frontend hosting account created (Vercel/Netlify)
- [ ] Billing/payment method configured (if required)
- [ ] Domain name configured (if custom domain)

---

## 7. Build & Deployment

### Frontend Build
- [ ] Production build completes without errors
  ```bash
  cd frontend && npm run build
  ```
- [ ] Build output verified (dist folder)
- [ ] Build preview tested locally
  ```bash
  npm run preview
  ```
- [ ] No console errors in preview
- [ ] All pages load correctly
- [ ] Assets load from correct paths
- [ ] Bundle size is reasonable (<500KB JS)

### Backend Preparation
- [ ] Dependencies up to date
- [ ] package.json scripts configured
  - [ ] "start" script for production
  - [ ] "dev" script for development
- [ ] No dev dependencies in production
- [ ] Server starts without errors
- [ ] Health check endpoint working

### Deployment Files
- [ ] .gitignore configured (excludes .env, node_modules)
- [ ] Procfile created (if using Heroku)
- [ ] railway.json created (if using Railway)
- [ ] render.yaml created (if using Render)
- [ ] vercel.json created (if using Vercel)
- [ ] netlify.toml created (if using Netlify)

---

## 8. Performance

### Frontend Performance
- [ ] Lighthouse score: Performance 80+
- [ ] Lighthouse score: Accessibility 90+
- [ ] Lighthouse score: Best Practices 90+
- [ ] Lighthouse score: SEO 80+
- [ ] Images optimized
- [ ] Code splitting implemented
- [ ] Lazy loading for routes

### Backend Performance
- [ ] Database queries optimized
- [ ] Indexes created on frequently queried fields
- [ ] Pagination implemented (20 items per page)
- [ ] API response times < 1 second
- [ ] No N+1 query problems

### Monitoring
- [ ] Error tracking configured (Sentry, etc.)
- [ ] Logging configured
- [ ] Performance monitoring planned

---

## 9. Error Handling

### Frontend
- [ ] Error boundary component implemented
- [ ] API error handling in all services
- [ ] User-friendly error messages
- [ ] Loading states for async operations
- [ ] 404 page for invalid routes
- [ ] Network error handling

### Backend
- [ ] Global error handler middleware
- [ ] Consistent error response format
- [ ] Validation errors handled
- [ ] Database errors handled
- [ ] Authentication errors handled
- [ ] No stack traces in production responses

---

## 10. User Experience

### UI/UX
- [ ] All forms have validation
- [ ] Success notifications implemented
- [ ] Loading spinners during operations
- [ ] Disabled states on buttons during submission
- [ ] Confirmation dialogs for destructive actions
- [ ] Breadcrumbs or clear navigation
- [ ] Accessible (keyboard navigation, ARIA labels)

### Content
- [ ] All placeholder text replaced
- [ ] Images have alt text
- [ ] Error messages are helpful
- [ ] Success messages are clear
- [ ] Empty states handled (empty cart, no products, etc.)

---

## 11. Legal & Compliance

- [ ] Privacy policy created (if collecting user data)
- [ ] Terms of service created
- [ ] Cookie policy (if using cookies)
- [ ] GDPR compliance considered (if applicable)
- [ ] Data retention policy defined
- [ ] User data deletion process defined

---

## 12. Deployment Process

### Pre-Deployment
- [ ] All team members notified
- [ ] Deployment window scheduled
- [ ] Rollback plan prepared
- [ ] Backup of current production (if updating)

### Deployment Steps
- [ ] Deploy backend first
- [ ] Verify backend health check
- [ ] Update frontend environment variables
- [ ] Deploy frontend
- [ ] Verify frontend can reach backend

### Post-Deployment
- [ ] Run post-deployment verification (see section 13)
- [ ] Monitor error logs for 1 hour
- [ ] Test critical user flows in production
- [ ] Verify all integrations working

---

## 13. Post-Deployment Verification

### Smoke Tests
- [ ] Homepage loads
- [ ] User can register
- [ ] User can login
- [ ] Products page loads
- [ ] Product detail page loads
- [ ] Cart functionality works
- [ ] Checkout completes
- [ ] Admin panel accessible (admin only)

### Integration Tests
- [ ] Database connection working
- [ ] Cloudinary uploads working
- [ ] JWT authentication working
- [ ] CORS configured correctly
- [ ] Rate limiting active

### Monitoring
- [ ] Check error logs (no critical errors)
- [ ] Check performance metrics
- [ ] Verify SSL certificate (HTTPS)
- [ ] Test from different locations/networks

---

## 14. Documentation & Handoff

### Documentation Complete
- [ ] README.md updated with production URLs
- [ ] DEPLOYMENT.md reviewed
- [ ] TESTING_GUIDE.md available
- [ ] PRODUCTION_ENV.md available
- [ ] API documentation available
- [ ] Troubleshooting guide available

### Team Handoff
- [ ] Production credentials shared securely
- [ ] Monitoring access granted
- [ ] On-call rotation defined
- [ ] Escalation process documented
- [ ] Support contact information shared

---

## 15. Rollback Plan

### Rollback Preparation
- [ ] Previous version tagged in Git
- [ ] Database backup available
- [ ] Rollback procedure documented
- [ ] Rollback tested in staging

### Rollback Triggers
Define when to rollback:
- [ ] Critical security vulnerability discovered
- [ ] Data loss or corruption
- [ ] Complete service outage
- [ ] Critical functionality broken
- [ ] Performance degradation >50%

---

## 16. Success Criteria

Deployment is successful when:
- [ ] All critical user flows work end-to-end
- [ ] No critical errors in logs (first hour)
- [ ] Performance meets targets (page load < 3s)
- [ ] Security measures verified active
- [ ] All integrations working
- [ ] Team can access monitoring/logs
- [ ] Users can successfully use the platform

---

## Final Sign-Off

### Development Team
- [ ] **Developer:** _____________ Date: _______
- [ ] **Code Review:** _____________ Date: _______

### QA Team
- [ ] **QA Lead:** _____________ Date: _______
- [ ] **Testing Complete:** _____________ Date: _______

### Operations Team
- [ ] **DevOps:** _____________ Date: _______
- [ ] **Infrastructure Ready:** _____________ Date: _______

### Management
- [ ] **Project Manager:** _____________ Date: _______
- [ ] **Deployment Approved:** ☐ YES ☐ NO

---

## Deployment Execution

**Deployment Started:** _____________ (Date/Time)  
**Backend Deployed:** _____________ (Date/Time)  
**Frontend Deployed:** _____________ (Date/Time)  
**Verification Complete:** _____________ (Date/Time)  
**Deployment Complete:** _____________ (Date/Time)

**Backend URL:** _____________  
**Frontend URL:** _____________

**Issues Encountered:**
1. _____________________________________________
2. _____________________________________________
3. _____________________________________________

**Resolution:**
1. _____________________________________________
2. _____________________________________________
3. _____________________________________________

**Final Status:** ☐ SUCCESS ☐ PARTIAL ☐ FAILED

**Notes:**
_____________________________________________
_____________________________________________
_____________________________________________

---

## Post-Deployment Monitoring (First 24 Hours)

### Hour 1
- [ ] No critical errors
- [ ] Performance acceptable
- [ ] User registrations working

### Hour 6
- [ ] Error rate < 1%
- [ ] No user complaints
- [ ] All features working

### Hour 24
- [ ] System stable
- [ ] Performance metrics normal
- [ ] Ready for full release

**Monitoring Sign-Off:** _____________ Date: _______

---

**Deployment Status:** ☐ COMPLETE ☐ IN PROGRESS ☐ BLOCKED

**Next Steps:**
1. _____________________________________________
2. _____________________________________________
3. _____________________________________________
