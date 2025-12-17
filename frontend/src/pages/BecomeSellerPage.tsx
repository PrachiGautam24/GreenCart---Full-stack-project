import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import api from '@/store/services/api';
import ValidatedInput from '../components/ui/validated-input';
import { 
  validateBusinessName, 
  validateRequired, 
  validateAddress, 
  validatePhoneNumber, 
  validateTaxId, 
  validateBankAccount, 
  validateBankName,
  formatPhoneNumber,
  formatTaxId,
  ValidationResult 
} from '../utils/validation';

const BecomeSellerPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [formData, setFormData] = useState({
    businessName: '',
    businessDescription: '',
    businessAddress: '',
    phoneNumber: '',
    taxId: '',
    bankAccountNumber: '',
    bankName: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationResults, setValidationResults] = useState({
    businessName: { isValid: false, message: "" },
    businessDescription: { isValid: false, message: "" },
    businessAddress: { isValid: false, message: "" },
    phoneNumber: { isValid: false, message: "" },
    taxId: { isValid: false, message: "" },
    bankAccountNumber: { isValid: false, message: "" },
    bankName: { isValid: false, message: "" },
  });

  const handleValidation = (field: string, result: ValidationResult) => {
    setValidationResults(prev => ({
      ...prev,
      [field]: result
    }));
  };

  const isFormValid = Object.values(validationResults).every(result => result.isValid) &&
    Object.values(formData).every(value => value.trim().length > 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isFormValid) {
      setError('Please fix all validation errors before submitting');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.post('/api/auth/become-seller', formData);
      
      if (response.data.success) {
        // Redirect to seller dashboard
        navigate('/seller/dashboard');
        window.location.reload(); // Reload to update user role
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register as seller');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-6">Please login to become a seller</p>
          <button
            onClick={() => navigate('/')}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (user.role === 'seller' || user.role === 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Already a Seller</h2>
          <p className="text-gray-600 mb-6">You already have seller access</p>
          <button
            onClick={() => navigate('/seller/dashboard')}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Become a Seller</h1>
            <p className="text-gray-600">
              Join our marketplace and start selling your eco-friendly products today!
            </p>
          </div>

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Business Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Business Information</h2>
              
              <div className="space-y-4">
                <ValidatedInput
                  id="businessName"
                  label="Business Name"
                  placeholder="Your business or store name"
                  value={formData.businessName}
                  onChange={(value) => setFormData({ ...formData, businessName: value })}
                  onValidation={(result) => handleValidation('businessName', result)}
                  validator={validateBusinessName}
                  required
                />

                <div>
                  <label htmlFor="businessDescription" className="block text-sm font-medium text-gray-700 mb-1">
                    Business Description *
                  </label>
                  <textarea
                    id="businessDescription"
                    name="businessDescription"
                    required
                    value={formData.businessDescription}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData({ ...formData, businessDescription: value });
                      const result = validateRequired(value, "Business description");
                      handleValidation('businessDescription', result);
                    }}
                    rows={4}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                      validationResults.businessDescription.isValid || !formData.businessDescription 
                        ? 'border-gray-300' 
                        : 'border-red-500'
                    }`}
                    placeholder="Tell us about your business and the products you'll sell"
                  />
                  {!validationResults.businessDescription.isValid && formData.businessDescription && (
                    <p className="text-sm text-red-600 mt-1">{validationResults.businessDescription.message}</p>
                  )}
                </div>

                <ValidatedInput
                  id="businessAddress"
                  label="Business Address"
                  placeholder="Full business address"
                  value={formData.businessAddress}
                  onChange={(value) => setFormData({ ...formData, businessAddress: value })}
                  onValidation={(result) => handleValidation('businessAddress', result)}
                  validator={validateAddress}
                  required
                />

                <ValidatedInput
                  id="phoneNumber"
                  label="Phone Number"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={formData.phoneNumber}
                  onChange={(value) => setFormData({ ...formData, phoneNumber: value })}
                  onValidation={(result) => handleValidation('phoneNumber', result)}
                  validator={validatePhoneNumber}
                  formatter={formatPhoneNumber}
                  required
                />
              </div>
            </div>

            {/* Tax & Banking Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Tax & Banking Information</h2>
              
              <div className="space-y-4">
                <ValidatedInput
                  id="taxId"
                  label="Tax ID / EIN"
                  placeholder="XX-XXXXXXX"
                  value={formData.taxId}
                  onChange={(value) => setFormData({ ...formData, taxId: value })}
                  onValidation={(result) => handleValidation('taxId', result)}
                  validator={validateTaxId}
                  formatter={formatTaxId}
                  required
                />

                <ValidatedInput
                  id="bankName"
                  label="Bank Name"
                  placeholder="Your bank name"
                  value={formData.bankName}
                  onChange={(value) => setFormData({ ...formData, bankName: value })}
                  onValidation={(result) => handleValidation('bankName', result)}
                  validator={validateBankName}
                  required
                />

                <ValidatedInput
                  id="bankAccountNumber"
                  label="Bank Account Number"
                  placeholder="Account number for payments"
                  value={formData.bankAccountNumber}
                  onChange={(value) => setFormData({ ...formData, bankAccountNumber: value })}
                  onValidation={(result) => handleValidation('bankAccountNumber', result)}
                  validator={validateBankAccount}
                  required
                />
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                By submitting this form, you agree to our seller terms and conditions. 
                You will be able to add products after your account is upgraded.
              </p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !isFormValid}
                className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Processing...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BecomeSellerPage;
