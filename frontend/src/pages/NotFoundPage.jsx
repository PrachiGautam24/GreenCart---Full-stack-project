import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-xl p-8 text-center">
        <div className="mb-6">
          <h1 className="text-9xl font-bold text-green-600">404</h1>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all transform hover:scale-105"
          >
            Go to Home
          </Link>
          
          <Link
            to="/products"
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Browse Products
          </Link>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help? <Link to="/" className="text-green-600 hover:text-green-700 font-semibold">Contact Support</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
