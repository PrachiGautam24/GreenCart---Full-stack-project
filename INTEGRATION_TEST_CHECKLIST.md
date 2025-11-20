# GreenCart Integration Test Checklist

Quick checklist for verifying all critical integration points before deployment.

**Date:** _____________  
**Tester:** _____________  
**Environment:** Development / Staging / Production

## Prerequisites

- [ ] Backend running and accessible
- [ ] Frontend running and accessible
- [ ] Database seeded with test data
- [ ] Test accounts available (see backend/scripts/TEST_USERS.md)

## Test Flow 1: Buyer Complete Journey (15 min)

**Goal:** Verify a buyer can register, browse, purchase, and review

| Step | Action | Expected Result | Status | Notes |
|------|--------|----------------|--------|-------|
| 1.1 | Register new buyer account | Account created, logged in | ☐ Pass ☐ Fail | |
| 1.2 | Browse products page | Products displayed with images | ☐ Pass ☐ Fail | |
| 1.3 | Search for "organic" | Filtered results shown | ☐ Pass ☐ Fail | |
| 1.4 | Filter by sustainability tag | Only tagged products shown | ☐ Pass ☐ Fail | |
| 1.5 | Click product to view details | Product detail page loads | ☐ Pass ☐ Fail | |
| 1.6 | View seller profile from product | Seller profile displays | ☐ Pass ☐ Fail | |
| 1.7 | Add product to cart | Success notification, cart count updates | ☐ Pass ☐ Fail | |
| 1.8 | View cart | Product listed, total calculated | ☐ Pass ☐ Fail | |
| 1.9 | Update quantity in cart | Total recalculated correctly | ☐ Pass ☐ Fail | |
| 1.10 | Add another product to cart | Both products in cart | ☐ Pass ☐ Fail | |
| 1.11 | Proceed to checkout | Checkout page loads | ☐ Pass ☐ Fail | |
| 1.12 | Complete purchase | Order created, cart cleared | ☐ Pass ☐ Fail | |
| 1.13 | View order history | Order appears in history | ☐ Pass ☐ Fail | |
| 1.14 | View order details | Items and total shown | ☐ Pass ☐ Fail | |
| 1.15 | Submit review for purchase | Review submitted successfully | ☐ Pass ☐ Fail | |
| 1.16 | View review on product page | Review appears, rating updated | ☐ Pass ☐ Fail | |

**Flow 1 Result:** ☐ All Pass ☐ Some Failures

## Test Flow 2: Seller Complete Journey (10 min)

**Goal:** Verify a seller can create, manage, and view products

| Step | Action | Expected Result | Status | Notes |
|------|--------|----------------|--------|-------|
| 2.1 | Login as seller | Logged in, seller options visible | ☐ Pass ☐ Fail | |
| 2.2 | Navigate to dashboard | Dashboard loads | ☐ Pass ☐ Fail | |
| 2.3 | Click "Add Product" | Product form displays | ☐ Pass ☐ Fail | |
| 2.4 | Fill form and upload image | Form accepts input | ☐ Pass ☐ Fail | |
| 2.5 | Submit product | Product created, appears in list | ☐ Pass ☐ Fail | |
| 2.6 | Verify image uploaded | Image displays from Cloudinary | ☐ Pass ☐ Fail | |
| 2.7 | View product on products page | Product visible to buyers | ☐ Pass ☐ Fail | |
| 2.8 | Edit product from dashboard | Edit form loads with data | ☐ Pass ☐ Fail | |
| 2.9 | Update product details | Changes saved successfully | ☐ Pass ☐ Fail | |
| 2.10 | View own seller profile | Profile shows products and stats | ☐ Pass ☐ Fail | |
| 2.11 | Delete product | Product removed from list | ☐ Pass ☐ Fail | |

**Flow 2 Result:** ☐ All Pass ☐ Some Failures

## Test Flow 3: Admin Complete Journey (8 min)

**Goal:** Verify admin can manage users and moderate content

| Step | Action | Expected Result | Status | Notes |
|------|--------|----------------|--------|-------|
| 3.1 | Login as admin | Logged in, admin options visible | ☐ Pass ☐ Fail | |
| 3.2 | Navigate to admin dashboard | Dashboard loads | ☐ Pass ☐ Fail | |
| 3.3 | View user management | All users listed | ☐ Pass ☐ Fail | |
| 3.4 | Change user role | Role updated successfully | ☐ Pass ☐ Fail | |
| 3.5 | Deactivate user account | User status changed | ☐ Pass ☐ Fail | |
| 3.6 | Verify deactivated user can't login | Login fails for deactivated user | ☐ Pass ☐ Fail | |
| 3.7 | Reactivate user account | User status restored | ☐ Pass ☐ Fail | |
| 3.8 | View content moderation | Products and reviews listed | ☐ Pass ☐ Fail | |
| 3.9 | Delete a product | Product removed | ☐ Pass ☐ Fail | |
| 3.10 | Delete a review | Review removed, rating updated | ☐ Pass ☐ Fail | |

**Flow 3 Result:** ☐ All Pass ☐ Some Failures

## Security Tests (5 min)

| Test | Action | Expected Result | Status | Notes |
|------|--------|----------------|--------|-------|
| S1 | Access /cart without login | Redirected to login | ☐ Pass ☐ Fail | |
| S2 | Access /dashboard as buyer | Access denied or redirected | ☐ Pass ☐ Fail | |
| S3 | Access /admin as seller | Access denied or redirected | ☐ Pass ☐ Fail | |
| S4 | Attempt 6 failed logins | Rate limited after 5 attempts | ☐ Pass ☐ Fail | |
| S5 | Upload invalid file type | Upload rejected | ☐ Pass ☐ Fail | |
| S6 | Upload oversized file (>5MB) | Upload rejected | ☐ Pass ☐ Fail | |
| S7 | Submit XSS in product description | Input sanitized | ☐ Pass ☐ Fail | |

**Security Tests Result:** ☐ All Pass ☐ Some Failures

## API Integration Tests (5 min)

| Test | Endpoint | Expected Result | Status | Notes |
|------|----------|----------------|--------|-------|
| A1 | POST /api/auth/register | 201, user created | ☐ Pass ☐ Fail | |
| A2 | POST /api/auth/login | 200, token returned | ☐ Pass ☐ Fail | |
| A3 | GET /api/products | 200, products array | ☐ Pass ☐ Fail | |
| A4 | GET /api/products?search=organic | 200, filtered results | ☐ Pass ☐ Fail | |
| A5 | POST /api/products (seller) | 201, product created | ☐ Pass ☐ Fail | |
| A6 | POST /api/cart/add | 200, item added | ☐ Pass ☐ Fail | |
| A7 | GET /api/cart | 200, cart items | ☐ Pass ☐ Fail | |
| A8 | POST /api/orders/checkout | 201, order created | ☐ Pass ☐ Fail | |
| A9 | POST /api/reviews | 201, review created | ☐ Pass ☐ Fail | |
| A10 | GET /api/admin/users (admin) | 200, users array | ☐ Pass ☐ Fail | |

**API Tests Result:** ☐ All Pass ☐ Some Failures

## UI/UX Tests (5 min)

| Test | Action | Expected Result | Status | Notes |
|------|--------|----------------|--------|-------|
| U1 | Test on mobile (375px) | Layout adapts, no overflow | ☐ Pass ☐ Fail | |
| U2 | Test on tablet (768px) | Layout adapts properly | ☐ Pass ☐ Fail | |
| U3 | Test on desktop (1920px) | Layout uses space well | ☐ Pass ☐ Fail | |
| U4 | Click all navigation links | All pages load | ☐ Pass ☐ Fail | |
| U5 | Observe loading states | Spinners show during API calls | ☐ Pass ☐ Fail | |
| U6 | Trigger validation errors | Errors display inline | ☐ Pass ☐ Fail | |
| U7 | Trigger API errors | User-friendly messages shown | ☐ Pass ☐ Fail | |
| U8 | Perform successful actions | Success notifications appear | ☐ Pass ☐ Fail | |

**UI/UX Tests Result:** ☐ All Pass ☐ Some Failures

## Performance Tests (3 min)

| Test | Metric | Target | Actual | Status | Notes |
|------|--------|--------|--------|--------|-------|
| P1 | Homepage load time | < 3s | ___s | ☐ Pass ☐ Fail | |
| P2 | Products page load | < 3s | ___s | ☐ Pass ☐ Fail | |
| P3 | API response time | < 1s | ___s | ☐ Pass ☐ Fail | |
| P4 | Image load time | < 2s | ___s | ☐ Pass ☐ Fail | |
| P5 | Cart update response | < 500ms | ___ms | ☐ Pass ☐ Fail | |

**Performance Tests Result:** ☐ All Pass ☐ Some Failures

## Edge Cases (5 min)

| Test | Action | Expected Result | Status | Notes |
|------|--------|----------------|--------|-------|
| E1 | View empty cart | "Cart is empty" message | ☐ Pass ☐ Fail | |
| E2 | Search with no results | "No products found" message | ☐ Pass ☐ Fail | |
| E3 | View orders with no orders | "No orders yet" message | ☐ Pass ☐ Fail | |
| E4 | Submit form with invalid email | Validation error shown | ☐ Pass ☐ Fail | |
| E5 | Submit form with weak password | Validation error shown | ☐ Pass ☐ Fail | |
| E6 | Create product with negative price | Validation error shown | ☐ Pass ☐ Fail | |
| E7 | Add out-of-stock item to cart | Error message shown | ☐ Pass ☐ Fail | |

**Edge Cases Result:** ☐ All Pass ☐ Some Failures

## Browser Compatibility (Optional)

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| Chrome | Latest | ☐ Pass ☐ Fail | |
| Firefox | Latest | ☐ Pass ☐ Fail | |
| Safari | Latest | ☐ Pass ☐ Fail | |
| Edge | Latest | ☐ Pass ☐ Fail | |

## Overall Test Summary

**Total Tests:** ___  
**Passed:** ___  
**Failed:** ___  
**Pass Rate:** ___%

### Critical Issues Found

1. _____________________________________________
2. _____________________________________________
3. _____________________________________________

### Non-Critical Issues Found

1. _____________________________________________
2. _____________________________________________
3. _____________________________________________

## Deployment Decision

Based on testing results:

☐ **APPROVED FOR DEPLOYMENT** - All critical tests passed  
☐ **CONDITIONAL APPROVAL** - Minor issues, can deploy with monitoring  
☐ **NOT APPROVED** - Critical issues must be fixed first

### Conditions/Notes:

_____________________________________________
_____________________________________________
_____________________________________________

## Sign-Off

**Tested By:** _____________  
**Date:** _____________  
**Time Spent:** _____________  
**Next Steps:** _____________

---

## Quick Test Commands

### Backend Health Check
```bash
curl http://localhost:5000/api/health
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"buyer1@greencart.com","password":"buyer123"}'
```

### Test Get Products
```bash
curl http://localhost:5000/api/products
```

### Check Frontend Build
```bash
cd frontend
npm run build
npm run preview
```

## Automated Test Execution

If automated tests are available:

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## Post-Test Actions

After completing this checklist:

1. ☐ Document all issues in issue tracker
2. ☐ Fix critical issues before deployment
3. ☐ Update DEPLOYMENT.md if needed
4. ☐ Notify team of test results
5. ☐ Schedule deployment if approved
6. ☐ Archive this completed checklist
