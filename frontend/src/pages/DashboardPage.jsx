import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';
import ProductForm from '../components/seller/ProductForm';
import SellerProductList from '../components/seller/SellerProductList';
import LoadingSpinner from '../components/common/LoadingSpinner';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { products, loading } = useSelector((state) => state.products);
  const [productToEdit, setProductToEdit] = useState(null);
  const [showForm, setShowForm] = useState(true);

  // Filter products to show only the seller's products
  const sellerProducts = products.filter(
    (product) => product.seller?._id === user?.id || product.seller === user?.id
  );

  useEffect(() => {
    // Fetch all products (we'll filter on the frontend)
    dispatch(fetchProducts({}));
  }, [dispatch]);

  const handleEditProduct = (product) => {
    setProductToEdit(product);
    setShowForm(true);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormSuccess = () => {
    setProductToEdit(null);
    setShowForm(true);
    // Refresh products
    dispatch(fetchProducts({}));
  };

  const handleCancelEdit = () => {
    setProductToEdit(null);
  };

  if (loading && products.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Manage your product listings and track your sales
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Products</h3>
            <p className="text-3xl font-bold text-gray-900">{sellerProducts.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Active Listings</h3>
            <p className="text-3xl font-bold text-green-600">
              {sellerProducts.filter((p) => p.isActive).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-sm font-medium text-gray-600 mb-2">Total Stock</h3>
            <p className="text-3xl font-bold text-blue-600">
              {sellerProducts.reduce((sum, p) => sum + (p.stock || 0), 0)}
            </p>
          </div>
        </div>

        {/* Toggle Form Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            {showForm ? 'Hide Form' : 'Add New Product'}
          </button>
        </div>

        {/* Product Form */}
        {showForm && (
          <div className="mb-8">
            <ProductForm
              productToEdit={productToEdit}
              onSuccess={handleFormSuccess}
              onCancel={handleCancelEdit}
            />
          </div>
        )}

        {/* Product List */}
        <SellerProductList
          products={sellerProducts}
          onEdit={handleEditProduct}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
