// Error handling utilities

/**
 * Extracts user-friendly error message from various error formats
 * @param {*} error - Error object from API or other sources
 * @returns {string} - User-friendly error message
 */
export const getErrorMessage = (error) => {
  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  // Handle axios error responses
  if (error?.response?.data) {
    const data = error.response.data;
    
    // Check for error.message pattern
    if (data.error?.message) {
      return data.error.message;
    }
    
    // Check for message pattern
    if (data.message) {
      return data.message;
    }
    
    // Check for errors array (validation errors)
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      return data.errors.map(err => err.msg || err.message).join(', ');
    }
  }

  // Handle network errors
  if (error?.message === 'Network Error') {
    return 'Network error. Please check your internet connection and try again.';
  }

  // Handle timeout errors
  if (error?.code === 'ECONNABORTED') {
    return 'Request timeout. Please try again.';
  }

  // Handle generic error messages
  if (error?.message) {
    return error.message;
  }

  // Default fallback
  return 'An unexpected error occurred. Please try again.';
};

/**
 * Formats validation errors from backend into field-specific errors
 * @param {Array} errors - Array of validation errors from backend
 * @returns {Object} - Object with field names as keys and error messages as values
 */
export const formatValidationErrors = (errors) => {
  if (!Array.isArray(errors)) {
    return {};
  }

  return errors.reduce((acc, error) => {
    const field = error.param || error.field || 'general';
    const message = error.msg || error.message || 'Invalid value';
    acc[field] = message;
    return acc;
  }, {});
};

/**
 * Checks if error is a network/connection error
 * @param {*} error - Error object
 * @returns {boolean}
 */
export const isNetworkError = (error) => {
  return (
    error?.message === 'Network Error' ||
    error?.code === 'ECONNABORTED' ||
    !error?.response
  );
};

/**
 * Checks if error is an authentication error
 * @param {*} error - Error object
 * @returns {boolean}
 */
export const isAuthError = (error) => {
  return error?.response?.status === 401 || error?.response?.status === 403;
};

/**
 * Logs error to console in development mode
 * @param {string} context - Context where error occurred
 * @param {*} error - Error object
 */
export const logError = (context, error) => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[${context}]`, error);
  }
};
