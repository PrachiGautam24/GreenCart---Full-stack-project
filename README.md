# GreenCart - Sustainable Marketplace

A modern e-commerce platform connecting eco-conscious consumers with local sellers offering sustainable, organic, and handmade products.

## 🌱 About

GreenCart is a marketplace dedicated to promoting sustainable commerce. We connect environmentally conscious buyers with local sellers who offer eco-friendly products including organic goods, handmade items, and recycled materials.

## ✨ Features

- **User Authentication** - Secure registration and login system
- **Multi-Role Platform** - Support for buyers, sellers, and administrators
- **Product Catalog** - Browse and search sustainable products
- **Shopping Cart** - Seamless cart and checkout experience
- **Seller Dashboard** - Comprehensive tools for managing products and orders
- **Review System** - Customer reviews and ratings
- **Responsive Design** - Optimized for desktop and mobile devices

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ 
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/greencart-marketplace.git
   cd greencart-marketplace
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Create .env file with your configuration
   cp .env.example .env
   
   # Start the backend server
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   
   # Start the development server
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:5000

### Environment Variables

Create a `.env` file in the backend directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/greencart
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=24h
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## 🏗️ Project Structure

```
greencart-marketplace/
├── backend/                 # Node.js/Express API
│   ├── controllers/        # Route controllers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── utils/             # Utility functions
│   └── server.js          # Entry point
├── frontend/               # React application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── store/         # Redux store
│   │   └── utils/         # Utility functions
│   └── public/            # Static assets
└── README.md
```

## 🛠️ Technology Stack

**Frontend:**
- React 18 with TypeScript
- Redux Toolkit for state management
- React Router for navigation
- Tailwind CSS for styling
- Shadcn/ui component library

**Backend:**
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- Cloudinary for image storage
- Security middleware (Helmet, CORS, rate limiting)

## 📱 Usage

### For Buyers
1. Register or login to your account
2. Browse products by category or search
3. Add items to your cart
4. Complete secure checkout
5. Leave reviews for purchased products

### For Sellers
1. Register as a buyer first
2. Upgrade to seller account with business information
3. Access seller dashboard
4. Add and manage your products
5. Track orders and customer reviews

## 🔒 Security Features

- JWT-based authentication
- Input validation and sanitization
- Rate limiting on API endpoints
- Secure HTTP headers with Helmet
- CORS protection
- Password hashing with bcrypt

## 🤝 Contributing

We welcome contributions! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email support@greencart.com or create an issue in this repository.