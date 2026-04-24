# Campus Food - Complete Feature Specification

## Project Overview
Campus Food is a comprehensive food ordering system built for college students, hostellers, and managers. It features role-based access, a shopping cart system, advanced filtering, admin dashboard, and complete order management.

---

## Core Features Implemented

### 1. **Authentication System** ✅
- **Login Page** (`auth/login.html`)
  - Email or Roll Number input
  - Password authentication
  - Demo credentials displayed
  - Role-based redirect after login
  - Form validation with error handling

- **Registration Page** (`auth/register.html`)
  - Full name field
  - Email address field
  - Roll number field
  - Role selection (Student, Hosteller, Manager)
  - Password confirmation
  - Comprehensive input validation

- **Session Management** (`auth.js`)
  - 30-minute session timeout
  - Current user tracking
  - Wallet management
  - localStorage persistence
  - Automatic redirect for unauthenticated users

---

### 2. **User Dashboard & Role Management** ✅
- **Day Scholar Portal** (`day-scholar/`)
  - Themed interface for students
  - Quick access to store
  - Order tracking
  - Wallet display
  
- **Hosteller Portal** (`hosteller/`)
  - Hostel-specific delivery options
  - Building/room selection
  - Order history
  
- **Manager Portal** (`manager/`)
  - Admin dashboard access
  - Menu management capabilities

---

### 3. **Food Ordering System** ✅

#### Store/Menu Page (`store.html`)
- **Search Functionality**
  - Real-time search across menu items
  - Search by name, restaurant, or description
  - Search results count display

- **Advanced Filtering**
  - Type filter: All, Vegetarian, Non-Vegetarian
  - Category filter: Starters, Mains, Drinks
  - Price range slider (₹0 - ₹500)
  - Multiple simultaneous filters

- **Sorting Options**
  - By popularity
  - By price (low to high)
  - By price (high to low)
  - By rating

- **Menu Display**
  - 9 pre-loaded menu items
  - 3 restaurants (Campus Cafe, Hostel Canteen, Academic Mess)
  - Item cards with:
    - Emoji-based images
    - Item name and restaurant
    - Price and rating
    - Quantity selector
    - Add to cart button

- **Wallet Display**
  - Current wallet balance
  - Real-time updates on purchases

---

### 4. **Shopping Cart System** ✅

#### Cart Functionality (`cart.js`)
- Add items with custom quantities
- Remove items from cart
- Update item quantities
- Real-time total calculation
- Coupon code validation and application
- Wallet-based payment
- Order confirmation with ID
- localStorage persistence

#### Checkout Page (`checkout.html`)
- Complete cart review
- Order summary with itemized list
- Delivery address selection
  - Building/Hostel dropdown
  - Room number/address
  - Phone number required
  - Special instructions

- **Payment Methods** (4 options)
  - 📱 UPI
  - 💳 Card
  - 💰 Wallet
  - 💵 Cash on Delivery

- **Coupon System**
  - Coupon code input
  - Real-time validation
  - Discount calculation
  - Usage limit checking
  - Demo coupons: SAVE10, SAVE20, WELCOME5, HOSTEL15

- **Order Summary**
  - Subtotal breakdown
  - Discount display
  - Free delivery fee
  - Total amount
  - 30-45 minute delivery estimate

---

### 5. **Order Management** ✅

#### Order Confirmation Page (`order-confirmation.html`)
- Order ID display (unique for each order)
- Order details summary
- Item listing with prices
- Delivery address confirmation
- Payment method used
- Order timeline with status tracking
- Estimated delivery time
- Quick actions (Order Again, View Orders)

#### Order History Page (`order-history.html`)
- Complete order history for authenticated user
- Filter by status:
  - All Orders
  - Pending (🕐)
  - Delivered (✅)
  - Cancelled (❌)

- Order card details:
  - Order ID and date
  - Status badge with emoji
  - Item preview (first 2 items + count)
  - Subtotal, discount (if applicable), total
  - View Details button (modal)
  - Reorder button (for delivered orders)

- Order Details Modal:
  - Complete order information
  - All items with quantities and prices
  - Delivery address and phone
  - Payment method used
  - Complete cost breakdown

- Reorder Functionality:
  - Quick reordering from previous orders
  - Adds items to cart
  - Redirects to checkout

---

### 6. **Admin Dashboard** ✅

#### Manager Dashboard (`admin/dashboard.html`)
Accessible only to users with manager role

**Analytics Section**
- 4 key metrics cards:
  - Orders Today count
  - Revenue generated (₹)
  - Most popular item
  - Active users count
- Top 5 Items chart (visual representation)
- Restaurant Performance chart (comparison)

**Orders Management**
- Table of all orders
- Order ID, customer name, date, items, total, status
- Status badges with color coding
- Filter by status options
- Search functionality

**Menu Management**
- Add new menu items (modal form)
  - Item name
  - Description
  - Price
  - Type (Veg/Non-Veg)
  - Category
  - Restaurant selection
- Edit existing items
- Delete menu items
- View complete menu list

**User Management**
- Table of all registered users
- User details (name, email, roll, role)
- User statistics
- Search functionality

**Coupon Management**
- List of all active coupons
- Coupon code display
- Discount percentage
- Minimum order value
- Usage count

---

### 7. **Data Management System** ✅

#### Data Storage (`data.js`)
- **CampusFoodDB Object** with:
  - 3 demo users (pre-filled with test accounts)
  - 9 menu items across 3 restaurants
  - 3 restaurants
  - Coupon management (4 demo coupons)
  - Order storage (all user orders)
  - Review system (ratings and comments)
  - Analytics data (daily statistics)

- **Helper Methods**:
  - `getUserByEmail()` - Find user by email
  - `searchMenu()` - Search items by keyword
  - `filterMenu()` - Apply multiple filters
  - `validateCoupon()` - Validate coupon codes
  - `addOrder()` - Add new order
  - `updateMenuItem()` - Modify menu item
  - `deleteMenuItem()` - Remove menu item
  - `addMenuItem()` - Create new menu item

- **Persistence**: localStorage with JSON serialization

---

### 8. **Error Pages** ✅

#### 404 Page (`pages/404.html`)
- "Page Not Found" error display
- Suggestions for page recovery
- Links to home and store pages
- Themed design matching application

#### 500 Page (`pages/500.html`)
- "Server Error" display
- Support suggestion
- Retry button
- Link to home page

---

### 9. **UI/UX Features** ✅

#### Theme System
- Dark mode (default)
- Light mode (user selectable)
- Persistent theme preference (localStorage)
- Toggle button in navigation

#### Navigation System
- Top navigation bar with branding
- Role-based menu options
- "Switch Role" link for multi-account users
- Theme toggle button
- Logout functionality

#### Design Elements
- Consistent color scheme with CSS variables
- Gradient accents for primary buttons
- Emoji-based UI indicators
- Responsive grid layouts
- Smooth transitions and animations
- Loading states and feedback messages

---

### 10. **Supporting Features** ✅

#### Landing Page System
- Role selection cards (Day Scholar, Hosteller, Manager)
- Auto-login when accessed from landing page
- Direct navigation to role-specific portals
- Feature highlights for each role

#### Form Validation
- Email format validation
- Password strength checking
- Required field validation
- Real-time feedback
- Error message displays
- Success confirmations

#### Security Features
- Authentication checks on protected pages
- Session validation
- Automatic redirect for unauthorized access
- Wallet-based payment tracking

---

## Data Models

### User Model
```javascript
{
  id: 'user_1',
  name: 'John Doe',
  email: 'student@campus.edu',
  rollNumber: '20CS001',
  role: 'Student', // Student, Hosteller, Manager
  password: 'password123',
  wallet: 1000,
  createdAt: timestamp
}
```

### Menu Item Model
```javascript
{
  id: 'item_1',
  name: 'Paneer Tikka',
  restaurantId: 'rest_1',
  restaurantName: 'Campus Cafe',
  description: 'Marinated paneer cubes grilled to perfection',
  price: 180,
  type: 'Veg',
  category: 'Starters',
  rating: 4.5,
  reviews: [],
  image: '🥘'
}
```

### Order Model
```javascript
{
  id: 'ORD_12345',
  userId: 'user_1',
  items: [
    {
      id: 'item_1',
      name: 'Paneer Tikka',
      quantity: 2,
      price: 180,
      restaurantName: 'Campus Cafe'
    }
  ],
  subtotal: 360,
  discount: 18,
  total: 342,
  paymentMethod: 'UPI',
  status: 'delivered',
  deliveryAddress: 'Room 101, Hostel A',
  couponCode: 'SAVE10',
  createdAt: timestamp
}
```

### Coupon Model
```javascript
{
  code: 'SAVE10',
  discountPercentage: 10,
  minOrderValue: 200,
  maxUsage: 100,
  usageCount: 45,
  description: '10% off on orders above ₹200'
}
```

---

## Demo Credentials

### Student Account
- **Email**: student@campus.edu
- **Roll**: 20CS001
- **Password**: password123
- **Wallet**: ₹1000

### Hosteller Account
- **Email**: hosteller@campus.edu
- **Roll**: 20HS001
- **Password**: password123
- **Wallet**: ₹800

### Manager Account
- **Email**: manager@campus.edu
- **Roll**: 20MG001
- **Password**: password123
- **Wallet**: ₹5000

### Demo Coupons
1. **SAVE10** - 10% off (min ₹200 order)
2. **SAVE20** - 20% off (min ₹300 order)
3. **WELCOME5** - 5% off (min ₹100 order)
4. **HOSTEL15** - 15% off for hostellers (min ₹250 order)

---

## File Structure

```
project/
├── index.html                          # Landing page
├── app.js                              # Landing page logic
├── style.css                           # Global stylesheets
├── data.js                             # Data storage system
├── auth.js                             # Authentication system
├── cart.js                             # Cart management
├── store.html                          # Main shopping interface
├── checkout.html                       # Payment & delivery
├── order-confirmation.html             # Order confirmation
├── order-history.html                  # User order history
│
├── auth/
│   ├── login.html                      # Login page
│   └── register.html                   # Registration page
│
├── admin/
│   └── dashboard.html                  # Manager dashboard
│
├── pages/
│   ├── 404.html                        # Not found error
│   └── 500.html                        # Server error
│
├── day-scholar/
│   ├── index.html                      # Day scholar portal
│   ├── app.js                          # Portal logic
│   └── style.css                       # Portal styling
│
├── hosteller/
│   ├── index.html                      # Hosteller portal
│   ├── app.js                          # Portal logic
│   └── style.css                       # Portal styling
│
└── manager/
    ├── index.html                      # Manager portal
    ├── app.js                          # Portal logic
    └── style.css                       # Portal styling
```

---

## Browser Support & Requirements

- **Modern browsers** (Chrome, Firefox, Safari, Edge)
- **JavaScript enabled**
- **localStorage support** (for data persistence)
- **No external dependencies** (vanilla HTML/CSS/JS)
- **Responsive design** (mobile, tablet, desktop)

---

## Feature Summary Statistics

| Feature | Status | Count |
|---------|--------|-------|
| Pages | ✅ Complete | 13 |
| Menu Items | ✅ Pre-loaded | 9 |
| Restaurants | ✅ Pre-loaded | 3 |
| Demo Users | ✅ Pre-loaded | 3 |
| Coupon Codes | ✅ Pre-loaded | 4 |
| Authentication Methods | ✅ Complete | 2 (Email/Roll) |
| Payment Methods | ✅ Complete | 4 |
| Filter Types | ✅ Complete | 5+ |
| Sorting Options | ✅ Complete | 4 |
| User Roles | ✅ Complete | 3 |
| Admin Features | ✅ Complete | 5 |

---

## Getting Started

1. **Extract the project** to your desired location
2. **Open index.html** in a modern web browser or run a local server
3. **Register a new account** or use demo credentials
4. **Select a role** and start ordering!
5. **Place orders** and manage them from order history

---

## Notes

- All data is stored in browser localStorage (persists across sessions)
- No backend server required (frontend-only application)
- Demo data is pre-populated but fully editable
- Order statuses can be manually updated in admin dashboard
- Wallet balance is tracked and updated with each order

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Built With**: HTML5, CSS3, Vanilla JavaScript
