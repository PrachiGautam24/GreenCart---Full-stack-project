# Database Scripts

This directory contains utility scripts for managing test data in the GreenCart marketplace.

## Available Scripts

### Seed Database

Populates the database with sample data including users, products, orders, and reviews.

```bash
npm run seed
```

**What it does:**
- Clears all existing data from the database
- Creates 5 test users (1 admin, 2 sellers, 2 buyers)
- Creates 8 sample products across different categories
- Creates 2 completed orders with order history
- Creates 3 product reviews
- Updates product ratings based on reviews

**Sample Data Includes:**
- **Admin:** Full system access for testing admin features
- **Sellers:** Two sellers with multiple products each
- **Buyers:** Two buyers with order history and reviews
- **Products:** Mix of organic, handmade, and recycled items
- **Orders:** Completed orders for testing order history
- **Reviews:** Sample reviews with ratings for products

### Clear Database

Removes all data from the database.

```bash
npm run clear-db
```

**What it does:**
- Deletes all users
- Deletes all products
- Deletes all orders
- Deletes all reviews
- Displays count of deleted documents

**Warning:** This operation cannot be undone. Use with caution!

## Test User Credentials

See [TEST_USERS.md](./TEST_USERS.md) for complete list of test accounts and their credentials.

### Quick Reference

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@greencart.com | admin123 |
| Seller | seller1@greencart.com | seller123 |
| Seller | seller2@greencart.com | seller123 |
| Buyer | buyer1@greencart.com | buyer123 |
| Buyer | buyer2@greencart.com | buyer123 |

## Usage Examples

### Initial Setup

When setting up the project for the first time:

```bash
# Seed the database with test data
npm run seed
```

### Testing Workflow

1. **Test with fresh data:**
   ```bash
   npm run seed
   ```

2. **Run your tests or manual testing**

3. **Reset for next test:**
   ```bash
   npm run seed
   ```

### Clean Slate

To start completely fresh without seed data:

```bash
npm run clear-db
```

## Environment Requirements

These scripts require the following environment variable to be set in your `.env` file:

```
MONGODB_URI=mongodb://localhost:27017/greencart
```

Or for MongoDB Atlas:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/greencart
```

## Script Details

### seedData.js

- **Location:** `backend/scripts/seedData.js`
- **Dependencies:** mongoose, dotenv, all models
- **Exit Codes:** 
  - 0: Success
  - 1: Error occurred

### clearDatabase.js

- **Location:** `backend/scripts/clearDatabase.js`
- **Dependencies:** mongoose, dotenv, all models
- **Exit Codes:**
  - 0: Success
  - 1: Error occurred

## Troubleshooting

### Connection Error

If you see a MongoDB connection error:
1. Ensure MongoDB is running (if using local instance)
2. Check your `MONGODB_URI` in `.env` file
3. Verify network connectivity (if using MongoDB Atlas)

### Module Not Found Error

If you see module import errors:
1. Ensure you're in the backend directory
2. Run `npm install` to install dependencies
3. Verify all model files exist

### Duplicate Key Error

If you see duplicate key errors when seeding:
1. Run `npm run clear-db` first
2. Then run `npm run seed` again

## Best Practices

1. **Always seed before testing** to ensure consistent test data
2. **Use clear-db** when you need a completely empty database
3. **Don't use seed data in production** - these are test accounts only
4. **Update TEST_USERS.md** if you modify the seed data
5. **Keep passwords simple** for test accounts (they're documented anyway)

## Extending the Scripts

To add more seed data:

1. Edit `seedData.js`
2. Add your data to the appropriate arrays (users, products, etc.)
3. Update `TEST_USERS.md` with new account information
4. Test the script: `npm run seed`

Example:

```javascript
// Add a new seller
{
  username: 'seller3',
  email: 'seller3@greencart.com',
  password: 'seller123',
  role: 'seller',
  city: 'Seattle'
}
```
