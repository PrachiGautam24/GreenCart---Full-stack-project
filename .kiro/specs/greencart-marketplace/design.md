# GreenCart Marketplace - Design Document

## Overview

GreenCart is a full-stack eco-commerce platform built with a modern MERN stack architecture. The system follows a three-tier architecture with a React frontend, Express.js REST API backend, and MongoDB database. The platform implements JWT-based authentication with role-based access control (RBAC) to support three user types: Admins, Sellers, and Buyers.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────┐
│         React Frontend (SPA)            │
│   - Redux Toolkit (State Management)    │
│   - Tailwind CSS (Styling)              │
│   - React Router (Navigation)           │
└──────────────┬──────────────────────────┘
               │ HTTP/REST API
               │ (JWT in Headers)
┌──────────────▼──────────────────────────┐
│       Express.js Backend API            │
│   - JWT Authentication Middleware       │
│   - Role-Based Access Control           │
│   - Business Logic Layer                │
└──────────────┬──────────────────────────┘
               │
        ┌──────┴──────┐
        │             │
┌───────▼──────┐  ┌──▼─────────────┐
│   MongoDB    │  │   Cloudinary   │
│   Database   │  │  Image Storage │
└──────────────┘  └────────────────┘
```

### Technology Stack

**Frontend:**
- React.js 18+ with functional components and hooks
- Redux Toolkit for centralized state management
- Tailwind CSS for utility-first styling
- Axios for API communication
- React Router v6 for client-side routing

**Backend:**
- Node.js with Express.js framework
- Mongoose ODM for MongoDB interactions
- JWT (jsonwebtoken) for authentication
- bcrypt for password hashing
- Multer for file upload handling
- Cloudinary SDK for image management

**Database:**
- MongoDB for document-based data storage
- Mongoose schemas with validation

## Components and Interfaces

### Frontend Component Structure

```
src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.jsx
│   │   ├── RegisterForm.jsx
│   │   └── ProtectedRoute.jsx
│   ├── products/
│   │   ├── ProductCard.jsx
│   │   ├── ProductList.jsx
│   │   ├── ProductDetail.jsx
│   │   ├── ProductForm.jsx (Seller)
│   │   └── ProductFilters.jsx
│   ├── cart/
│   │   ├── CartItem.jsx
│   │   ├── CartSummary.jsx
│   │   └── CheckoutForm.jsx
│   ├── seller/
│   │   ├── SellerProfile.jsx
│   │   ├── SellerDashboard.jsx
│   │   └── SellerProductList.jsx
│   ├── feedback/
│   │   ├── ReviewForm.jsx
│   │   ├── ReviewList.jsx
│   │   └── RatingDisplay.jsx
│   ├── admin/
│   │   ├── AdminDashboard.jsx
│   │   ├── UserManagement.jsx
│   │   └── ContentModeration.jsx
│   └── common/
│       ├── Header.jsx
│       ├── Footer.jsx
│       ├── LoadingSpinner.jsx
│       └── ErrorMessage.jsx
├── pages/
│   ├── HomePage.jsx
│   ├── ProductsPage.jsx
│   ├── ProductDetailPage.jsx
│   ├── CartPage.jsx
│   ├── CheckoutPage.jsx
│   ├── SellerProfilePage.jsx
│   ├── DashboardPage.jsx
│   └── AdminPage.jsx
├── store/
│   ├── store.js
│   └── slices/
│       ├── authSlice.js
│       ├── productSlice.js
│       ├── cartSlice.js
│       └── userSlice.js
├── services/
│   ├── api.js (Axios instance)
│   ├── authService.js
│   ├── productService.js
│   ├── cartService.js
│   └── reviewService.js
└── utils/
    ├── validators.js
    └── constants.js
```

### Backend API Structure

```
server/
├── models/
│   ├── User.js
│   ├── Product.js
│   ├── Order.js
│   └── Review.js
├── routes/
│   ├── auth.js
│   ├── products.js
│   ├── cart.js
│   ├── orders.js
│   ├── reviews.js
│   ├── sellers.js
│   └── admin.js
├── controllers/
│   ├── authController.js
│   ├── productController.js
│   ├── orderController.js
│   ├── reviewController.js
│   ├── sellerController.js
│   └── adminController.js
├── middleware/
│   ├── auth.js (JWT verification)
│   ├── roleCheck.js (RBAC)
│   ├── upload.js (Multer config)
│   └── errorHandler.js
├── utils/
│   ├── cloudinary.js
│   └── validators.js
├── config/
│   └── db.js
└── server.js
```

## Data Models

### User Model

```javascript
{
  _id: ObjectId,
  username: String (required, unique),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['buyer', 'seller', 'admin'], default: 'buyer'),
  city: String (required),
  profileImage: String (URL),
  createdAt: Date,
  updatedAt: Date
}
```

### Product Model

```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String (required),
  price: Number (required, min: 0),
  images: [String] (Cloudinary URLs),
  sustainabilityTags: [String] (enum: ['organic', 'handmade', 'recycled']),
  seller: ObjectId (ref: 'User'),
  category: String,
  stock: Number (default: 0),
  averageRating: Number (default: 0),
  reviewCount: Number (default: 0),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

### Order Model

```javascript
{
  _id: ObjectId,
  buyer: ObjectId (ref: 'User'),
  items: [{
    product: ObjectId (ref: 'Product'),
    quantity: Number,
    price: Number,
    seller: ObjectId (ref: 'User')
  }],
  totalAmount: Number,
  status: String (enum: ['pending', 'completed', 'cancelled'], default: 'pending'),
  paymentStatus: String (enum: ['pending', 'completed', 'failed'], default: 'pending'),
  paymentMethod: String (default: 'mock'),
  createdAt: Date,
  updatedAt: Date
}
```

### Review Model

```javascript
{
  _id: ObjectId,
  product: ObjectId (ref: 'Product'),
  seller: ObjectId (ref: 'User'),
  buyer: ObjectId (ref: 'User'),
  order: ObjectId (ref: 'Order'),
  rating: Number (required, min: 1, max: 5),
  comment: String,
  isApproved: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### Authentication Routes (`/api/auth`)

- `POST /register` - Register new user
- `POST /login` - Login and receive JWT token
- `GET /me` - Get current user profile (protected)
- `PUT /profile` - Update user profile (protected)

### Product Routes (`/api/products`)

- `GET /` - Get all products (with filters: tags, search, city)
- `GET /:id` - Get single product details
- `POST /` - Create product (seller/admin only)
- `PUT /:id` - Update product (seller/admin only)
- `DELETE /:id` - Delete product (seller/admin only)
- `GET /seller/:sellerId` - Get products by seller

### Cart Routes (`/api/cart`)

- `GET /` - Get user's cart (protected)
- `POST /add` - Add item to cart (protected)
- `PUT /update/:itemId` - Update cart item quantity (protected)
- `DELETE /remove/:itemId` - Remove item from cart (protected)
- `DELETE /clear` - Clear entire cart (protected)

### Order Routes (`/api/orders`)

- `POST /checkout` - Create order from cart (buyer only)
- `GET /` - Get user's orders (protected)
- `GET /:id` - Get order details (protected)

### Review Routes (`/api/reviews`)

- `POST /` - Create review (buyer only, must have purchased)
- `GET /product/:productId` - Get reviews for product
- `GET /seller/:sellerId` - Get reviews for seller
- `DELETE /:id` - Delete review (admin only)

### Seller Routes (`/api/sellers`)

- `GET /:id` - Get seller profile with stats
- `GET /:id/products` - Get seller's products
- `GET /:id/reviews` - Get seller's reviews

### Admin Routes (`/api/admin`)

- `GET /users` - Get all users (admin only)
- `PUT /users/:id/role` - Update user role (admin only)
- `PUT /users/:id/status` - Activate/deactivate user (admin only)
- `DELETE /products/:id` - Remove product (admin only)
- `DELETE /reviews/:id` - Remove review (admin only)

## State Management (Redux)

### Auth Slice

```javascript
{
  user: null | { id, username, email, role, city },
  token: null | string,
  isAuthenticated: boolean,
  loading: boolean,
  error: null | string
}
```

### Product Slice

```javascript
{
  products: [],
  currentProduct: null,
  filters: {
    search: '',
    tags: [],
    city: ''
  },
  loading: boolean,
  error: null | string
}
```

### Cart Slice

```javascript
{
  items: [{
    product: {},
    quantity: number
  }],
  totalAmount: number,
  loading: boolean,
  error: null | string
}
```

## Authentication Flow

1. User submits credentials to `/api/auth/login` or `/api/auth/register`
2. Backend validates credentials and generates JWT token containing `{ userId, role }`
3. Frontend stores token in Redux state and localStorage
4. All subsequent API requests include token in `Authorization: Bearer <token>` header
5. Backend middleware verifies token and attaches user info to `req.user`
6. Role-based middleware checks `req.user.role` against required permissions

## Image Upload Flow

1. User selects image file in ProductForm component
2. Frontend sends multipart/form-data request to backend
3. Multer middleware processes file upload
4. Backend uploads image to Cloudinary using SDK
5. Cloudinary returns secure URL
6. Backend stores URL in Product model
7. Frontend displays image using Cloudinary URL

## Error Handling

### Frontend Error Handling

- API errors caught in Redux async thunks
- Error messages stored in slice state
- ErrorMessage component displays user-friendly messages
- Network errors show retry option
- Validation errors displayed inline on forms

### Backend Error Handling

- Centralized error handling middleware
- Mongoose validation errors formatted consistently
- JWT errors return 401 Unauthorized
- Permission errors return 403 Forbidden
- Not found errors return 404
- Server errors return 500 with generic message (no stack traces in production)

**Error Response Format:**

```javascript
{
  success: false,
  error: {
    message: "User-friendly error message",
    code: "ERROR_CODE"
  }
}
```

## Testing Strategy

### Frontend Testing

- **Unit Tests**: Test Redux slices, utility functions, and service modules using Jest
- **Component Tests**: Test individual components with React Testing Library
- **Integration Tests**: Test user flows (login, add to cart, checkout) with React Testing Library
- **E2E Tests**: Optional Cypress tests for critical paths

### Backend Testing

- **Unit Tests**: Test controllers, middleware, and utility functions with Jest
- **Integration Tests**: Test API endpoints with Supertest
- **Database Tests**: Use MongoDB Memory Server for isolated testing
- **Authentication Tests**: Verify JWT generation, validation, and RBAC

### Test Coverage Goals

- Aim for 70%+ coverage on critical business logic
- Focus on authentication, authorization, cart calculations, and order processing
- Test error handling paths
- Validate input sanitization and security measures

## Security Considerations

1. **Password Security**: Use bcrypt with salt rounds of 10+
2. **JWT Security**: Set reasonable expiration (24 hours), use strong secret
3. **Input Validation**: Validate and sanitize all user inputs on backend
4. **SQL Injection Prevention**: Mongoose handles parameterization
5. **XSS Prevention**: React escapes output by default, sanitize rich text
6. **CSRF Protection**: Use SameSite cookies if implementing cookie-based auth
7. **Rate Limiting**: Implement rate limiting on auth endpoints
8. **CORS**: Configure CORS to allow only frontend domain
9. **Environment Variables**: Store secrets in .env file, never commit
10. **Role Verification**: Always verify roles on backend, never trust frontend

## Performance Considerations

1. **Database Indexing**: Index frequently queried fields (seller, sustainabilityTags, city)
2. **Pagination**: Implement pagination for product listings (20 items per page)
3. **Image Optimization**: Use Cloudinary transformations for responsive images
4. **Caching**: Consider Redis for session storage and frequently accessed data
5. **Lazy Loading**: Implement code splitting and lazy loading for routes
6. **Debouncing**: Debounce search input to reduce API calls
7. **Optimistic Updates**: Update UI optimistically for better UX (cart operations)

## Deployment Architecture

**Frontend**: Deploy to Vercel or Netlify
**Backend**: Deploy to Heroku, Railway, or AWS EC2
**Database**: MongoDB Atlas (managed cloud service)
**Images**: Cloudinary (managed cloud service)

**Environment Variables:**
- `MONGODB_URI`
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `NODE_ENV`
- `PORT`
