# Campus Food - Complete Testing & User Guide

## Quick Start Guide

### Step 1: Launch the Application
1. Extract the project files to your desired location
2. Open `index.html` in your web browser
3. Use a local HTTP server (optional but recommended):
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   ```
4. Access via `http://localhost:8000` (or just open the file directly)

### Step 2: Select Your Role
The landing page displays three role options:
- 🎓 **Day Scholar** - Students living off-campus
- 🏢 **Hosteller** - Students living in hostels
- 👔 **Manager** - Admin/business management access

Select your role to proceed to role-specific login.

---

## User Account Testing

### Demo Accounts (Pre-loaded)

#### Account 1: Student
```
Email:     student@campus.edu
Roll:      20CS001
Password:  password123
Wallet:    ₹1000
Role:      Day Scholar
```

#### Account 2: Hosteller
```
Email:     hosteller@campus.edu
Roll:      20HS001
Password:  password123
Wallet:    ₹800
Role:      Hosteller
```

#### Account 3: Manager/Admin
```
Email:     manager@campus.edu
Roll:      20MG001
Password:  password123
Wallet:    ₹5000
Role:      Manager
```

### Create New Account
1. Click "Don't have an account? Register here" on login page
2. Fill in registration form:
   - Full name
   - Email address
   - Roll number
   - Select role
   - Password (min 6 characters)
   - Confirm password
3. Click "Register"
4. Redirected to login page
5. Login with new credentials

---

## Authentication Testing

### Login Flow
1. **Email-based login**
   - Enter email address
   - Enter password
   - Role-based redirect:
     - Manager → Admin Dashboard
     - Student → Day Scholar Portal
     - Hosteller → Hosteller Portal

2. **Roll Number login**
   - Enter roll number instead of email
   - Enter password
   - Same role-based redirect

### Session Management
- Sessions expire after 30 minutes of inactivity
- Automatic logout on session expiry
- Page refresh preserves session (localStorage)
- Logout button in navigation clears session

### Security Testing
- Unauthenticated users redirected to login
- Protected pages check authentication
- Session tokens stored securely in localStorage

---

## Store/Menu Testing

### Search Functionality
1. Navigate to Store from portal (🛍️ Order Now)
2. Enter search term in search box
3. Click "Search" button
4. **Test cases:**
   - Search "paneer" → Shows paneer items
   - Search "coffee" → Shows coffee items
   - Search "Campus" → Shows items from Campus Cafe
   - Search "xyz" → Shows "No items found"

### Filter Testing

#### Type Filter
- ☑️ All → Shows all items
- ☑️ Veg → Shows vegetarian items only
- ☑️ Non-Veg → Shows non-vegetarian items only

#### Category Filter
- ☑️ Starters → Shows appetizers
- ☑️ Mains → Shows main courses
- ☑️ Drinks → Shows beverages

#### Price Range Filter
- Slider from ₹0 to ₹500
- **Test cases:**
  - ₹0-100 → Shows cheap items
  - ₹200-300 → Shows specific price range
  - ₹400-500 → Shows premium items

#### Combined Filters
- Select Veg + Starters + ₹100-200
- Results should be filtered by all criteria

### Sorting Testing

#### Sort by Popular
- Items appear in popularity order
- Most rated items first

#### Sort by Price (Low to High)
- Cheapest items first
- Expensive items last

#### Sort by Price (High to Low)
- Most expensive items first
- Cheapest items last

#### Sort by Rating
- Highest rated items first

---

## Shopping Cart Testing

### Add to Cart
1. Browse menu items
2. Click "Add to Cart" or use quantity selector
3. **Verification:**
   - Item appears in cart
   - Cart badge updates (bottom-right corner)
   - Quantity selector becomes visible

### Update Quantities
1. Click quantity spinner (+ or -)
2. **Verification:**
   - Cart count updates
   - Item quantity changes

### Remove from Cart
1. In checkout page, find Remove button
2. **Verification:**
   - Item removed from cart
   - Total recalculates

### Empty Cart
1. Place all items in cart and remove them
2. **Verification:**
   - Empty cart message displays
   - Shows "Continue Shopping" button

---

## Checkout Testing

### Cart Review
1. Click cart badge (🛒) at bottom-right
2. **Verification:**
   - All items displayed with quantities
   - Item details (name, restaurant, price)
   - Subtotal calculated correctly

### Address Entry
1. Fill **Delivery Address** field
   - Example: "Room 101, Block A, Hostel B"
2. Fill **Phone Number** field
   - Example: "9876543210"
3. Select **Building/Hostel** dropdown
4. Optionally add **Special Instructions**

### Payment Method Selection
Choose one of 4 payment methods:

#### UPI (📱)
- Select UPI option
- In real scenario: QR code or UPI ID input
- Complete checkout

#### Card (💳)
- Select Card option
- In real scenario: Card details form
- Complete checkout

#### Wallet (💰)
- Select Wallet option
- Checks wallet balance
- Deducts amount from wallet
- Shows insufficient balance error if needed

#### Cash on Delivery (💵)
- Select Cash option
- Payment due on delivery
- No wallet deduction

### Coupon Application
1. Enter coupon code (case-insensitive)
2. Click "Apply" button
3. **Test coupons:**
   - **SAVE10** - 10% off (min ₹200)
   - **SAVE20** - 20% off (min ₹300)
   - **WELCOME5** - 5% off (min ₹100)
   - **HOSTEL15** - 15% off (min ₹250)

4. **Test cases:**
   - Valid coupon → Discount applied
   - Invalid coupon → Error message
   - Below minimum order → Error message
   - Expired coupon → Error message

### Order Summary
**Verification before placing order:**
- Subtotal = Sum of all items
- Discount = Applied coupon discount (if any)
- Delivery Fee = Usually free (₹0)
- Total = Subtotal - Discount + Delivery Fee

### Place Order
1. Click "Place Order" button
2. **Success scenario:**
   - Order confirmation page loads
   - Order ID displayed (ORD001, ORD002, etc.)
   - Redirected to confirmation page

3. **Error scenarios:**
   - Empty cart → "Cart is empty"
   - Insufficient wallet → "Insufficient wallet balance"
   - Invalid coupon → "Coupon validation error"
   - Missing address → "Please fill in delivery details"

---

## Order Confirmation Testing

### Confirmation Page
After placing order:
1. **Order ID** - Unique identifier (ORD001, ORD002, etc.)
2. **Success message** - "Order Confirmed!"
3. **Order details section:**
   - Order ID
   - Order date and time
   - Estimated delivery time
   - Payment method used
   - Delivery address

### Order Items
- All items listed with quantities
- Individual prices and totals

### Order Summary
- Subtotal breakdown
- Discount amount (if applied)
- Delivery fee
- Final total paid

### Order Status Timeline
Shows 4-stage timeline:
1. ✅ Order Confirmed (completed)
2. 🍳 Order Preparing (in progress)
3. 🚚 On the way (upcoming)
4. 🎉 Delivered (upcoming)

### Action Buttons
- **🛍️ Order Again** - Return to store
- **📜 View Orders** - Go to order history

---

## Order History Testing

### View Order History
1. From any page, navigate to "Order History" or from confirmation page
2. **Display verification:**
   - All user's orders listed
   - Latest orders first
   - Order summary with items count

### Filter Orders
Use filter buttons at top:
- **All Orders** - Shows all orders
- **🕐 Pending** - Orders not yet delivered
- **✅ Delivered** - Completed orders
- **❌ Cancelled** - Cancelled orders

### Order Card Information
Each order card shows:
- Order ID (formatted as #ORD001)
- Order date (formatted as "1 Jan 2024")
- Status badge with emoji
- Item list (first 2 + count if more)
- Subtotal, discount, total
- Action buttons

### View Order Details
1. Click "📋 View Details" button
2. Modal opens with complete information:
   - Order ID and date
   - Status with badge
   - Complete item list
   - Delivery address
   - Payment method
   - Full cost breakdown

### Reorder Items
1. On delivered orders: "🔁 Reorder" button visible
2. Click to add items to new cart
3. Redirected to checkout
4. Can modify quantities or add more items

### Empty History
- New user with no orders shows empty state
- Message: "No Orders Yet"
- Button to start ordering

---

## Admin Dashboard Testing

### Access Requirements
- Must be logged in as Manager role
- URL: `admin/dashboard.html`

### Authentication Check
1. Login as manager@campus.edu
2. Access admin dashboard
3. **Non-managers:**
   - Try accessing with student account
   - Should either show error or redirect

### Analytics Section

#### Stat Cards
- **Orders Today** - Count of orders placed today
- **Revenue** - Total revenue generated
- **Popular Item** - Most ordered item
- **Active Users** - Number of active users

#### Charts
- **Top 5 Items Chart** - Bar chart of best sellers
- **Restaurant Performance** - Comparison across restaurants

### Orders Management
1. **View all orders** from all users
2. **Order table columns:**
   - Order ID
   - Customer name
   - Date
   - Items count
   - Total amount
   - Status badge

3. **Filter by status:**
   - Pending
   - Preparing
   - Delivered
   - Cancelled

4. **Search functionality:**
   - Search by order ID
   - Search by customer name

### Menu Management

#### View Menu Items
- Table of all 9 menu items
- Name, description, price, type, category
- Restaurant association

#### Add New Item
1. Click "Add Menu Item" button
2. Modal form opens with fields:
   - Item name
   - Description
   - Price
   - Type (Veg/Non-Veg)
   - Category (Starters/Mains/Drinks)
   - Restaurant selection
3. Click "Add" to create
4. Item appears in table

#### Edit Menu Item
1. Click "Edit" button on item row
2. Form pre-populates with current data
3. Modify fields
4. Click "Update"
5. Changes reflected in table

#### Delete Menu Item
1. Click "Delete" button on item row
2. Confirmation or direct deletion
3. Item removed from table and store

### User Management
- Table of all registered users
- User details (name, email, roll, role)
- User statistics
- Can be filtered by role

### Coupon Management
- Table of all coupons
- Coupon code display
- Discount percentage
- Minimum order requirement
- Usage count
- Status (active/expired)

---

## Theme Testing

### Dark Mode (Default)
1. Open any page
2. Background is dark
3. Text is light colored
4. All elements visible and readable

### Light Mode
1. Click theme toggle (☀️/🌙) in navigation
2. Background becomes light
3. Text becomes dark
4. Verify readability

### Theme Persistence
1. Switch to light mode
2. Refresh page
3. **Verification:** Theme remains light
4. Switch back to dark
5. **Verification:** Theme changes and persists

---

## Responsive Design Testing

### Desktop (1920x1080)
- All 2-column layouts work
- Sidebar visible
- Full-sized cards and buttons

### Tablet (768x1024)
- Layout adapts to 1-column
- Sidebar collapses or below content
- Touch-friendly button sizes

### Mobile (375x667)
- Single column layout
- Stacked navigation
- Full-width cards
- Readable font sizes
- Touch-friendly interactions

### Testing Steps
1. Use browser DevTools (F12)
2. Toggle device toolbar
3. Test various device sizes
4. Verify functionality and appearance

---

## Error Page Testing

### 404 Error Page
- Navigate to: `/pages/404.html`
- Shows "Page Not Found" message
- Displays error code "404"
- Has navigation buttons

### 500 Error Page
- Navigate to: `/pages/500.html`
- Shows "Server Error" message
- Displays error code "500"
- Has retry and home buttons

---

## Data Persistence Testing

### localStorage Verification
1. Open browser DevTools (F12)
2. Go to Application/Storage tab
3. Check localStorage entries:
   - `campus_food_users`
   - `campus_food_menu`
   - `campus_food_orders`
   - `campus_food_coupons`
   - `campus_food_theme`
   - `campusFoodCart`

### Cart Persistence
1. Add items to cart
2. Refresh page
3. Cart items still present
4. Close tab and reopen
5. Cart items still present (if session valid)

### Session Persistence
1. Login to account
2. Refresh page
3. Still logged in
4. Close tab and reopen
5. Still logged in (localStorage session)

### Wallet Balance Persistence
1. Place order with wallet payment
2. Check wallet balance reduced
3. Refresh page
4. Balance change persists

---

## Performance Testing

### Page Load Times
- Landing page: < 1 second
- Store page: < 1.5 seconds
- Admin dashboard: < 2 seconds
- Order history: < 1.5 seconds

### Search Performance
- Search results: < 500ms
- Filter application: < 200ms
- Sort operations: < 200ms

### Cart Operations
- Add item: < 100ms
- Remove item: < 100ms
- Checkout: < 500ms

---

## Browser Compatibility

### Supported Browsers
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

### Testing Steps
1. Open application in each browser
2. Test login and order flow
3. Verify styling consistency
4. Check JavaScript functionality

---

## Common Issues & Solutions

### Issue: Cart items disappear after closing browser
**Solution:** Clear localStorage or check if session is expired

### Issue: Login page shows but doesn't redirect
**Solution:** Check browser console for errors, clear cache

### Issue: Orders not appearing in history
**Solution:** Make sure user is logged in with correct role, check localStorage

### Issue: Coupon not applying
**Solution:** Check minimum order value, verify coupon code spelling

### Issue: Wallet payment fails
**Solution:** Check wallet balance, ensure it's sufficient

### Issue: Theme toggle not working
**Solution:** Check localStorage permissions, try clearing browser cache

---

## Keyboard Shortcuts & Navigation

### Quick Navigation
- Press `Tab` to navigate form fields
- Press `Enter` to submit forms
- Press `Esc` to close modals

### Accessibility
- All form fields labeled clearly
- Color contrast sufficient
- Alt text on images (emojis)
- Keyboard navigation supported

---

## Test Checklist

### Core Functionality
- [ ] User registration works
- [ ] User login works
- [ ] Role-based redirection works
- [ ] Add items to cart works
- [ ] Checkout process works
- [ ] Order confirmation works
- [ ] Order history displays
- [ ] Admin dashboard accessible

### Features
- [ ] Search functionality works
- [ ] Filters work correctly
- [ ] Sorting works correctly
- [ ] Coupon application works
- [ ] Wallet payment works
- [ ] Theme toggle works
- [ ] Responsive design works
- [ ] LocalStorage persistence works

### Bug Tracking
- [ ] No console errors
- [ ] All links working
- [ ] All buttons clickable
- [ ] Forms validate correctly
- [ ] Messages display properly

---

## Support

For issues or questions:
1. Check browser console for errors (F12)
2. Clear browser cache and localStorage
3. Ensure JavaScript is enabled
4. Try in different browser
5. Check for typos in account credentials

---

**Last Updated:** 2024  
**Version:** 1.0.0  
**Testing Status:** Ready for comprehensive testing
