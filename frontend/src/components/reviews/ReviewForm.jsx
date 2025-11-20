import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitReview, clearSubmitSuccess } from '../../store/slices/reviewSlice';
import { validateRating } from '../../utils/validators';

const ReviewForm = ({ productId, sellerId, orderId, onSuccess }) => {
  const dispatch = useDispatch();
  const { loading, error, submitSuccess } = useSelector((state) => state.review);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const ratingError = validateRating(rating);
    if (ratingError) {
      setValidationError(ratingError);
      return;
    }
    
    setValidationError('');

    const reviewData = {
      product: productId,
      seller: sellerId,
      order: orderId,
      rating,
      comment: comment.trim()
    };

    const result = await dispatch(submitReview(reviewData));
    
    if (result.type === 'review/submitReview/fulfilled') {
      setRating(0);
      setComment('');
      setValidationError('');
      if (onSuccess) {
        onSuccess();
      }
      // Clear success message after 3 seconds
      setTimeout(() => {
        dispatch(clearSubmitSuccess());
      }, 3000);
    }
  };

  const handleRatingClick = (value) => {
    setRating(value);
    setValidationError('');
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => handleRatingClick(i)}
          onMouseEnter={() => setHoveredRating(i)}
          onMouseLeave={() => setHoveredRating(0)}
          className="text-3xl focus:outline-none transition-colors"
          aria-label={`Rate ${i} out of 5 stars`}
        >
          <span
            className={
              i <= (hoveredRating || rating)
                ? 'text-yellow-400'
                : 'text-gray-300'
            }
          >
            ★
          </span>
        </button>
      );
    }
    return stars;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Write a Review
      </h3>

      {submitSuccess && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700">Review submitted successfully!</p>
        </div>
      )}

      {(error || validationError) && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg" role="alert">
          <p className="text-red-700">{error || validationError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Rating *
          </label>
          <div className="flex gap-1">
            {renderStars()}
          </div>
          {rating > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {rating} out of 5 stars
            </p>
          )}
        </div>

        <div className="mb-4">
          <label
            htmlFor="comment"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Comment (Optional)
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Share your experience with this product..."
          />
        </div>

        <button
          type="submit"
          disabled={loading || rating === 0}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
