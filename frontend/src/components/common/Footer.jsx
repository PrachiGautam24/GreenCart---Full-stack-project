const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">GreenCart</h3>
            <p className="text-gray-400">
              Connecting local sellers with eco-conscious buyers for a sustainable future.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="/products" className="text-gray-400 hover:text-white transition">
                  Browse Products
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-400 hover:text-white transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-400 hover:text-white transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Sustainability</h4>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-400">
                <span className="mr-2">🌱</span> Organic Products
              </li>
              <li className="flex items-center text-gray-400">
                <span className="mr-2">✋</span> Handmade Items
              </li>
              <li className="flex items-center text-gray-400">
                <span className="mr-2">♻️</span> Recycled Materials
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} GreenCart. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
