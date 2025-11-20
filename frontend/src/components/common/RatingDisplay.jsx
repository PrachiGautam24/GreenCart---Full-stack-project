const RatingDisplay = ({ rating, reviewCount, size = 'medium' }) => {
  const sizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-xl',
  };

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        // Full star
        stars.push(
          <span key={i} className="text-yellow-400">
            ★
          </span>
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        // Half star
        stars.push(
          <span key={i} className="text-yellow-400">
            ★
          </span>
        );
      } else {
        // Empty star
        stars.push(
          <span key={i} className="text-gray-300">
            ★
          </span>
        );
      }
    }

    return stars;
  };

  return (
    <div className={`flex items-center gap-1 ${sizeClasses[size]}`}>
      <div className="flex">{renderStars()}</div>
      <span className="text-gray-600 ml-1">
        {rating.toFixed(1)}
        {reviewCount !== undefined && (
          <span className="text-gray-400"> ({reviewCount})</span>
        )}
      </span>
    </div>
  );
};

export default RatingDisplay;
