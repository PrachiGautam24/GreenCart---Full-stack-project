// Validation utility functions

export interface ValidationResult {
  isValid: boolean;
  message: string;
}

// Email validation
export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, message: "Email is required" };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, message: "Please enter a valid email address (e.g., user@example.com)" };
  }
  
  return { isValid: true, message: "" };
};

// Password validation
export const validatePassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, message: "Password is required" };
  }
  
  if (password.length < 6) {
    return { isValid: false, message: "Password must be at least 6 characters long" };
  }
  
  if (password.length > 50) {
    return { isValid: false, message: "Password must be less than 50 characters" };
  }
  
  // Check for at least one letter and one number
  const hasLetter = /[a-zA-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  
  if (!hasLetter || !hasNumber) {
    return { isValid: false, message: "Password must contain at least one letter and one number" };
  }
  
  return { isValid: true, message: "" };
};

// Username validation
export const validateUsername = (username: string): ValidationResult => {
  if (!username) {
    return { isValid: false, message: "Username is required" };
  }
  
  if (username.length < 3) {
    return { isValid: false, message: "Username must be at least 3 characters long" };
  }
  
  if (username.length > 30) {
    return { isValid: false, message: "Username must be less than 30 characters" };
  }
  
  // Only allow letters, numbers, and underscores
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    return { isValid: false, message: "Username can only contain letters, numbers, and underscores" };
  }
  
  return { isValid: true, message: "" };
};

// Phone number validation
export const validatePhoneNumber = (phone: string): ValidationResult => {
  if (!phone) {
    return { isValid: false, message: "Phone number is required" };
  }
  
  // Remove all non-digit characters for validation
  const digitsOnly = phone.replace(/\D/g, '');
  
  if (digitsOnly.length < 10) {
    return { isValid: false, message: "Phone number must be at least 10 digits" };
  }
  
  if (digitsOnly.length > 15) {
    return { isValid: false, message: "Phone number must be less than 15 digits" };
  }
  
  // Check for valid phone format (flexible)
  const phoneRegex = /^[\+]?[1-9][\d]{0,3}[-.\s]?[\(]?[\d]{1,4}[\)]?[-.\s]?[\d]{1,4}[-.\s]?[\d]{1,9}$/;
  if (!phoneRegex.test(phone)) {
    return { isValid: false, message: "Please enter a valid phone number (e.g., +1 (555) 123-4567)" };
  }
  
  return { isValid: true, message: "" };
};

// Tax ID validation
export const validateTaxId = (taxId: string): ValidationResult => {
  if (!taxId) {
    return { isValid: false, message: "Tax ID is required" };
  }
  
  // Remove hyphens and spaces for validation
  const cleanTaxId = taxId.replace(/[-\s]/g, '');
  
  // Check for EIN format (9 digits) or SSN format
  const einRegex = /^\d{9}$/;
  const ssnRegex = /^\d{9}$/;
  
  if (!einRegex.test(cleanTaxId) && !ssnRegex.test(cleanTaxId)) {
    return { isValid: false, message: "Tax ID must be 9 digits (e.g., 12-3456789)" };
  }
  
  return { isValid: true, message: "" };
};

// Bank account number validation
export const validateBankAccount = (accountNumber: string): ValidationResult => {
  if (!accountNumber) {
    return { isValid: false, message: "Bank account number is required" };
  }
  
  // Remove spaces and hyphens
  const cleanAccount = accountNumber.replace(/[-\s]/g, '');
  
  if (!/^\d+$/.test(cleanAccount)) {
    return { isValid: false, message: "Bank account number must contain only numbers" };
  }
  
  if (cleanAccount.length < 8) {
    return { isValid: false, message: "Bank account number must be at least 8 digits" };
  }
  
  if (cleanAccount.length > 17) {
    return { isValid: false, message: "Bank account number must be less than 17 digits" };
  }
  
  return { isValid: true, message: "" };
};

// Required field validation
export const validateRequired = (value: string, fieldName: string): ValidationResult => {
  if (!value || value.trim().length === 0) {
    return { isValid: false, message: `${fieldName} is required` };
  }
  
  return { isValid: true, message: "" };
};

// Text length validation
export const validateTextLength = (
  value: string, 
  fieldName: string, 
  minLength: number = 0, 
  maxLength: number = 255
): ValidationResult => {
  if (value.length < minLength) {
    return { isValid: false, message: `${fieldName} must be at least ${minLength} characters long` };
  }
  
  if (value.length > maxLength) {
    return { isValid: false, message: `${fieldName} must be less than ${maxLength} characters` };
  }
  
  return { isValid: true, message: "" };
};

// City validation
export const validateCity = (city: string): ValidationResult => {
  if (!city) {
    return { isValid: false, message: "City is required" };
  }
  
  if (city.length < 2) {
    return { isValid: false, message: "City name must be at least 2 characters long" };
  }
  
  if (city.length > 50) {
    return { isValid: false, message: "City name must be less than 50 characters" };
  }
  
  // Only allow letters, spaces, hyphens, and apostrophes
  const cityRegex = /^[a-zA-Z\s\-']+$/;
  if (!cityRegex.test(city)) {
    return { isValid: false, message: "City name can only contain letters, spaces, hyphens, and apostrophes" };
  }
  
  return { isValid: true, message: "" };
};

// Business name validation
export const validateBusinessName = (name: string): ValidationResult => {
  const requiredCheck = validateRequired(name, "Business name");
  if (!requiredCheck.isValid) return requiredCheck;
  
  const lengthCheck = validateTextLength(name, "Business name", 2, 100);
  if (!lengthCheck.isValid) return lengthCheck;
  
  return { isValid: true, message: "" };
};

// Address validation
export const validateAddress = (address: string): ValidationResult => {
  const requiredCheck = validateRequired(address, "Address");
  if (!requiredCheck.isValid) return requiredCheck;
  
  const lengthCheck = validateTextLength(address, "Address", 10, 200);
  if (!lengthCheck.isValid) return lengthCheck;
  
  return { isValid: true, message: "" };
};

// Bank name validation
export const validateBankName = (bankName: string): ValidationResult => {
  const requiredCheck = validateRequired(bankName, "Bank name");
  if (!requiredCheck.isValid) return requiredCheck;
  
  const lengthCheck = validateTextLength(bankName, "Bank name", 2, 100);
  if (!lengthCheck.isValid) return lengthCheck;
  
  // Only allow letters, spaces, and common bank characters
  const bankNameRegex = /^[a-zA-Z\s&\-'.,]+$/;
  if (!bankNameRegex.test(bankName)) {
    return { isValid: false, message: "Bank name can only contain letters, spaces, and common punctuation" };
  }
  
  return { isValid: true, message: "" };
};

// Format phone number as user types
export const formatPhoneNumber = (value: string): string => {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX
  if (digits.length >= 6) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
  } else if (digits.length >= 3) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  } else {
    return digits;
  }
};

// Format tax ID as user types
export const formatTaxId = (value: string): string => {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '');
  
  // Format as XX-XXXXXXX
  if (digits.length >= 2) {
    return `${digits.slice(0, 2)}-${digits.slice(2, 9)}`;
  } else {
    return digits;
  }
};