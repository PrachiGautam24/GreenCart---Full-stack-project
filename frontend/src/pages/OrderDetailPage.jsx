import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import { fetchOrderById } from '../store/slices/orderSlice';
import ErrorMessage from '../components/common/ErrorMessage';
import ReviewForm from '../components/reviews/ReviewForm';

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const dispatch = useDispatch();
  const { currentOrder, loading, error } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.auth);
  const [showReviewForm, setShowReviewForm] = useState({});

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderById(orderId));
    }
  }, [dispatch, orderId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-600">Order not found</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link to="/orders" className="text-green-600 hover:text-green-700 font-medium">
            ← Back to Orders
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Order Confirmation</h1>
              <p className="text-gray-600">Order ID: <span className="font-mono">{currentOrder._id}</span></p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(currentOrder.status)}`}>
              {currentOrder.status.charAt(0).toUpperCase() + currentOrder.status.slice(1)}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 pb-6 border-b">
            <div>
              <p className="text-sm text-gray-600 mb-1">Order Date</p>
              <p className="font-medium">
                {new Date(currentOrder.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Payment Status</p>
              <p className="font-medium capitalize">{currentOrder.paymentStatus}</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Order Items</h2>
            <div className="space-y-6">
              {currentOrder.items.map((item, index) => (
                <div key={index} className="border-b pb-6">
                  <div className="flex gap-4 mb-4">
                    {item.product?.images && item.product.images[0] && (
                      <img
                        src={item.product.images[0]}
                        alt={item.product?.title || 'Product'}
                        className="w-24 h-24 object-cover rounded"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.product?.title || 'Product'}</h3>
                      <p className="text-gray-600 text-sm mb-2">
                        Seller: {item.seller?.username || 'Unknown'}
                      </p>
                      <div className="flex justify-between items-center">
                        <p className="text-gray-600">Quantity: {item.quantity}</p>
                        <p className="font-semibold">${item.price.toFixed(2)} each</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                  
                  {/* Review Form for Buyers */}
                  {user?.role === 'buyer' && currentOrder.status === 'completed' && (
                    <div className="mt-4">
                      {!showReviewForm[index] ? (
                        <button
                          onClick={() => setShowReviewForm({ ...showReviewForm, [index]: true })}
                          className="text-green-600 hover:text-green-700 font-medium text-sm"
                        >
                          + Write a Review
                        </button>
                      ) : (
                        <div>
                          <ReviewForm
                            productId={item.product?._id}
                            sellerId={item.seller?._id}
                            orderId={currentOrder._id}
                            onSuccess={() => {
                              setShowReviewForm({ ...showReviewForm, [index]: false });
                            }}
                          />
                          <button
                            onClick={() => setShowReviewForm({ ...showReviewForm, [index]: false })}
                            className="mt-2 text-gray-600 hover:text-gray-700 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex justify-between items-center text-2xl font-bold">
              <span>Total Amount:</span>
              <span className="text-green-600">${currentOrder.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <Link
              to="/products"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailPage;
