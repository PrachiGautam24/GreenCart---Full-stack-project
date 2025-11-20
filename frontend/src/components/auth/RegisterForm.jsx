import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, clearError } from '../../store/slices/authSlice';
import { validateEmail, validatePassword, validateUsername, validateRequired } from '../../utils/validators';

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'buyer',
    city: '',
  });

  const [validationErrors, setValidationErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const validateField = (name, value) => {
    switch (name) {
      case 'username':
        return validateUsername(value);
      case 'email':
        return validateEmail(value);
      case 'password':
        return validatePassword(value);
      case 'confirmPassword':
        if (!value) {
          return 'Please confirm your password';
        }
        if (value !== formData.password) {
          return 'Passwords do not match';
        }
        return '';
      case 'city':
        return validateRequired(value, 'City');
      default:
        return '';
    }
  };

  const validateForm = () => {
    const errors = {};
    
    Object.keys(formData).forEach((key) => {
      if (key !== 'role') {
        const error = validateField(key, formData[key]);
        if (error) {
          errors[key] = error;
        }
      }
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Validate field on change if it has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setValidationErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
    
    // Also revalidate confirmPassword if password changes
    if (name === 'password' && touched.confirmPassword) {
      const confirmError = formData.confirmPassword !== value ? 'Passwords do not match' : '';
      setValidationErrors((prev) => ({
        ...prev,
        confirmPassword: confirmError,
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
    
    // Validate field on blur
    const error = validateField(name, value);
    setValidationErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Remove confirmPassword before sending to API
    const { confirmPassword, ...registrationData } = formData;
    dispatch(register(registrationData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-md animate-fade-in">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-gray-900">Join GreenCart</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                validationErrors.username ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your username"
              aria-invalid={!!validationErrors.username}
              aria-describedby={validationErrors.username ? 'username-error' : undefined}
            />
            {validationErrors.username && (
              <p id="username-error" className="mt-1 text-sm text-red-600" role="alert">
                {validationErrors.username}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                validationErrors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your email"
              aria-invalid={!!validationErrors.email}
              aria-describedby={validationErrors.email ? 'email-error' : undefined}
            />
            {validationErrors.email && (
              <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">
                {validationErrors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                validationErrors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your password"
              aria-invalid={!!validationErrors.password}
              aria-describedby={validationErrors.password ? 'password-error' : undefined}
            />
            {validationErrors.password && (
              <p id="password-error" className="mt-1 text-sm text-red-600" role="alert">
                {validationErrors.password}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                validationErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Confirm your password"
              aria-invalid={!!validationErrors.confirmPassword}
              aria-describedby={validationErrors.confirmPassword ? 'confirmPassword-error' : undefined}
            />
            {validationErrors.confirmPassword && (
              <p id="confirmPassword-error" className="mt-1 text-sm text-red-600" role="alert">
                {validationErrors.confirmPassword}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>
          </div>

          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                validationErrors.city ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Enter your city"
              aria-invalid={!!validationErrors.city}
              aria-describedby={validationErrors.city ? 'city-error' : undefined}
            />
            {validationErrors.city && (
              <p id="city-error" className="mt-1 text-sm text-red-600" role="alert">
                {validationErrors.city}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 sm:py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Registering...
              </span>
            ) : (
              'Register'
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-green-600 hover:text-green-700 font-semibold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
