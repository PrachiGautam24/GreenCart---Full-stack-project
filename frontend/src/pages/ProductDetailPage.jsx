import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, clearCurrentProduct } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import { fetchProductReviews } from '../store/slices/reviewSlice';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import RatingDisplay from '../components/common/RatingDisplay';
import ReviewList from '../components/reviews/ReviewList';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentProduct, loading, error } = useSelector((state) => state.products);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { reviews, loading: reviewsLoading } = useSelector((state) => state.review);
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    // Fetch product details
    dispatch(fetchProductById(id));

    // Fetch product reviews
    dispatch(fetchProductReviews(id));

    // Cleanup
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setAddingToCart(true);
    try {
      await dispatch(addToCart({ productId: id, quantity: 1 })).unwrap();
      // Show success message (could be replaced with a toast notification)
      const successMsg = document.createElement('div');
      successMsg.className = 'fixed top-4 right-4 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg shadow-lg z-50 animate-slide-in-right';
      successMsg.innerHTML = `
        <div class="flex items-center">
          <svg class="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
          </svg>
          <span class="font-medium">Product added to cart!</span>
        </div>
      `;
      document.body.appendChild(successMsg);
      setTimeout(() => successMsg.remove(), 3000);
    } catch (error) {
      alert(error || 'Failed to add product to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message={error} />
      </div>
    );
  }

  if (!currentProduct) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message="Product not found" />
      </div>
    );
  }

  const isBuyer = user?.role === 'buyer';
  const images = currentProduct.images || [];
  const currentImage = images[selectedImage] || '/placeholder-product.jpg';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Product Images */}
          <div>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-4">
              <img
                src={currentImage}
                alt={currentProduct.title}
                className="w-full h-64 sm:h-80 md:h-96 object-cover"
                loading="lazy"
              />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`border-2 rounded-lg overflow-hidden transition ${
                      selectedImage === index
                        ? 'border-green-600 scale-105'
                        : 'border-gray-200 hover:border-green-400'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${currentProduct.title} ${index + 1}`}
                      className="w-full h-16 sm:h-20 object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

        {/* Product Details */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {currentProduct.title}
          </h1>

          {/* Rating */}
          {currentProduct.reviewCount > 0 && (
            <div className="mb-4">
              <RatingDisplay
                rating={currentProduct.averageRating}
                reviewCount={currentProduct.reviewCount}
                size="large"
              />
            </div>
          )}

          {/* Price */}
          <div className="mb-6">
            <span className="text-4xl font-bold text-green-600">
              ${currentProduct.price.toFixed(2)}
            </span>
          </div>

          {/* Sustainability Tags */}
          {currentProduct.sustainabilityTags &&
            currentProduct.sustainabilityTags.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">
                  Sustainability
                </h3>
                <div className="flex flex-wrap gap-2">
                  {currentProduct.sustainabilityTags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

          {/* Stock Status */}
          <div className="mb-6">
            {currentProduct.stock > 0 ? (
              <p className="text-green-600 font-semibold">
                In Stock ({currentProduct.stock} available)
              </p>
            ) : (
              <p className="text-red-600 font-semibold">Out of Stock</p>
            )}
          </div>

          {/* Seller Information */}
          {currentProduct.seller && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Sold by
              </h3>
              <Link
                to={`/sellers/${currentProduct.seller._id}`}
                className="flex items-center gap-3 hover:text-green-600 transition-colors"
              >
                {currentProduct.seller.profileImage ? (
                  <img
                    src={currentProduct.seller.profileImage}
                    alt={currentProduct.seller.username}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 font-semibold text-lg">
                      {currentProduct.seller.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-semibold text-gray-800">
                    {currentProduct.seller.username}
                  </p>
                  <p className="text-sm text-gray-600">
                    {currentProduct.seller.city}
                  </p>
                </div>
              </Link>
            </div>
          )}

          {/* Add to Cart Button (Buyer Only) */}
          {isBuyer && (
            <button
              onClick={handleAddToCart}
              disabled={currentProduct.stock === 0 || addingToCart}
              className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition-all transform hover:scale-105 active:scale-95 ${
                currentProduct.stock === 0 || addingToCart
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700'
              }`}
            >
              {addingToCart ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Adding...
                </span>
              ) : (
                'Add to Cart'
              )}
            </button>
          )}

          {!isAuthenticated && (
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 px-6 rounded-lg font-semibold text-white bg-green-600 hover:bg-green-700 transition-all transform hover:scale-105 active:scale-95"
            >
              Login to Purchase
            </button>
          )}
        </div>
      </div>

      {/* Product Description */}
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Description</h2>
        <p className="text-sm sm:text-base text-gray-700 whitespace-pre-line">
          {currentProduct.description}
        </p>
      </div>

      {/* Reviews Section */}
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
          Customer Reviews
        </h2>
        <ReviewList reviews={reviews} loading={reviewsLoading} />
      </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
