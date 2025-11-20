import RatingDisplay from '../common/RatingDisplay';

const ReviewList = ({ reviews, loading }) => {
  if (loading) {
    return (
      <div className="text-center py-4">
        <p className="text-gray-500">Loading reviews...</p>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No reviews yet</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review._id}
          className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-3">
              {review.buyer?.profileImage ? (
                <img
                  src={review.buyer.profileImage}
                  alt={review.buyer.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-semibold">
                    {review.buyer?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-800">
                  {review.buyer?.username || 'Anonymous'}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDate(review.createdAt)}
                </p>
              </div>
            </div>
            <RatingDisplay rating={review.rating} size="small" />
          </div>

          {review.comment && (
            <p className="text-gray-700 mt-2">{review.comment}</p>
          )}

          {review.product && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                {review.product.images && review.product.images[0] && (
                  <img
                    src={review.product.images[0]}
                    alt={review.product.title}
                    className="w-12 h-12 rounded object-cover"
                  />
                )}
                <p className="text-sm text-gray-600">
                  Product: {review.product.title}
                </p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
