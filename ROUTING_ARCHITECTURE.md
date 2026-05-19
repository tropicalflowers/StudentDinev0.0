# Frontend Routing Architecture - Refactored

**Last Updated:** May 18, 2026  
**Status:** ✅ Complete - store.html as single main dashboard

---

## 🎯 Current Architecture Overview

### ✅ Main Dashboards (After Login)
| User Role | Destination | Purpose |
|-----------|-------------|---------|
| **Day Scholar** | `store.html` | Main ordering dashboard |
| **Hosteller** | `store.html` | Main ordering dashboard + mess booking |
| **Manager** | `manager/operations.html` | Manager operations & order management |

### ✅ Supporting Pages
| Page | Path | Purpose | Access |
|------|------|---------|--------|
| **Login** | `auth/login.html` | User authentication | Public |
| **Register** | `auth/register.html` | New account creation | Public |
| **Checkout** | `checkout.html` | Order finalization | Authenticated |
| **Order Confirmation** | `order-confirmation.html` | Order confirmation page | Authenticated |
| **Order History** | `order-history.html` | View past orders | Authenticated |
| **Mess Booking** | `hosteller/mess-booking.html` | Mess meal booking | Hostellers only |

---

## 🔄 Authentication Flow (Fixed)

### 1️⃣ Login Flow
```
Login Page (auth/login.html)
    ↓
[User enters credentials]
    ↓
Auth.login() → Backend validation
    ↓
SUCCESS: Auth.setSession(user, token)
    ↓
getPostAuthRedirect() determines destination:
  ├─ Manager role → ../manager/operations.html
  └─ Student/Hosteller → ../store.html (CHANGED FROM hosteller/index.html)
```

### 2️⃣ Register Flow
```
Register Page (auth/register.html)
    ↓
[User fills signup form]
    ↓
Auth.register() → Backend validation
    ↓
SUCCESS: Auth.setSession(user, token)
    ↓
Route based on role:
  ├─ Manager → ../manager/operations.html
  └─ Hosteller/Day Scholar → ../store.html (✅ FIXED - was hosteller/index.html)
```

### 3️⃣ Landing Page Flow
```
Home Page (index.html) - Role Selection
    ↓
[User clicks role button or already logged in]
    ↓
selectRole(roleId)
    ↓
Check: if (!Auth.isAuthenticated()) → redirect to auth/login.html
    ↓
Route based on ACTUAL user role (from server):
  ├─ Manager → ./manager/operations.html
  └─ Student/Hosteller → ./store.html
```

---

## 🚪 Logout Flow (Comprehensive)

### Authentication Cleanup Steps
```
1. Auth.logout(redirect=true)
   ├─ Clear 8 localStorage auth keys:
   │  ├─ campusFoodCurrentUser
   │  ├─ campusFoodToken
   │  ├─ campusFoodCart
   │  ├─ campusFoodData
   │  ├─ campus_food_role
   │  ├─ campus_food_bypass_login
   │  ├─ campus_food_user_name
   │  └─ campus_food_user_roll
   ├─ Clear all sessionStorage
   ├─ Disconnect Socket.io
   ├─ Dispatch 'authLogout' event
   └─ Use window.location.replace() to redirect:
      ├─ From /auth/* → login.html
      ├─ From /hosteller/* or /manager/* → ../auth/login.html
      └─ From root → auth/login.html

2. Each page receives 'authLogout' event
   ├─ Reset local STATE
   ├─ Clear Cart.items
   └─ Cleanup specific data

3. Cross-tab logout detection
   ├─ Each page listens for storage changes
   ├─ If campusFoodToken is null → redirect to login
   └─ Use window.location.replace() (prevents back button issues)
```

### ✅ Pages with Logout Handlers
- ✅ `store.html` - Main dashboard
- ✅ `checkout.html` - Checkout (NEW - added)
- ✅ `order-confirmation.html` - Confirmation (NEW - added)
- ✅ `order-history.html` - Order history (NEW - added)
- ✅ `hosteller/app.js` - Hosteller dashboard
- ✅ `day-scholar/app.js` - Day scholar dashboard
- ✅ `manager/app.js` - Manager dashboard
- ✅ `manager/operations.html` - Operations page
- ✅ `auth/login.html` - Login page (clears form on logout)
- ✅ `app.js` (root) - Landing page

---

## 🎓 Role-Based Routing Rules

### Day Scholars
```
Entry Point → auth/login.html
       ↓
Login Success → store.html (main dashboard)
       ↓
Inside store.html:
  - Browse restaurants & order food
  - View wallet & manage coupons
  - Logout → auth/login.html
```

### Hostellers
```
Entry Point → auth/login.html
       ↓
Login Success → store.html (main dashboard)
       ↓
Inside store.html:
  ├─ Browse restaurants & order food
  ├─ View wallet & manage coupons
  ├─ Access "Book Mess" button → hosteller/mess-booking.html
  └─ Logout → auth/login.html
```

### Managers
```
Entry Point → auth/login.html
       ↓
Login Success → manager/operations.html (operations dashboard)
       ↓
Inside operations.html:
  ├─ Manage orders & view analytics
  ├─ Button: "Order Food" → ../store.html
  └─ Logout → ../auth/login.html
```

---

## 🔒 Security Features

### ✅ Back Button Prevention
- All redirects use `window.location.replace()` (not `href`)
- Prevents authenticated pages appearing in browser history after logout
- Users cannot use back button to bypass authentication

### ✅ Cross-Tab Session Sync
- Logout in one tab immediately affects all tabs
- Storage event listener detects token removal
- All tabs redirect to login within 100ms

### ✅ State Cleanup on Logout
- **localStorage**: All 8 auth keys removed
- **sessionStorage**: Completely cleared
- **Local Variables**: Cart, STATE, user data reset
- **Socket.io**: Connection closed
- **Timers**: Session timers cleared

---

## 📋 Current File Status

### ✅ Files Fixed in This Refactoring
1. **auth/register.html** (Line 1040)
   - BEFORE: `window.location.href = '../hosteller/index.html'`
   - AFTER: `window.location.href = '../store.html'`
   - Reason: Hostellers should use store.html as main dashboard

2. **checkout.html** (NEW)
   - Added `authLogout` event listener
   - Added storage change listener for cross-tab logout
   - Ensures proper logout handling during checkout

3. **order-confirmation.html** (NEW)
   - Added `authLogout` event listener
   - Added storage change listener for cross-tab logout
   - Ensures proper logout handling after order confirmation

4. **order-history.html** (NEW)
   - Added `authLogout` event listener
   - Added storage change listener for cross-tab logout
   - Ensures proper logout handling when viewing order history

### ✅ Already Correct (No Changes Needed)
- `auth.js` - Comprehensive logout implementation with replace()
- `auth/login.html` - Uses getPostAuthRedirect() function correctly
- `app.js` (root) - Landing page selectRole() function correct
- `store.html` - Main dashboard with proper logout handlers
- `hosteller/app.js` - Correct initializeFromLanding() implementation
- `day-scholar/app.js` - Correct initializeFromLanding() implementation
- `manager/app.js` - Correct initializeFromLanding() implementation
- `manager/operations.html` - Proper logout handlers

---

## 🎯 Key Design Decisions

### Why store.html as Single Dashboard?
✅ **Consistency**: Both student types use same interface  
✅ **Simplicity**: Reduced code duplication  
✅ **Flexibility**: Hostellers can still access mess booking  
✅ **Future-Proof**: Easy to add role-specific features inside store.html  
✅ **Performance**: Single codebase to optimize  

### Why Not Use hosteller/index.html?
❌ Duplicate dashboard code  
❌ Confusing routing (multiple landing pages)  
❌ Hard to maintain consistency  
❌ Users unsure which page is "official"  

### Why window.location.replace() for Logout?
✅ Prevents back button returning to authenticated pages  
✅ Clears history stack (security)  
✅ Standard practice for logout operations  
✅ Prevents confusion about page state  

---

## 🧪 Testing Checklist

### Login/Register Scenarios
- [ ] Day Scholar login → redirects to store.html
- [ ] Hosteller login → redirects to store.html
- [ ] Manager login → redirects to manager/operations.html
- [ ] Day Scholar register → redirects to store.html
- [ ] Hosteller register → redirects to store.html
- [ ] Manager register → redirects to manager/operations.html

### Logout Scenarios
- [ ] Logout from store.html → redirects to auth/login.html
- [ ] Logout from checkout.html → redirects to auth/login.html
- [ ] Logout from order-history.html → redirects to auth/login.html
- [ ] Logout from manager/operations.html → redirects to ../auth/login.html
- [ ] Back button after logout → stays on auth/login.html (no going back)

### Cross-Tab Logout
- [ ] Open store.html in tab 1
- [ ] Open store.html in tab 2
- [ ] Logout in tab 1
- [ ] Tab 2 detects logout within 100ms
- [ ] Tab 2 redirects to auth/login.html

### Session Cleanup
- [ ] localStorage fully cleared
- [ ] sessionStorage fully cleared
- [ ] Cart data removed
- [ ] User data removed
- [ ] Login form fields empty

### Role-Specific Features
- [ ] Hosteller can click "Book Mess" → goes to mess-booking.html
- [ ] Day Scholar sees same UI as hosteller
- [ ] Manager cannot access store.html directly (redirects to operations)
- [ ] All logout buttons work from all pages

---

## 📚 Related Documentation
- `AUTH_CLEANUP_FIX.md` - Authentication cleanup implementation
- `LOGOUT_FIX_COMPLETE.md` - Comprehensive logout flow
- `LOGOUT_VERIFICATION.md` - Verification checklist

---

## 🔗 Architecture Summary

```
┌─ Landing (index.html)
│  └─ [Role Selection] → selectRole()
│
├─ Authentication
│  ├─ Login (auth/login.html) → Auth.login() → store.html
│  └─ Register (auth/register.html) → Auth.register() → store.html
│
├─ Main Dashboards
│  ├─ store.html (Day Scholar & Hosteller)
│  │  ├─ Restaurants browsing
│  │  ├─ Cart management
│  │  ├─ Checkout
│  │  └─ Mess booking (hosteller only)
│  └─ manager/operations.html (Manager)
│     ├─ Order management
│     ├─ Analytics
│     └─ Order Food button
│
├─ Supporting Pages
│  ├─ checkout.html (authenticated)
│  ├─ order-confirmation.html (authenticated)
│  ├─ order-history.html (authenticated)
│  └─ hosteller/mess-booking.html (hosteller only)
│
└─ Logout
   └─ Auth.logout() → Clear state → auth/login.html
```

---

**Status:** ✅ COMPLETE - All routing refactored to use store.html as single main dashboard
