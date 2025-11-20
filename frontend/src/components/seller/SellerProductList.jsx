import { useDispatch, useSelector } from 'react-redux';
import { deleteProduct } from '../../store/slices/productSlice';
import { useState } from 'react';

const SellerProductList = ({ products, onEdit }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.products);
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setDeletingId(productId);
        await dispatch(deleteProduct(productId)).unwrap();
      } catch (error) {
        alert('Failed to delete product: ' + error);
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (!products || products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">My Products</h2>
        <p className="text-gray-500 text-center py-8">
          You haven't added any products yet. Use the form above to create your first product listing.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">My Products ({products.length})</h2>
      
      <div className="space-y-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col md:flex-row gap-4">
              {/* Product Image */}
              <div className="flex-shrink-0">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.title}
                    className="w-full md:w-32 h-32 object-cover rounded-md"
                  />
                ) : (
                  <div className="w-full md:w-32 h-32 bg-gray-200 rounded-md flex items-center justify-center">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {product.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {product.description.length > 100
                        ? `${product.description.substring(0, 100)}...`
                        : product.description}
                    </p>
                  </div>
                  <span className="text-lg font-bold text-green-600 ml-4">
                    ${product.price.toFixed(2)}
                  </span>
                </div>

                {/* Tags and Category */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {product.sustainabilityTags?.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {product.category && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {product.category}
                    </span>
                  )}
                </div>

                {/* Stock and Status */}
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <span>
                    Stock: <span className="font-medium">{product.stock}</span>
                  </span>
                  <span>
                    Status:{' '}
                    <span
                      className={`font-medium ${
                        product.isActive ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </span>
                  {product.averageRating > 0 && (
                    <span>
                      Rating:{' '}
                      <span className="font-medium">
                        ⭐ {product.averageRating.toFixed(1)} ({product.reviewCount})
                      </span>
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => onEdit(product)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product._id)}
                    disabled={loading || deletingId === product._id}
                    className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                  >
                    {deletingId === product._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SellerProductList;
