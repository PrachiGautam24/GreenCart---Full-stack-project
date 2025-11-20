import { useNavigate } from 'react-router-dom';

const CartSummary = ({ totalAmount, itemCount, onCheckout }) => {
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout();
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h2>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-gray-600">
          <span>Items ({itemCount})</span>
          <span>${totalAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Shipping</span>
          <span className="text-green-600">FREE</span>
        </div>
        <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-800">
          <span>Total</span>
          <span>${totalAmount.toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={handleCheckout}
        disabled={itemCount === 0}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
      >
        Proceed to Checkout
      </button>

      <div className="mt-4 text-sm text-gray-500 text-center">
        <p>🌱 Supporting local sustainable sellers</p>
      </div>
    </div>
  );
};

export default CartSummary;
