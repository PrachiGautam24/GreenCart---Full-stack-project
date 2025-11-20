# Security Setup Guide

## Installation

To install the security dependencies, run the following command in the `backend` directory:

```bash
npm install express-rate-limit helmet express-mongo-sanitize xss-clean
```

## Dependencies Added

1. **express-rate-limit** (^7.1.5) - Rate limiting middleware
2. **helmet** (^7.1.0) - Secure HTTP headers
3. **express-mongo-sanitize** (^2.2.0) - NoSQL injection prevention
4. **xss-clean** (^0.1.4) - XSS attack prevention

## What's Been Implemented

### 1. Rate Limiting (`middleware/rateLimiter.js`)
- Authentication endpoints: 5 requests per 15 minutes
- General API endpoints: 100 requests per 15 minutes
- Strict limiter: 10 requests per hour (for sensitive operations)

### 2. Input Sanitization (`utils/sanitize.js`)
- String sanitization (removes HTML/scripts)
- Email validation and sanitization
- Username validation (alphanumeric + underscore)
- MongoDB query sanitization
- File upload validation

### 3. Secure HTTP Headers (`server.js`)
- Helmet middleware configured with CSP
- Protects against common web vulnerabilities

### 4. Enhanced File Upload Security (`middleware/upload.js`)
- File type validation (JPEG, PNG, GIF, WebP only)
- File size limit (5MB)
- MIME type verification
- Extension matching
- Error handling middleware

### 5. Security Logging (`middleware/securityLogger.js`)
- Authentication attempt logging
- Admin action logging
- Rate limit violation logging
- File upload logging
- Suspicious activity tracking

## Files Modified

1. `server.js` - Added security middleware
2. `routes/auth.js` - Added rate limiting and logging
3. `routes/admin.js` - Added admin action logging
4. `routes/products.js` - Added file upload logging
5. `controllers/authController.js` - Added input sanitization
6. `controllers/productController.js` - Added input sanitization
7. `middleware/upload.js` - Enhanced file validation
8. `package.json` - Added security dependencies
9. `.env.example` - Updated with security notes

## Files Created

1. `middleware/rateLimiter.js` - Rate limiting configuration
2. `utils/sanitize.js` - Input sanitization utilities
3. `middleware/securityLogger.js` - Security logging utilities
4. `SECURITY.md` - Comprehensive security documentation
5. `SECURITY_SETUP.md` - This setup guide

## Testing

After installing dependencies, test the security features:

1. **Rate Limiting**: Make multiple rapid login attempts
2. **Input Sanitization**: Try submitting HTML/script tags in forms
3. **File Upload**: Attempt to upload non-image files
4. **JWT Verification**: Test with invalid/expired tokens

## Environment Variables

Ensure your `.env` file has a strong JWT secret:

```bash
# Generate a secure JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Then add it to your `.env` file:
```
JWT_SECRET=<generated-secret-here>
```

## Next Steps

1. Install dependencies: `npm install`
2. Update your `.env` file with a strong JWT_SECRET
3. Restart the server: `npm run dev`
4. Monitor logs for security events
5. Review `SECURITY.md` for detailed documentation

## Production Considerations

Before deploying to production:
- [ ] Use HTTPS/TLS encryption
- [ ] Set NODE_ENV=production
- [ ] Use strong, unique JWT_SECRET
- [ ] Configure proper CORS origins
- [ ] Set up monitoring and alerting
- [ ] Enable database encryption at rest
- [ ] Implement backup strategies
- [ ] Review and adjust rate limits based on traffic
- [ ] Set up Web Application Firewall (WAF)
- [ ] Regular security audits and dependency updates
