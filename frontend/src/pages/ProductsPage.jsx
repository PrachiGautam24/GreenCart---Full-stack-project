import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';
import ProductFilters from '../components/products/ProductFilters';
import ProductList from '../components/products/ProductList';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const ProductsPage = () => {
  const dispatch = useDispatch();
  const { products, filters, pagination, loading, error } = useSelector(
    (state) => state.products
  );
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch products on mount and when filters change
  useEffect(() => {
    handleFetchProducts();
  }, []);

  const handleFetchProducts = (page = currentPage) => {
    const filterParams = {
      ...filters,
      page,
    };
    dispatch(fetchProducts(filterParams));
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    handleFetchProducts(1);
  };

  const handleRetry = () => {
    handleFetchProducts();
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    handleFetchProducts(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 sm:mb-6">
          Discover Sustainable Products
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <ProductFilters onApplyFilters={handleApplyFilters} />
          </aside>

          {/* Products Main Content */}
          <main className="lg:col-span-3">
            {/* Error Message */}
            {error && <ErrorMessage message={error} onRetry={handleRetry} />}

            {/* Loading State */}
            {loading && <LoadingSpinner size="lg" />}

            {/* Products List */}
            {!loading && !error && (
              <>
                {/* Results Count */}
                {products.length > 0 && (
                  <div className="mb-4 text-sm sm:text-base text-gray-600">
                    Showing {products.length} product{products.length !== 1 ? 's' : ''}
                    {pagination.totalProducts > 0 && (
                      <span> of {pagination.totalProducts}</span>
                    )}
                  </div>
                )}

                <ProductList products={products} />

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-0 sm:space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`w-full sm:w-auto px-4 py-2 rounded-lg transition ${
                        currentPage === 1
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                      }`}
                    >
                      Previous
                    </button>

                    <div className="flex space-x-1 overflow-x-auto">
                      {[...Array(pagination.totalPages)].map((_, index) => {
                        const page = index + 1;
                        // Show first page, last page, current page, and pages around current
                        if (
                          page === 1 ||
                          page === pagination.totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page)}
                              className={`px-3 sm:px-4 py-2 rounded-lg transition ${
                                currentPage === page
                                  ? 'bg-green-600 text-white'
                                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (
                          page === currentPage - 2 ||
                          page === currentPage + 2
                        ) {
                          return (
                            <span key={page} className="px-2 py-2 text-gray-400">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === pagination.totalPages}
                      className={`w-full sm:w-auto px-4 py-2 rounded-lg transition ${
                        currentPage === pagination.totalPages
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
