import React, { useState, useEffect } from 'react';
import { Input } from './input';
import { Label } from './label';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { ValidationResult } from '@/utils/validation';

interface ValidatedInputProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onValidation?: (result: ValidationResult) => void;
  validator?: (value: string) => ValidationResult;
  formatter?: (value: string) => string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  showValidation?: boolean;
}

const ValidatedInput: React.FC<ValidatedInputProps> = ({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onValidation,
  validator,
  formatter,
  required = false,
  disabled = false,
  className = '',
  showValidation = true
}) => {
  const [validation, setValidation] = useState<ValidationResult>({ isValid: true, message: '' });
  const [touched, setTouched] = useState(false);
  const [focused, setFocused] = useState(false);

  // Validate on value change
  useEffect(() => {
    if (validator && (touched || value.length > 0)) {
      const result = validator(value);
      setValidation(result);
      onValidation?.(result);
    }
  }, [value, validator, touched, onValidation]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    
    // Apply formatter if provided
    if (formatter) {
      newValue = formatter(newValue);
    }
    
    onChange(newValue);
  };

  const handleBlur = () => {
    setTouched(true);
    setFocused(false);
  };

  const handleFocus = () => {
    setFocused(true);
  };

  const showError = showValidation && touched && !validation.isValid && !focused;
  const showSuccess = showValidation && touched && validation.isValid && value.length > 0 && !focused;

  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      
      <div className="relative">
        <Input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          disabled={disabled}
          className={`
            ${showError ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}
            ${showSuccess ? 'border-green-500 focus:border-green-500 focus:ring-green-500' : ''}
            ${showValidation ? 'pr-10' : ''}
          `}
        />
        
        {/* Validation Icon */}
        {showValidation && touched && !focused && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            {validation.isValid && value.length > 0 ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : !validation.isValid ? (
              <AlertCircle className="h-5 w-5 text-red-500" />
            ) : null}
          </div>
        )}
      </div>
      
      {/* Validation Message */}
      {showValidation && touched && !focused && validation.message && (
        <p className={`text-sm ${validation.isValid ? 'text-green-600' : 'text-red-600'}`}>
          {validation.message}
        </p>
      )}
      
      {/* Helper Text for Focused State */}
      {focused && placeholder && (
        <p className="text-sm text-gray-500">
          {getHelperText(type, label)}
        </p>
      )}
    </div>
  );
};

// Helper text for different input types
const getHelperText = (type: string, label: string): string => {
  switch (type) {
    case 'email':
      return 'Enter a valid email address (e.g., user@example.com)';
    case 'password':
      return 'Must be at least 6 characters with letters and numbers';
    case 'tel':
      return 'Enter phone number (e.g., +1 (555) 123-4567)';
    default:
      if (label.toLowerCase().includes('tax')) {
        return 'Enter 9-digit tax ID (e.g., 12-3456789)';
      }
      if (label.toLowerCase().includes('account')) {
        return 'Enter bank account number (8-17 digits)';
      }
      if (label.toLowerCase().includes('username')) {
        return 'Letters, numbers, and underscores only (3-30 characters)';
      }
      return '';
  }
};

export default ValidatedInput;