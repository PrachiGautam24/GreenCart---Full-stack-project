/**
 * Input sanitization utilities to prevent XSS and injection attacks
 */

// Sanitize string input by removing potentially dangerous characters
export const sanitizeString = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove HTML tags and script content
  let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  sanitized = sanitized.replace(/<[^>]*>/g, '');
  
  // Encode special characters
  sanitized = sanitized
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
  
  return sanitized.trim();
};

// Sanitize object recursively
export const sanitizeObject = (obj) => {
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }
  
  if (typeof obj === 'object') {
    const sanitized = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        sanitized[key] = sanitizeObject(obj[key]);
      }
    }
    return sanitized;
  }
  
  return obj;
};

// Validate and sanitize email
export const sanitizeEmail = (email) => {
  if (typeof email !== 'string') return '';
  
  // Remove whitespace and convert to lowercase
  const sanitized = email.trim().toLowerCase();
  
  // Basic email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(sanitized)) {
    throw new Error('Invalid email format');
  }
  
  return sanitized;
};

// Validate and sanitize username
export const sanitizeUsername = (username) => {
  if (typeof username !== 'string') return '';
  
  // Remove whitespace and special characters, allow only alphanumeric and underscore
  const sanitized = username.trim().replace(/[^a-zA-Z0-9_]/g, '');
  
  if (sanitized.length < 3 || sanitized.length > 30) {
    throw new Error('Username must be between 3 and 30 characters');
  }
  
  return sanitized;
};

// Sanitize MongoDB query to prevent NoSQL injection
export const sanitizeMongoQuery = (query) => {
  if (typeof query !== 'object' || query === null) return query;
  
  const sanitized = {};
  
  for (const key in query) {
    if (query.hasOwnProperty(key)) {
      // Remove $ operators from user input
      if (key.startsWith('$')) {
        continue;
      }
      
      const value = query[key];
      
      // Recursively sanitize nested objects
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        sanitized[key] = sanitizeMongoQuery(value);
      } else {
        sanitized[key] = value;
      }
    }
  }
  
  return sanitized;
};

// Validate file upload
export const validateFileUpload = (file) => {
  if (!file) {
    throw new Error('No file provided');
  }
  
  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error('File size exceeds 5MB limit');
  }
  
  // Check file type
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP images are allowed');
  }
  
  // Check file extension
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
  const fileExtension = file.originalname.toLowerCase().slice(file.originalname.lastIndexOf('.'));
  if (!allowedExtensions.includes(fileExtension)) {
    throw new Error('Invalid file extension');
  }
  
  return true;
};
