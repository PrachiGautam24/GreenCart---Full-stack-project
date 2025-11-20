import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-500 to-green-700 text-white py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 animate-fade-in">
            Welcome to GreenCart 🌱
          </h1>
          <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
            Your local marketplace for sustainable, eco-friendly products. 
            Connect with sellers offering organic, handmade, and recycled goods.
          </p>
          <Link
            to="/products"
            className="bg-white text-green-600 px-6 sm:px-8 py-2 sm:py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 active:scale-95 inline-block shadow-lg"
          >
            Browse Products
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 sm:mb-12">
            Why Choose GreenCart?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <div className="text-4xl sm:text-5xl mb-4">🌱</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Sustainable Products</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Discover organic, handmade, and recycled products from local sellers.
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <div className="text-4xl sm:text-5xl mb-4">🏘️</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Local Community</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Support local sellers and reduce your carbon footprint.
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow sm:col-span-2 md:col-span-1">
              <div className="text-4xl sm:text-5xl mb-4">⭐</div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">Trusted Reviews</h3>
              <p className="text-sm sm:text-base text-gray-600">
                Make informed decisions with community-driven feedback.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-green-50 to-green-100 py-12 sm:py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
            Ready to Start Shopping?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Join our community of eco-conscious buyers and sellers today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <Link
              to="/register"
              className="w-full sm:w-auto bg-green-600 text-white px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all transform hover:scale-105 active:scale-95 shadow-lg"
            >
              Get Started
            </Link>
            <Link
              to="/products"
              className="w-full sm:w-auto bg-white text-green-600 px-6 sm:px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all transform hover:scale-105 active:scale-95 border-2 border-green-600 shadow-lg"
            >
              Explore Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
