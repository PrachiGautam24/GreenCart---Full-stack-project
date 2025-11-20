/**
 * Security logging middleware for sensitive operations
 * Logs admin actions, authentication attempts, and security events
 */

// Log authentication attempts
export const logAuthAttempt = (req, res, next) => {
  const originalJson = res.json;
  
  res.json = function(data) {
    const { email } = req.body;
    const success = data.success;
    const timestamp = new Date().toISOString();
    const ip = req.ip || req.connection.remoteAddress;
    
    if (req.path === '/login') {
      console.log(`[AUTH] Login attempt - Email: ${email}, Success: ${success}, IP: ${ip}, Time: ${timestamp}`);
    } else if (req.path === '/register') {
      console.log(`[AUTH] Registration attempt - Email: ${email}, Success: ${success}, IP: ${ip}, Time: ${timestamp}`);
    }
    
    return originalJson.call(this, data);
  };
  
  next();
};

// Log admin actions
export const logAdminAction = (action) => {
  return (req, res, next) => {
    const originalJson = res.json;
    
    res.json = function(data) {
      if (data.success) {
        const timestamp = new Date().toISOString();
        const adminId = req.user?._id || 'unknown';
        const adminUsername = req.user?.username || 'unknown';
        const ip = req.ip || req.connection.remoteAddress;
        
        console.log(`[ADMIN] Action: ${action}, Admin: ${adminUsername} (${adminId}), IP: ${ip}, Time: ${timestamp}, Details: ${JSON.stringify(req.params)}`);
      }
      
      return originalJson.call(this, data);
    };
    
    next();
  };
};

// Log rate limit violations
export const logRateLimitViolation = (req, res, next) => {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress;
  const path = req.path;
  
  console.warn(`[SECURITY] Rate limit exceeded - IP: ${ip}, Path: ${path}, Time: ${timestamp}`);
  
  next();
};

// Log failed authentication attempts
export const logFailedAuth = (email, reason, req) => {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress;
  
  console.warn(`[SECURITY] Failed authentication - Email: ${email}, Reason: ${reason}, IP: ${ip}, Time: ${timestamp}`);
};

// Log suspicious activity
export const logSuspiciousActivity = (activity, details, req) => {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress;
  const userId = req.user?._id || 'anonymous';
  
  console.warn(`[SECURITY] Suspicious activity - Type: ${activity}, User: ${userId}, IP: ${ip}, Time: ${timestamp}, Details: ${JSON.stringify(details)}`);
};

// Log file upload attempts
export const logFileUpload = (req, res, next) => {
  if (req.files && req.files.length > 0) {
    const timestamp = new Date().toISOString();
    const userId = req.user?._id || 'anonymous';
    const fileCount = req.files.length;
    const totalSize = req.files.reduce((sum, file) => sum + file.size, 0);
    
    console.log(`[UPLOAD] File upload - User: ${userId}, Files: ${fileCount}, Total Size: ${totalSize} bytes, Time: ${timestamp}`);
  }
  
  next();
};
