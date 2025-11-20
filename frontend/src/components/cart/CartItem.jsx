import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateCartItem, removeFromCart } from '../../store/slices/cartSlice';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity < 1) return;
    
    setIsUpdating(true);
    try {
      await dispatch(updateCartItem({ 
        productId: item.product._id, 
        quantity: newQuantity 
      })).unwrap();
    } catch (error) {
      console.error('Failed to update quantity:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    try {
      await dispatch(removeFromCart(item.product._id)).unwrap();
    } catch (error) {
      console.error('Failed to remove item:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const itemTotal = item.product.price * item.quantity;

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      {/* Product Image */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
        <img
          src={item.product.images?.[0] || '/placeholder.png'}
          alt={item.product.title}
          className="w-full h-full object-cover rounded"
          loading="lazy"
        />
      </div>

      {/* Product Info */}
      <div className="flex-grow min-w-0">
        <h3 className="font-semibold text-base sm:text-lg text-gray-800 truncate">{item.product.title}</h3>
        <p className="text-gray-600 text-sm mt-1">
          ${item.product.price.toFixed(2)} each
        </p>
        {item.product.sustainabilityTags && item.product.sustainabilityTags.length > 0 && (
          <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
            {item.product.sustainabilityTags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Quantity Controls and Total - Mobile Layout */}
      <div className="flex items-center justify-between w-full sm:w-auto gap-4">
        {/* Quantity Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={isUpdating || item.quantity <= 1}
            className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed rounded transition"
          >
            -
          </button>
          <span className="w-10 sm:w-12 text-center font-semibold">{item.quantity}</span>
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={isUpdating}
            className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed rounded transition"
          >
            +
          </button>
        </div>

        {/* Item Total */}
        <div className="text-right">
          <p className="font-bold text-base sm:text-lg text-gray-800">
            ${itemTotal.toFixed(2)}
          </p>
        </div>

        {/* Remove Button */}
        <button
          onClick={handleRemove}
          disabled={isUpdating}
          className="text-red-600 hover:text-red-800 disabled:text-red-300 p-2 transition"
          title="Remove from cart"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 sm:h-6 sm:w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CartItem;
