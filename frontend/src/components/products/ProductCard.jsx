import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { _id, title, price, images, sustainabilityTags, seller, averageRating, reviewCount } = product;

  const tagColors = {
    organic: 'bg-green-100 text-green-800',
    handmade: 'bg-blue-100 text-blue-800',
    recycled: 'bg-purple-100 text-purple-800',
  };

  const tagIcons = {
    organic: '🌱',
    handmade: '✋',
    recycled: '♻️',
  };

  return (
    <Link to={`/products/${_id}`} className="block group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
        {/* Product Image */}
        <div className="relative h-48 sm:h-56 md:h-48 lg:h-56 bg-gray-200 overflow-hidden">
          {images && images.length > 0 ? (
            <img
              src={images[0]}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-green-600 transition-colors">
            {title}
          </h3>

          {/* Price */}
          <p className="text-xl sm:text-2xl font-bold text-green-600 mb-3">
            ${price.toFixed(2)}
          </p>

          {/* Sustainability Tags */}
          {sustainabilityTags && sustainabilityTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {sustainabilityTags.map((tag) => (
                <span
                  key={tag}
                  className={`px-2 py-1 rounded-full text-xs font-medium ${tagColors[tag] || 'bg-gray-100 text-gray-800'}`}
                >
                  {tagIcons[tag]} {tag.charAt(0).toUpperCase() + tag.slice(1)}
                </span>
              ))}
            </div>
          )}

          {/* Seller Info */}
          {seller && (
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{seller.username}</span>
              </div>

              {/* Rating */}
              {averageRating > 0 && (
                <div className="flex items-center">
                  <svg
                    className="w-4 h-4 text-yellow-400 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span>{averageRating.toFixed(1)}</span>
                  <span className="text-gray-400 ml-1">({reviewCount})</span>
                </div>
              )}
            </div>
          )}

          {/* City */}
          {seller?.city && (
            <div className="flex items-center text-xs text-gray-500 mt-2">
              <svg
                className="w-3 h-3 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{seller.city}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
