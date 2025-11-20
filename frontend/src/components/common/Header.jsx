import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { logout } from '../../store/slices/authSlice';
import { fetchCart } from '../../store/slices/cartSlice';

const Header = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'buyer') {
      dispatch(fetchCart());
    }
  }, [dispatch, isAuthenticated, user?.role]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-green-600 text-white shadow-md sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-xl md:text-2xl font-bold hover:text-green-100 transition">
            🌱 GreenCart
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/products" className="hover:text-green-200 transition">
              Products
            </Link>

            {isAuthenticated ? (
              <>
                {user?.role === 'buyer' && (
                  <>
                    <Link to="/cart" className="hover:text-green-200 transition relative">
                      <div className="flex items-center gap-1">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                          />
                        </svg>
                        <span>Cart</span>
                        {items.length > 0 && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {items.length}
                          </span>
                        )}
                      </div>
                    </Link>
                    <Link to="/orders" className="hover:text-green-200 transition">
                      Orders
                    </Link>
                  </>
                )}

                {(user?.role === 'seller' || user?.role === 'admin') && (
                  <Link to="/dashboard" className="hover:text-green-200 transition">
                    Dashboard
                  </Link>
                )}

                {user?.role === 'admin' && (
                  <Link to="/admin" className="hover:text-green-200 transition">
                    Admin
                  </Link>
                )}

                <div className="flex items-center space-x-4">
                  <span className="text-sm">
                    Welcome, {user?.username}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="bg-green-700 hover:bg-green-800 px-4 py-2 rounded transition"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hover:text-green-200 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-green-700 hover:bg-green-800 px-4 py-2 rounded transition"
                >
                  Register
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-green-700 transition"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-green-500 pt-4 animate-fade-in">
            <div className="flex flex-col space-y-3">
              <Link
                to="/products"
                className="hover:bg-green-700 px-4 py-2 rounded transition"
                onClick={closeMobileMenu}
              >
                Products
              </Link>

              {isAuthenticated ? (
                <>
                  {user?.role === 'buyer' && (
                    <>
                      <Link
                        to="/cart"
                        className="hover:bg-green-700 px-4 py-2 rounded transition flex items-center justify-between"
                        onClick={closeMobileMenu}
                      >
                        <span>Cart</span>
                        {items.length > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {items.length}
                          </span>
                        )}
                      </Link>
                      <Link
                        to="/orders"
                        className="hover:bg-green-700 px-4 py-2 rounded transition"
                        onClick={closeMobileMenu}
                      >
                        Orders
                      </Link>
                    </>
                  )}

                  {(user?.role === 'seller' || user?.role === 'admin') && (
                    <Link
                      to="/dashboard"
                      className="hover:bg-green-700 px-4 py-2 rounded transition"
                      onClick={closeMobileMenu}
                    >
                      Dashboard
                    </Link>
                  )}

                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="hover:bg-green-700 px-4 py-2 rounded transition"
                      onClick={closeMobileMenu}
                    >
                      Admin
                    </Link>
                  )}

                  <div className="border-t border-green-500 pt-3 mt-3">
                    <p className="px-4 py-2 text-sm text-green-100">
                      Welcome, {user?.username}
                    </p>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left hover:bg-green-700 px-4 py-2 rounded transition"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="hover:bg-green-700 px-4 py-2 rounded transition"
                    onClick={closeMobileMenu}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-green-700 hover:bg-green-800 px-4 py-2 rounded transition text-center"
                    onClick={closeMobileMenu}
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
