import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSellerReviews } from '../store/slices/reviewSlice';
import sellerService from '../services/sellerService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import RatingDisplay from '../components/common/RatingDisplay';
import ProductCard from '../components/products/ProductCard';
import ReviewList from '../components/reviews/ReviewList';

const SellerProfilePage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  const [sellerProfile, setSellerProfile] = useState(null);
  const [sellerProducts, setSellerProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'reviews'
  
  const { reviews: sellerReviews, loading: reviewsLoading } = useSelector((state) => state.review);

  useEffect(() => {
    const fetchSellerData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch seller profile
        const profileResponse = await sellerService.getSellerProfile(id);
        setSellerProfile(profileResponse.data);

        // Fetch seller products
        const productsResponse = await sellerService.getSellerProducts(id);
        setSellerProducts(productsResponse.data || []);

        // Fetch seller reviews using Redux
        dispatch(fetchSellerReviews(id));
      } catch (err) {
        setError(
          err.response?.data?.error?.message || 'Failed to load seller profile'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSellerData();
  }, [id, dispatch]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
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

  if (!sellerProfile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ErrorMessage message="Seller not found" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Seller Profile Header */}
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            {sellerProfile.profileImage ? (
              <img
                src={sellerProfile.profileImage}
                alt={sellerProfile.username}
                className="w-32 h-32 rounded-full object-cover border-4 border-green-100"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-green-100 flex items-center justify-center border-4 border-green-200">
                <span className="text-green-600 font-bold text-5xl">
                  {sellerProfile.username?.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-grow text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {sellerProfile.username}
            </h1>
            
            <div className="flex flex-col md:flex-row items-center md:items-start gap-4 mb-4">
              <div className="flex items-center gap-2 text-gray-600">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span>{sellerProfile.city}</span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>Member since {formatDate(sellerProfile.createdAt)}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {sellerProfile.productCount}
                </p>
                <p className="text-sm text-gray-600">Products</p>
              </div>
              
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {sellerProfile.totalReviews}
                </p>
                <p className="text-sm text-gray-600">Reviews</p>
              </div>
            </div>

            {/* Rating */}
            {sellerProfile.totalReviews > 0 && (
              <div className="flex justify-center md:justify-start">
                <RatingDisplay
                  rating={sellerProfile.averageRating}
                  reviewCount={sellerProfile.totalReviews}
                  size="large"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex gap-8">
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'products'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Products ({sellerProducts.length})
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'reviews'
                  ? 'border-green-600 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Reviews ({sellerReviews.length})
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'products' && (
        <div>
          {sellerProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sellerProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <p className="text-gray-500">No products available</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'reviews' && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <ReviewList reviews={sellerReviews} loading={reviewsLoading} />
        </div>
      )}
    </div>
  );
};

export default SellerProfilePage;
