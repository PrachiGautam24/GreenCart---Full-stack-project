# Security Enhancements

This document outlines the security measures implemented in the GreenCart Marketplace backend.

## 1. Rate Limiting

### Authentication Endpoints
- **Limit**: 5 requests per 15 minutes per IP
- **Endpoints**: `/api/auth/register`, `/api/auth/login`
- **Purpose**: Prevent brute force attacks on authentication

### General API Endpoints
- **Limit**: 100 requests per 15 minutes per IP
- **Endpoints**: All `/api/*` routes
- **Purpose**: Prevent API abuse and DDoS attacks

### Strict Rate Limiting
- **Limit**: 10 requests per hour per IP
- **Purpose**: Available for sensitive operations requiring stricter limits

## 2. Input Sanitization

### XSS Prevention
- All text inputs are sanitized to remove HTML tags and script content
- Special characters are encoded to prevent XSS attacks
- Implemented in `utils/sanitize.js`

### NoSQL Injection Prevention
- MongoDB queries are sanitized using `express-mongo-sanitize`
- User input is validated to remove `$` operators
- Query parameters are sanitized before database operations

### Input Validation
- **Email**: Validated format and converted to lowercase
- **Username**: Alphanumeric and underscore only, 3-30 characters
- **Text Fields**: HTML tags removed, special characters encoded
- **File Uploads**: Type, size, and extension validation

## 3. Secure HTTP Headers

Using `helmet.js` to set secure HTTP headers:
- **Content Security Policy**: Restricts resource loading
- **X-Content-Type-Options**: Prevents MIME type sniffing
- **X-Frame-Options**: Prevents clickjacking
- **X-XSS-Protection**: Enables browser XSS protection
- **Strict-Transport-Security**: Enforces HTTPS

## 4. File Upload Security

### Validation
- **File Types**: Only JPEG, PNG, GIF, WebP images allowed
- **File Size**: Maximum 5MB per file
- **File Count**: Maximum 5 files per request
- **MIME Type Verification**: Extension must match MIME type

### Processing
- Files stored in memory temporarily
- Uploaded to Cloudinary cloud storage
- Temporary files deleted after upload
- No direct file system access from user input

## 5. JWT Security

### Token Configuration
- Tokens expire after 24 hours (configurable)
- Signed with strong secret key (stored in environment variables)
- Verified on all protected routes
- User ID encoded in token payload

### Best Practices
- Store JWT_SECRET in environment variables
- Use strong, random secret keys (minimum 32 characters)
- Rotate secrets periodically in production
- Never expose secrets in code or logs

## 6. Password Security

### Hashing
- Passwords hashed using bcrypt with salt rounds
- Passwords never stored in plain text
- Password comparison done using bcrypt's secure compare

### Requirements
- Minimum 6 characters (can be increased)
- Validated on registration and password changes

## 7. CORS Configuration

- Configured to allow only specified frontend origin
- Credentials enabled for cookie-based authentication
- Prevents unauthorized cross-origin requests

## 8. Environment Variables

Required environment variables for security:
```
JWT_SECRET=<strong-random-secret-key>
MONGODB_URI=<mongodb-connection-string>
CLOUDINARY_CLOUD_NAME=<cloudinary-cloud-name>
CLOUDINARY_API_KEY=<cloudinary-api-key>
CLOUDINARY_API_SECRET=<cloudinary-api-secret>
FRONTEND_URL=<frontend-url>
```

## 9. Error Handling

- Generic error messages to prevent information leakage
- Detailed errors logged server-side only
- User-friendly error codes for client handling
- Stack traces hidden in production

## 10. Additional Recommendations

### For Production Deployment:
1. Enable HTTPS/TLS encryption
2. Use environment-specific configurations
3. Implement request logging and monitoring
4. Set up intrusion detection
5. Regular security audits and dependency updates
6. Implement CSRF protection if using cookies
7. Add API authentication tokens for service-to-service calls
8. Set up database backups and encryption at rest
9. Implement IP whitelisting for admin endpoints
10. Use Web Application Firewall (WAF)

### Monitoring:
- Log all authentication attempts
- Monitor rate limit violations
- Track failed login attempts
- Alert on suspicious patterns
- Regular security scanning

## Installation

Install security dependencies:
```bash
npm install express-rate-limit helmet express-mongo-sanitize xss-clean
```

## Usage

Security middleware is automatically applied in `server.js`:
- Helmet headers on all routes
- Rate limiting on API routes
- Input sanitization on all requests
- File upload validation on product routes

## Testing Security

1. Test rate limiting by making multiple rapid requests
2. Attempt XSS injection in text fields
3. Try uploading non-image files
4. Test with oversized files
5. Verify JWT expiration and validation
6. Test NoSQL injection attempts

## Compliance

These security measures help comply with:
- OWASP Top 10 security risks
- PCI DSS requirements (if handling payments)
- GDPR data protection requirements
- General security best practices
