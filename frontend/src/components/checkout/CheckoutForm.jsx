import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../../store/slices/orderSlice';
import { clearCart } from '../../store/slices/cartSlice';
import ErrorMessage from '../common/ErrorMessage';

const CheckoutForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalAmount } = useSelector((state) => state.cart);
  const { loading, error } = useSelector((state) => state.order);
  const [paymentMethod, setPaymentMethod] = useState('mock');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleCompleteCheckout = async (e) => {
    e.preventDefault();
    
    try {
      const result = await dispatch(createOrder()).unwrap();
      
      // Clear cart after successful order
      dispatch(clearCart());
      
      // Show success message
      setShowSuccess(true);
      
      // Redirect to order confirmation after 2 seconds
      setTimeout(() => {
        navigate(`/orders/${result.order._id}`);
      }, 2000);
    } catch (err) {
      // Error is handled by Redux state
      console.error('Checkout failed:', err);
    }
  };

  if (showSuccess) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 sm:p-8 text-center animate-fade-in">
        <div className="text-green-600 text-5xl sm:text-6xl mb-4 animate-bounce-subtle">✓</div>
        <h2 className="text-xl sm:text-2xl font-bold text-green-800 mb-2">Order Placed Successfully!</h2>
        <p className="text-green-700">Redirecting to order confirmation...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Checkout</h2>

      {error && <ErrorMessage message={error} />}

      {/* Order Summary */}
      <div className="mb-6">
        <h3 className="text-base sm:text-lg font-semibold mb-4">Order Summary</h3>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.product._id} className="flex justify-between items-center border-b pb-2">
              <div className="flex items-center gap-3">
                {item.product.images && item.product.images[0] && (
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                )}
                <div>
                  <p className="font-medium">{item.product.title}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
              </div>
              <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between items-center text-xl font-bold">
            <span>Total:</span>
            <span className="text-green-600">${totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Mock Payment Interface */}
      <form onSubmit={handleCompleteCheckout}>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-yellow-800">
              <strong>Demo Mode:</strong> This is a mock payment gateway. All payments will be automatically approved.
            </p>
          </div>
          
          <div className="space-y-2">
            <label className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="radio"
                name="paymentMethod"
                value="mock"
                checked={paymentMethod === 'mock'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4"
              />
              <span>Mock Payment Gateway (Demo)</span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || items.length === 0}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing...
            </span>
          ) : (
            'Complete Purchase'
          )}
        </button>
      </form>
    </div>
  );
};

export default CheckoutForm;
