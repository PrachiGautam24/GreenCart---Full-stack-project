# Test User Accounts

This document contains the credentials for test user accounts created by the seed script.

## Admin Account

- **Username:** admin
- **Email:** admin@greencart.com
- **Password:** admin123
- **Role:** admin
- **City:** New York

**Capabilities:**
- Manage all users (view, update roles, activate/deactivate)
- Delete any product
- Delete any review
- Full system access

## Seller Accounts

### Seller 1

- **Username:** seller1
- **Email:** seller1@greencart.com
- **Password:** seller123
- **Role:** seller
- **City:** San Francisco

**Products:**
- Organic Cotton T-Shirt
- Handmade Ceramic Mug
- Recycled Plastic Backpack
- Organic Bamboo Toothbrush

### Seller 2

- **Username:** seller2
- **Email:** seller2@greencart.com
- **Password:** seller123
- **Role:** seller
- **City:** Los Angeles

**Products:**
- Organic Honey
- Handmade Wooden Cutting Board
- Recycled Paper Notebook Set
- Handmade Soy Candle

**Capabilities:**
- Create, edit, and delete own products
- View own seller profile and statistics
- Manage product inventory

## Buyer Accounts

### Buyer 1

- **Username:** buyer1
- **Email:** buyer1@greencart.com
- **Password:** buyer123
- **Role:** buyer
- **City:** San Francisco

**Order History:**
- Order 1: 2x Organic Cotton T-Shirt, 1x Handmade Ceramic Mug

**Reviews:**
- Reviewed Organic Cotton T-Shirt (5 stars)
- Reviewed Handmade Ceramic Mug (4 stars)

### Buyer 2

- **Username:** buyer2
- **Email:** buyer2@greencart.com
- **Password:** buyer123
- **Role:** buyer
- **City:** Los Angeles

**Order History:**
- Order 1: 3x Organic Honey

**Reviews:**
- Reviewed Organic Honey (5 stars)

**Capabilities:**
- Browse and search products
- Add products to cart
- Complete checkout
- Submit reviews for purchased products
- View order history

## Usage

To seed the database with these test accounts:

```bash
npm run seed
```

To clear the database:

```bash
npm run clear-db
```

## Notes

- All passwords are intentionally simple for testing purposes
- In production, enforce strong password requirements
- Test accounts include sample orders and reviews for realistic testing
- Product images use Cloudinary demo URLs
