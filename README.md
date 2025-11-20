# GreenCart Marketplace

A full-stack eco-commerce platform connecting local sellers offering sustainable products with environmentally conscious buyers.

## Project Structure

```
greencart-marketplace/
├── backend/              # Express.js REST API
│   ├── config/          # Database and service configurations
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Authentication, validation, error handling
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API route definitions
│   ├── utils/           # Helper functions
│   ├── .env.example     # Environment variables template
│   ├── .gitignore
│   ├── package.json
│   └── server.js        # Application entry point
│
└── frontend/            # React SPA with Vite
    ├── src/
    │   ├── components/  # Reusable React components
    │   ├── pages/       # Page components
    │   ├── store/       # Redux store and slices
    │   ├── services/    # API service functions
    │   ├── utils/       # Helper functions
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css    # Tailwind CSS
    ├── .env.example     # Environment variables template
    ├── .gitignore
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.js
```

## Tech Stack

### Backend
- Node.js & Express.js
- MongoDB with Mongoose
- JWT Authentication
- Cloudinary (Image Storage)
- bcrypt (Password Hashing)

### Frontend
- React 18+
- Redux Toolkit (State Management)
- React Router (Navigation)
- Tailwind CSS (Styling)
- Axios (API Client)

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Cloudinary account

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Copy environment variables:
```bash
copy .env.example .env
```

3. Update `.env` with your credentials

4. Install dependencies:
```bash
npm install
```

5. Start the server:
```bash
npm run dev
```

The API will run on `http://localhost:5000`

### Database Setup & Test Data

To populate the database with test data:

```bash
cd backend
npm run seed
```

This creates test accounts for all roles:
- **Admin:** admin@greencart.com / admin123
- **Sellers:** seller1@greencart.com, seller2@greencart.com / seller123
- **Buyers:** buyer1@greencart.com, buyer2@greencart.com / buyer123

To clear the database:

```bash
npm run clear-db
```

For complete test user documentation, see `backend/scripts/TEST_USERS.md`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Copy environment variables:
```bash
copy .env.example .env
```

3. Update `.env` with your API URL

4. Install dependencies:
```bash
npm install
```

5. Start the development server:
```bash
npm run dev
```

The app will run on `http://localhost:5173`

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `NODE_ENV` - Environment (development/production)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRE` - Token expiration time
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `FRONTEND_URL` - Frontend URL for CORS

### Frontend (.env)
- `VITE_API_URL` - Backend API URL

## Available Scripts

### Backend Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm run seed` - Populate database with test data
- `npm run clear-db` - Clear all data from database

### Frontend Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Features

- User authentication with role-based access (Admin, Seller, Buyer)
- Product listing management with image uploads
- Search and filter by sustainability tags
- Shopping cart and checkout
- Seller profiles with ratings
- Community feedback and reviews
- Admin dashboard for user and content management

## Security Features

GreenCart implements comprehensive security measures:

- **Rate Limiting**: Protection against brute force attacks (5 auth attempts per 15 min)
- **Input Sanitization**: XSS prevention with HTML/script removal
- **NoSQL Injection Prevention**: Query sanitization for MongoDB
- **Secure Headers**: Helmet.js with Content Security Policy
- **File Upload Validation**: Type, size, and MIME verification (5MB limit)
- **JWT Authentication**: Secure token-based authentication with expiration
- **Password Security**: bcrypt hashing with salt rounds
- **Security Logging**: Authentication attempts, admin actions, and file uploads

For detailed security documentation, see `backend/SECURITY.md`

### Installing Security Dependencies

```bash
cd backend
npm install express-rate-limit helmet express-mongo-sanitize xss-clean
```

## Testing

Before deployment, thoroughly test all user flows. See the comprehensive testing guide:

📋 **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Step-by-step testing instructions for all features

✅ **[INTEGRATION_TEST_CHECKLIST.md](INTEGRATION_TEST_CHECKLIST.md)** - Quick integration test checklist

## Deployment

Ready to deploy to production? Start here:

📦 **[DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md)** - Complete deployment overview and status

🚀 **[DEPLOYMENT.md](DEPLOYMENT.md)** - Detailed deployment guide with platform-specific instructions

📝 **[PRODUCTION_ENV.md](PRODUCTION_ENV.md)** - Production environment variables setup and security

☑️ **[PRE_DEPLOYMENT_CHECKLIST.md](PRE_DEPLOYMENT_CHECKLIST.md)** - Final verification before deployment

🔧 **[frontend/BUILD_VERIFICATION.md](frontend/BUILD_VERIFICATION.md)** - Frontend build verification guide

### Quick Deployment Steps

1. Review [DEPLOYMENT_SUMMARY.md](DEPLOYMENT_SUMMARY.md) for project status
2. Complete [PRE_DEPLOYMENT_CHECKLIST.md](PRE_DEPLOYMENT_CHECKLIST.md)
3. Run [INTEGRATION_TEST_CHECKLIST.md](INTEGRATION_TEST_CHECKLIST.md)
4. Set up production environment variables (see [PRODUCTION_ENV.md](PRODUCTION_ENV.md))
5. Follow deployment instructions for your chosen platform (see [DEPLOYMENT.md](DEPLOYMENT.md))
6. Verify deployment with post-deployment checklist

### Recommended Hosting

- **Backend:** Railway (recommended), Render, or Heroku
- **Frontend:** Vercel (recommended), Netlify, or Cloudflare Pages
- **Database:** MongoDB Atlas
- **Images:** Cloudinary

### Estimated Costs

- **Free Tier:** $0-5/month (suitable for MVP/testing)
- **Production:** $20-30/month (low traffic)

## License

ISC
