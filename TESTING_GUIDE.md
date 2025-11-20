# GreenCart Marketplace - Testing Guide

This guide provides step-by-step instructions for testing all critical user flows before deployment.

## Prerequisites

1. **Backend Running**
   ```bash
   cd backend
   npm run dev
   ```
   Server should be running on `http://localhost:5000`

2. **Frontend Running**
   ```bash
   cd frontend
   npm run dev
   ```
   App should be running on `http://localhost:5173`

3. **Database Seeded**
   ```bash
   cd backend
   npm run seed
   ```

## Test Accounts

After seeding, use these accounts:

| Role   | Email                    | Password   |
|--------|--------------------------|------------|
| Admin  | admin@greencart.com      | admin123   |
| Seller | seller1@greencart.com    | seller123  |
| Seller | seller2@greencart.com    | seller123  |
| Buyer  | buyer1@greencart.com     | buyer123   |
| Buyer  | buyer2@greencart.com     | buyer123   |

## Test Flow 1: Complete Buyer Journey

### 1.1 Registration & Login

**Test New User Registration:**
1. Navigate to `http://localhost:5173`
2. Click "Register" or "Sign Up"
3. Fill in registration form:
   - Username: `testbuyer`
   - Email: `testbuyer@example.com`
   - Password: `Test123!`
   - Role: Select "Buyer"
   - City: `New York`
4. Click "Register"
5. ✅ **Expected:** Redirected to home page, user logged in

**Test Login:**
1. Logout if logged in
2. Click "Login"
3. Enter credentials:
   - Email: `buyer1@greencart.com`
   - Password: `buyer123`
4. Click "Login"
5. ✅ **Expected:** Redirected to home page, user logged in, username displayed in header

**Test Invalid Login:**
1. Logout
2. Try logging in with wrong password
3. ✅ **Expected:** Error message displayed, not logged in

### 1.2 Browse Products

**Test Product Listing:**
1. Login as buyer (buyer1@greencart.com)
2. Navigate to Products page
3. ✅ **Expected:** See list of products with images, titles, prices, sustainability tags

**Test Search:**
1. On Products page, enter "organic" in search box
2. ✅ **Expected:** Only products with "organic" in title/description shown

**Test Filter by Sustainability Tags:**
1. Check "Organic" filter checkbox
2. ✅ **Expected:** Only organic products displayed
3. Check "Handmade" as well
4. ✅ **Expected:** Products with either organic OR handmade tags shown

**Test Filter by City:**
1. Select a city from dropdown (e.g., "New York")
2. ✅ **Expected:** Only products from sellers in that city shown

**Test Clear Filters:**
1. Clear all filters
2. ✅ **Expected:** All products displayed again

### 1.3 View Product Details

**Test Product Detail Page:**
1. Click on any product card
2. ✅ **Expected:** 
   - Product images displayed
   - Title, description, price shown
   - Sustainability tags visible
   - Seller information with link to profile
   - Reviews section visible
   - "Add to Cart" button present

**Test View Seller Profile:**
1. From product detail page, click seller name/link
2. ✅ **Expected:**
   - Seller username, city, registration date shown
   - Average rating displayed
   - List of seller's products shown
   - Seller's reviews displayed

### 1.4 Shopping Cart

**Test Add to Cart:**
1. From product detail page, click "Add to Cart"
2. ✅ **Expected:** Success notification, cart icon shows item count

**Test View Cart:**
1. Click cart icon or navigate to Cart page
2. ✅ **Expected:**
   - Product listed with image, title, price
   - Quantity controls visible
   - Total amount calculated correctly

**Test Update Quantity:**
1. In cart, click "+" to increase quantity
2. ✅ **Expected:** Quantity increases, total updates
3. Click "-" to decrease quantity
4. ✅ **Expected:** Quantity decreases, total updates

**Test Remove from Cart:**
1. Click "Remove" button on cart item
2. ✅ **Expected:** Item removed, total recalculated

**Test Add Multiple Products:**
1. Navigate to products page
2. Add 2-3 different products to cart
3. View cart
4. ✅ **Expected:** All products listed, total is sum of all items

### 1.5 Checkout & Orders

**Test Checkout:**
1. With items in cart, click "Proceed to Checkout"
2. Review order summary
3. Click "Complete Purchase" (mock payment)
4. ✅ **Expected:**
   - Success message displayed
   - Redirected to order confirmation or orders page
   - Cart is now empty

**Test View Order History:**
1. Navigate to Orders page (or Profile → Orders)
2. ✅ **Expected:**
   - List of past orders displayed
   - Each order shows date, total, status

**Test View Order Details:**
1. Click on an order from order history
2. ✅ **Expected:**
   - Order items listed with quantities and prices
   - Total amount shown
   - Order status and date visible

### 1.6 Submit Review

**Test Submit Review:**
1. From order details page (after purchase), find "Write Review" option
2. Or navigate to product detail page of purchased item
3. Select rating (1-5 stars)
4. Enter comment: "Great product, very sustainable!"
5. Click "Submit Review"
6. ✅ **Expected:**
   - Success message
   - Review appears on product page
   - Product average rating updated

**Test Prevent Duplicate Review:**
1. Try to submit another review for same purchase
2. ✅ **Expected:** Error message or review form not available

**Test View Reviews:**
1. Navigate to product detail page
2. Scroll to reviews section
3. ✅ **Expected:**
   - Reviews displayed with buyer name, rating, comment, date
   - Average rating shown

## Test Flow 2: Seller Journey

### 2.1 Seller Registration & Login

**Test Seller Registration:**
1. Logout if logged in
2. Click "Register"
3. Fill in form:
   - Username: `testseller`
   - Email: `testseller@example.com`
   - Password: `Test123!`
   - Role: Select "Seller"
   - City: `Los Angeles`
4. Click "Register"
5. ✅ **Expected:** Registered and logged in

**Test Seller Login:**
1. Logout
2. Login with: seller1@greencart.com / seller123
3. ✅ **Expected:** Logged in, seller-specific options visible in navigation

### 2.2 Create Product

**Test Product Creation:**
1. Login as seller
2. Navigate to Dashboard or "Sell" page
3. Click "Add New Product" or similar
4. Fill in product form:
   - Title: "Organic Cotton T-Shirt"
   - Description: "100% organic cotton, eco-friendly dyes"
   - Price: 29.99
   - Category: "Clothing"
   - Stock: 50
   - Sustainability Tags: Check "Organic"
   - Upload image (select a valid image file)
5. Click "Create Product" or "Submit"
6. ✅ **Expected:**
   - Success message
   - Product appears in seller's product list
   - Image uploaded to Cloudinary

**Test Product Creation Validation:**
1. Try creating product without required fields
2. ✅ **Expected:** Validation errors displayed
3. Try uploading invalid file type (e.g., .txt)
4. ✅ **Expected:** Error message about file type

### 2.3 Manage Products

**Test View Own Products:**
1. In seller dashboard, view "My Products" section
2. ✅ **Expected:**
   - All seller's products listed
   - Edit and Delete buttons visible for each

**Test Edit Product:**
1. Click "Edit" on a product
2. Modify title: "Organic Cotton T-Shirt - Updated"
3. Change price: 34.99
4. Click "Update" or "Save"
5. ✅ **Expected:**
   - Success message
   - Product updated in list
   - Changes visible on product detail page

**Test Delete Product:**
1. Click "Delete" on a product
2. Confirm deletion if prompted
3. ✅ **Expected:**
   - Product removed from list
   - Product no longer visible on products page

### 2.4 View Seller Profile

**Test Own Profile:**
1. Navigate to own seller profile
2. ✅ **Expected:**
   - Username, city, registration date shown
   - Product count accurate
   - Average rating displayed (if reviews exist)
   - List of active products shown

**Test Profile from Buyer Perspective:**
1. Logout and login as buyer
2. Navigate to seller's profile (from product page)
3. ✅ **Expected:**
   - Same information visible
   - Can view seller's products
   - Can see seller's reviews

## Test Flow 3: Admin Journey

### 3.1 Admin Login

**Test Admin Login:**
1. Logout if logged in
2. Login with: admin@greencart.com / admin123
3. ✅ **Expected:** Logged in, admin-specific options visible

### 3.2 User Management

**Test View All Users:**
1. Navigate to Admin Dashboard or Admin Panel
2. Click "User Management" or similar
3. ✅ **Expected:**
   - List of all users displayed
   - Shows username, email, role, status
   - Action buttons visible

**Test Update User Role:**
1. Find a buyer user
2. Change role to "Seller" using dropdown or button
3. Click "Update" or "Save"
4. ✅ **Expected:**
   - Success message
   - User role updated in list
   - User now has seller permissions

**Test Deactivate User:**
1. Find a user
2. Click "Deactivate" or toggle status
3. ✅ **Expected:**
   - User status changed to inactive
   - User cannot login (test by trying to login as that user)

**Test Reactivate User:**
1. Click "Activate" on deactivated user
2. ✅ **Expected:**
   - User status changed to active
   - User can login again

### 3.3 Content Moderation

**Test View Products:**
1. In admin panel, view all products
2. ✅ **Expected:** Can see products from all sellers

**Test Delete Product:**
1. Find a product to delete
2. Click "Delete"
3. Confirm deletion
4. ✅ **Expected:**
   - Product removed
   - No longer visible on products page
   - Action logged

**Test View Reviews:**
1. In admin panel, view all reviews
2. ✅ **Expected:** Can see all reviews from all products

**Test Delete Review:**
1. Find a review to delete (e.g., inappropriate content)
2. Click "Delete"
3. Confirm deletion
4. ✅ **Expected:**
   - Review removed
   - No longer visible on product page
   - Product rating recalculated
   - Action logged

## Cross-Cutting Tests

### Security Tests

**Test Protected Routes:**
1. Logout
2. Try to access `/dashboard` or `/cart` directly
3. ✅ **Expected:** Redirected to login page

**Test Role-Based Access:**
1. Login as buyer
2. Try to access seller dashboard or admin panel
3. ✅ **Expected:** Access denied or redirected

**Test JWT Expiration:**
1. Login
2. Manually expire token (or wait 24 hours)
3. Try to access protected route
4. ✅ **Expected:** Redirected to login

**Test Rate Limiting:**
1. Attempt to login with wrong password 6+ times rapidly
2. ✅ **Expected:** Rate limit error after 5 attempts

### UI/UX Tests

**Test Responsive Design:**
1. Open browser dev tools
2. Toggle device toolbar
3. Test on various screen sizes:
   - Mobile (375px)
   - Tablet (768px)
   - Desktop (1920px)
4. ✅ **Expected:** Layout adapts properly, no broken UI

**Test Navigation:**
1. Click through all navigation links
2. ✅ **Expected:** All pages load correctly

**Test Loading States:**
1. Observe loading spinners during API calls
2. ✅ **Expected:** Loading indicators shown during async operations

**Test Error Messages:**
1. Trigger various errors (network, validation, etc.)
2. ✅ **Expected:** User-friendly error messages displayed

**Test Success Notifications:**
1. Perform actions (add to cart, create product, etc.)
2. ✅ **Expected:** Success notifications appear and disappear

### Performance Tests

**Test Page Load Times:**
1. Use browser dev tools Network tab
2. Measure page load times
3. ✅ **Expected:** Pages load in < 3 seconds

**Test Image Loading:**
1. Check that Cloudinary images load properly
2. ✅ **Expected:** Images display correctly, no broken images

**Test API Response Times:**
1. Use Network tab to check API call durations
2. ✅ **Expected:** API responses in < 1 second

## Edge Cases & Error Scenarios

### Test Empty States

**Empty Cart:**
1. View cart with no items
2. ✅ **Expected:** "Your cart is empty" message

**No Products:**
1. Apply filters that return no results
2. ✅ **Expected:** "No products found" message

**No Orders:**
1. Login as new user with no orders
2. View order history
3. ✅ **Expected:** "No orders yet" message

### Test Validation

**Invalid Email:**
1. Try registering with invalid email format
2. ✅ **Expected:** Validation error

**Weak Password:**
1. Try registering with short password
2. ✅ **Expected:** Validation error

**Negative Price:**
1. Try creating product with negative price
2. ✅ **Expected:** Validation error

**Out of Stock:**
1. Try adding out-of-stock product to cart
2. ✅ **Expected:** Error message

### Test Concurrent Actions

**Multiple Cart Updates:**
1. Rapidly click quantity buttons
2. ✅ **Expected:** Updates handled correctly, no race conditions

**Simultaneous Logins:**
1. Login on multiple devices/browsers
2. ✅ **Expected:** Works correctly on all devices

## Automated Testing Checklist

If you have automated tests, run:

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

✅ **Expected:** All tests pass

## Bug Reporting Template

If you find issues during testing, document them:

```
**Bug Title:** [Brief description]

**Severity:** Critical / High / Medium / Low

**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Behavior:**

**Actual Behavior:**

**Screenshots:** [If applicable]

**Environment:**
- Browser: 
- OS: 
- User Role: 

**Additional Notes:**
```

## Testing Sign-Off

Once all tests pass, complete this checklist:

- [ ] All buyer flows tested and working
- [ ] All seller flows tested and working
- [ ] All admin flows tested and working
- [ ] Security measures verified
- [ ] UI/UX tests passed
- [ ] Performance acceptable
- [ ] Edge cases handled
- [ ] No critical bugs found
- [ ] Documentation reviewed

**Tested By:** _____________

**Date:** _____________

**Ready for Deployment:** YES / NO

**Notes:** _____________

---

## Quick Test Script

For rapid testing, use this abbreviated checklist:

1. ✅ Register new user (buyer)
2. ✅ Login
3. ✅ Browse products
4. ✅ Add to cart
5. ✅ Checkout
6. ✅ Submit review
7. ✅ Login as seller
8. ✅ Create product
9. ✅ Edit product
10. ✅ Login as admin
11. ✅ Manage users
12. ✅ Delete content

If all 12 steps work, core functionality is operational.
