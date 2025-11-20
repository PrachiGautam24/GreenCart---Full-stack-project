// Validation utility functions

export const validateEmail = (email) => {
  if (!email) {
    return 'Email is required';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return '';
};

export const validatePassword = (password) => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  return '';
};

export const validateUsername = (username) => {
  if (!username) {
    return 'Username is required';
  }
  if (username.length < 3) {
    return 'Username must be at least 3 characters long';
  }
  if (username.length > 30) {
    return 'Username must not exceed 30 characters';
  }
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return 'Username can only contain letters, numbers, and underscores';
  }
  return '';
};

export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`;
  }
  return '';
};

export const validatePrice = (price) => {
  if (!price && price !== 0) {
    return 'Price is required';
  }
  const numPrice = Number(price);
  if (isNaN(numPrice)) {
    return 'Price must be a valid number';
  }
  if (numPrice < 0) {
    return 'Price cannot be negative';
  }
  if (numPrice > 1000000) {
    return 'Price seems unreasonably high';
  }
  return '';
};

export const validateStock = (stock) => {
  if (!stock && stock !== 0) {
    return 'Stock quantity is required';
  }
  const numStock = Number(stock);
  if (isNaN(numStock)) {
    return 'Stock must be a valid number';
  }
  if (numStock < 0) {
    return 'Stock cannot be negative';
  }
  if (!Number.isInteger(numStock)) {
    return 'Stock must be a whole number';
  }
  return '';
};

export const validateRating = (rating) => {
  if (!rating) {
    return 'Please select a rating';
  }
  const numRating = Number(rating);
  if (isNaN(numRating) || numRating < 1 || numRating > 5) {
    return 'Rating must be between 1 and 5';
  }
  return '';
};

export const validateTextLength = (text, fieldName, minLength, maxLength) => {
  if (!text || !text.trim()) {
    return `${fieldName} is required`;
  }
  if (minLength && text.trim().length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  if (maxLength && text.trim().length > maxLength) {
    return `${fieldName} must not exceed ${maxLength} characters`;
  }
  return '';
};

export const validateImageFile = (file) => {
  if (!file) {
    return '';
  }
  
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    return 'Only image files (JPEG, PNG, GIF, WebP) are allowed';
  }
  
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return 'Image size must not exceed 5MB';
  }
  
  return '';
};

export const validateImageFiles = (files) => {
  if (!files || files.length === 0) {
    return '';
  }
  
  if (files.length > 5) {
    return 'You can upload a maximum of 5 images';
  }
  
  for (let file of files) {
    const error = validateImageFile(file);
    if (error) {
      return error;
    }
  }
  
  return '';
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') {
    return input;
  }
  
  // Remove potential XSS characters
  return input
    .replace(/[<>]/g, '')
    .trim();
};
