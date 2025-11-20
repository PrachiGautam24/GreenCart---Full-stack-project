import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProfile } from './store/slices/authSlice';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleProtectedRoute from './components/auth/RoleProtectedRoute';
import ErrorBoundary from './components/common/ErrorBoundary';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import SellerProfilePage from './pages/SellerProfilePage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const dispatch = useDispatch();
  const { token, user } = useSelector((state) => state.auth);

  useEffect(() => {
    // Fetch user profile if token exists but user data is not loaded
    if (token && !user) {
      dispatch(getProfile());
    }
  }, [dispatch, token, user]);

  return (
    <ErrorBoundary>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/sellers/:id" element={<SellerProfilePage />} />

            {/* Protected Routes - Buyer */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <ProtectedRoute>
                  <CheckoutPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders/:orderId"
              element={
                <ProtectedRoute>
                  <OrderDetailPage />
                </ProtectedRoute>
              }
            />

            {/* Protected Routes - Seller/Admin */}
            <Route
              path="/dashboard"
              element={
                <RoleProtectedRoute allowedRoles={['seller', 'admin']}>
                  <DashboardPage />
                </RoleProtectedRoute>
              }
            />

            {/* Protected Routes - Admin Only */}
            <Route
              path="/admin"
              element={
                <RoleProtectedRoute allowedRoles={['admin']}>
                  <AdminPage />
                </RoleProtectedRoute>
              }
            />

            {/* 404 Not Found - Must be last */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
    </ErrorBoundary>
  );
}

export default App;
