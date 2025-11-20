# Implementation Plan

- [x] 1. Initialize project structure and dependencies





  - Create root directory with separate frontend and backend folders
  - Initialize Node.js backend with Express.js, install dependencies (express, mongoose, jsonwebtoken, bcrypt, multer, cloudinary, cors, dotenv)
  - Initialize React frontend with Vite or Create React App, install dependencies (react-router-dom, @reduxjs/toolkit, react-redux, axios, tailwindcss)
  - Configure Tailwind CSS in frontend
  - Create .env.example files for both frontend and backend with required environment variables
  - Set up .gitignore files to exclude node_modules and .env files
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 2. Set up backend database connection and configuration





  - Create MongoDB connection utility in config/db.js
  - Set up environment variable configuration for MongoDB URI, JWT secret, and Cloudinary credentials
  - Create server.js entry point with Express app initialization
  - Configure CORS middleware to allow frontend origin
  - Add JSON body parser middleware
  - _Requirements: 1.1, 1.2, 1.3_

- [x] 3. Implement User model and authentication system






  - [x] 3.1 Create User model with Mongoose schema

    - Define User schema with username, email, password, role, city, profileImage fields
    - Add password hashing pre-save hook using bcrypt
    - Add method to compare passwords for login
    - Add timestamps and unique constraints
    - _Requirements: 1.1, 1.5_
  - [x] 3.2 Create authentication middleware


    - Implement JWT verification middleware to extract and validate tokens
    - Create role-based access control middleware to check user roles
    - Add error handling for invalid or expired tokens
    - _Requirements: 1.2, 1.3, 1.4_
  - [x] 3.3 Implement authentication controller and routes


    - Create register endpoint to create new users and return JWT
    - Create login endpoint to authenticate users and return JWT
    - Create get profile endpoint (protected) to return current user data
    - Create update profile endpoint (protected) to modify user information
    - Add input validation for email format, password strength, and required fields
    - _Requirements: 1.1, 1.2, 1.3_
 
- [x] 4. Implement Product model and CRUD operations





  - [x] 4.1 Create Product model with Mongoose schema


    - Define Product schema with title, description, price, images, sustainabilityTags, seller, category, stock, averageRating, reviewCount, isActive fields
    - Add validation for price (minimum 0), required fields, and sustainability tag enum
    - Add seller reference to User model
    - Add timestamps
    - _Requirements: 2.1, 2.3_
  - [x] 4.2 Set up Cloudinary integration


    - Create Cloudinary configuration utility with API credentials
    - Implement Multer middleware for handling multipart file uploads
    - Create image upload utility function that uploads to Cloudinary and returns secure URL
    - _Requirements: 2.2_
  - [x] 4.3 Implement product controller and routes


    - Create endpoint to add new product (seller/admin only) with image upload
    - Create endpoint to get all products with filtering by sustainability tags, search query, and city
    - Create endpoint to get single product by ID with populated seller information
    - Create endpoint to update product (seller/admin only, verify ownership)
    - Create endpoint to delete product (seller/admin only, verify ownership)
    - Create endpoint to get products by seller ID
    - Add pagination support (20 items per page)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 5. Implement shopping cart functionality






  - [x] 5.1 Create cart state management in backend

    - Add cart field to User model as embedded array of {product, quantity}
    - Create cart controller with add, update, remove, and clear operations
    - Implement cart total calculation logic
    - _Requirements: 4.1, 4.2_

  - [x] 5.2 Create cart API endpoints

    - Create endpoint to get user's cart (protected)
    - Create endpoint to add item to cart with quantity (protected)
    - Create endpoint to update cart item quantity (protected)
    - Create endpoint to remove item from cart (protected)
    - Create endpoint to clear entire cart (protected)
    - Add validation to prevent adding out-of-stock items
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 6. Implement Order model and checkout process






  - [x] 6.1 Create Order model with Mongoose schema

    - Define Order schema with buyer, items array, totalAmount, status, paymentStatus, paymentMethod fields
    - Add items as array of {product, quantity, price, seller}
    - Add status enum (pending, completed, cancelled)
    - Add timestamps
    - _Requirements: 4.5, 4.6_

  - [x] 6.2 Implement checkout controller and routes

    - Create checkout endpoint that creates order from cart items (buyer only)
    - Implement mock payment gateway simulation (always succeeds)
    - Clear cart after successful order creation
    - Create endpoint to get user's order history (protected)
    - Create endpoint to get single order details (protected, verify ownership)
    - _Requirements: 4.5, 4.6_
-

- [x] 7. Implement Review model and feedback system



  - [x] 7.1 Create Review model with Mongoose schema


    - Define Review schema with product, seller, buyer, order, rating, comment, isApproved fields
    - Add rating validation (1-5 range)
    - Add references to Product, User, and Order models
    - Add timestamps
    - _Requirements: 6.1, 6.2_

  - [x] 7.2 Implement review controller and routes

    - Create endpoint to submit review (buyer only, verify purchase)
    - Add validation to prevent multiple reviews for same purchase
    - Create endpoint to get reviews for specific product
    - Create endpoint to get reviews for specific seller
    - Implement automatic calculation of product and seller average ratings
    - Update Product model averageRating and reviewCount when review is added
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 8. Implement seller profile functionality




  - [x] 8.1 Create seller controller and routes


    - Create endpoint to get seller profile with username, location, registration date, product count
    - Create endpoint to get seller's active products
    - Create endpoint to get seller's reviews with average rating calculation
    - Add aggregation to calculate seller statistics (total products, average rating)
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
-

- [x] 9. Implement admin management features



  - [x] 9.1 Create admin controller and routes


    - Create endpoint to get all users with role information (admin only)
    - Create endpoint to update user role (admin only)
    - Create endpoint to activate/deactivate user accounts (admin only)
    - Create endpoint to delete any product (admin only)
    - Create endpoint to delete any review (admin only)
    - Add logging for admin actions with timestamp and admin ID
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 10. Set up frontend routing and layout





  - Create React Router configuration with routes for all pages
  - Create ProtectedRoute component that checks authentication and redirects to login
  - Create RoleProtectedRoute component that checks user role
  - Implement Header component with navigation links and user menu
  - Implement Footer component with platform information
  - Create basic page components (HomePage, ProductsPage, ProductDetailPage, CartPage, CheckoutPage, SellerProfilePage, DashboardPage, AdminPage)
  - _Requirements: 8.1, 8.2, 8.5_

- [x] 11. Implement Redux store and authentication state




  - [x] 11.1 Configure Redux store


    - Create Redux store with configureStore from Redux Toolkit
    - Set up store provider in App component

    - _Requirements: 1.1, 1.2_
  - [x] 11.2 Create auth slice and service

    - Create authSlice with user, token, isAuthenticated, loading, error state
    - Implement register, login, logout, and getProfile async thunks
    - Create authService with API calls using Axios
    - Add token persistence to localStorage
    - Create Axios interceptor to attach token to all requests
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 11.3 Create authentication components

    - Create LoginForm component with email and password inputs
    - Create RegisterForm component with username, email, password, role, city inputs
    - Add form validation and error display
    - Dispatch Redux actions on form submission
    - Redirect to home page after successful authentication
    - _Requirements: 1.1, 1.2_
-

- [x] 12. Implement product listing and filtering





  - [x] 12.1 Create product slice and service

    - Create productSlice with products, currentProduct, filters, loading, error state
    - Implement fetchProducts, fetchProductById async thunks
    - Create productService with API calls for getting products
    - Add filter actions for search, tags, and city
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 12.2 Create product display components

    - Create ProductCard component displaying image, title, price, sustainability tags, seller info
    - Create ProductList component that maps over products array
    - Create ProductFilters component with search input, tag checkboxes, and city filter
    - Implement filter logic that dispatches Redux actions
    - Add loading spinner and error message display
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 12.3 Create ProductsPage

    - Fetch products on component mount
    - Display ProductFilters and ProductList components
    - Implement pagination controls
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 13. Implement product detail and seller profile pages






  - [x] 13.1 Create ProductDetailPage

    - Fetch product by ID from URL parameter
    - Display product images, title, description, price, sustainability tags
    - Display seller information with link to seller profile
    - Show product reviews and average rating
    - Add "Add to Cart" button (buyer only)
    - _Requirements: 3.5, 5.1, 5.3, 6.3_
  - [x] 13.2 Create SellerProfilePage


    - Fetch seller profile data by ID from URL parameter
    - Display seller username, city, registration date, product count
    - Display seller's average rating
    - Show list of seller's active products
    - Display seller's reviews
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 14. Implement seller dashboard and product management




  - [x] 14.1 Create product management slice and service


    - Add createProduct, updateProduct, deleteProduct async thunks to productSlice
    - Create productService methods for seller CRUD operations
    - _Requirements: 2.1, 2.2, 2.4, 2.5, 2.6_

  - [x] 14.2 Create seller product management components

    - Create ProductForm component for adding/editing products with image upload
    - Add form fields for title, description, price, sustainability tags, category, stock
    - Implement image preview before upload
    - Create SellerProductList component showing seller's products with edit/delete buttons
    - Create SellerDashboard page combining ProductForm and SellerProductList
    - Add role protection (seller/admin only)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_
-

- [x] 15. Implement shopping cart UI





  - [x] 15.1 Create cart slice and service

    - Create cartSlice with items, totalAmount, loading, error state
    - Implement fetchCart, addToCart, updateCartItem, removeFromCart, clearCart async thunks
    - Create cartService with API calls for cart operations
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 15.2 Create cart components

    - Create CartItem component displaying product info, quantity controls, remove button
    - Create CartSummary component showing total amount
    - Create CartPage combining CartItem list and CartSummary
    - Implement quantity increment/decrement with Redux dispatch
    - Add "Proceed to Checkout" button
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

- [x] 16. Implement checkout and order functionality





  - [x] 16.1 Create order slice and service


    - Create orderSlice with orders, currentOrder, loading, error state
    - Implement createOrder, fetchOrders, fetchOrderById async thunks
    - Create orderService with API calls for order operations
    - _Requirements: 4.5, 4.6_
  - [x] 16.2 Create checkout components


    - Create CheckoutForm component with mock payment interface
    - Display order summary with items and total
    - Add "Complete Purchase" button that dispatches createOrder
    - Show success message and redirect to order confirmation
    - Create OrderHistory component displaying user's past orders
    - _Requirements: 4.5, 4.6_

- [x] 17. Implement review and rating system







  - [x] 17.1 Create review slice and service

    - Create reviewSlice with reviews, loading, error state
    - Implement submitReview, fetchProductReviews, fetchSellerReviews async thunks

    - Create reviewService with API calls for review operations
    - _Requirements: 6.1, 6.2, 6.3_
  - [x] 17.2 Create review components

    - Create RatingDisplay component showing star rating visually
    - Create ReviewForm component with rating selector (1-5 stars) and comment textarea
    - Create ReviewList component displaying reviews with buyer name, rating, comment, date
    - Add ReviewForm to order confirmation page (buyer only, after purchase)
    - Display ReviewList on ProductDetailPage and SellerProfilePage
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5_

- [x] 18. Implement admin dashboard






  - [x] 18.1 Create admin slice and service

    - Create adminSlice with users, loading, error state
    - Implement fetchUsers, updateUserRole, toggleUserStatus, deleteProduct, deleteReview async thunks
    - Create adminService with API calls for admin operations
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_


  - [x] 18.2 Create admin components





    - Create UserManagement component with table of all users
    - Add role dropdown and activate/deactivate toggle for each user
    - Create ContentModeration component showing flagged products and reviews
    - Add delete buttons for products and reviews
    - Create AdminDashboard page combining UserManagement and ContentModeration
    - Add role protection (admin only)
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 19. Implement responsive design and UI polish





  - Apply Tailwind CSS utility classes for responsive layouts across all components
  - Ensure mobile-friendly navigation with hamburger menu
  - Add loading spinners for async operations
  - Implement error message display with user-friendly text
  - Add success notifications for actions (product added, order placed, etc.)
  - Optimize images with responsive sizing
  - Add hover effects and transitions for better UX
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 20. Implement error handling and validation
  - Add comprehensive input validation on all forms (client-side)
  - Display validation errors inline on form fields
  - Implement global error boundary component for React errors
  - Add error handling in all Redux thunks with user-friendly messages
  - Ensure backend validation errors are properly displayed in UI
  - Add 404 page for invalid routes
  - _Requirements: 8.4_

- [x] 21. Add security enhancements

  - Implement rate limiting on authentication endpoints
  - Add input sanitization for text fields to prevent XSS
  - Ensure all protected routes verify JWT on backend
  - Add CSRF protection if using cookies
  - Configure secure HTTP headers (helmet.js)
  - Validate file uploads (type, size limits)
  - _Requirements: 1.3, 1.4, 1.5_

- [x] 22. Create seed data and testing utilities






  - Create database seeding script with sample users, products, and reviews
  - Add script to clear database for testing
  - Create test user accounts for each role (admin, seller, buyer)
  - _Requirements: All_

- [x] 23. Final integration and deployment preparation





  - Test complete user flows: registration → login → browse → add to cart → checkout → review
  - Test seller flow: create product → manage listings → view profile
  - Test admin flow: manage users → moderate content
  - Create production build of frontend
  - Set up environment variables for production
  - Create deployment documentation with setup instructions
  - _Requirements: All_
