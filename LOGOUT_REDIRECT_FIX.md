# Logout Redirect Loop & Auth State Fix

## Issues Fixed

### 1. **Redirect Loop on Logout** ✅
**Problem:** After logout, both `Auth.logout()` and page-level `authLogout` event listeners were redirecting, causing loops or double-redirects

**Solution:**
- Modified `Auth.logout()` to dispatch `authLogout` event WITHOUT redirect
- Removed redirect logic from all page-level `authLogout` event listeners
- Only `Auth.logout()` handles the redirect now (single source of truth)
- Used `window.location.replace()` instead of `href` to prevent back-button issues

### 2. **Landing Page Auto-Redirect After Logout** ✅
**Problem:** Landing page was unexpectedly redirecting users after logout due to lingering `campus_food_role` data

**Solution:**
- Added `authLogout` event listener to landing page
- Landing page now stays on role selection (doesn't redirect on logout)
- Fixed `selectRole()` to check actual user role (from Auth.getCurrentUser) not just landing page selection
- Uses `window.location.replace()` for redirects

### 3. **Stale Email in Login Form** ✅
**Problem:** Old user email persisted in login form after logout

**Solution:**
- `Auth.logout()` clears all 8+ auth-related localStorage keys
- Login page's `clearLoginForm()` runs on page load AND on `authLogout` event
- Clears form fields, validation states, and error messages

### 4. **Previous User Role Persisting** ✅
**Problem:** Old user's role still active after logout

**Solution:**
- All auth keys cleared by `Auth.logout()` including `campus_food_role`
- Each role page (hosteller, manager, day-scholar) resets local `STATE` on `authLogout` event
- No cached role data survives logout

### 5. **Session State Not Fully Cleared** ✅
**Problem:** sessionStorage items remained after logout

**Solution:**
- `Auth.logout()` now calls `sessionStorage.clear()` to wipe all session data
- Combined with localStorage cleanup (8 keys removed)
- Cart data cleared by both `Auth.logout()` and page cleanup handlers

## Files Modified (13 total)

### Core Auth
1. **auth.js** - Modified `logout()` to:
   - Use `replace()` instead of `href`
   - Dispatch event WITHOUT redirect
   - Clear sessionStorage

### Landing & Main Pages
2. **app.js** (landing page) - Added:
   - `authLogout` event listener (stay on landing page)
   - Storage change listener
   - Enhanced `selectRole()` to use actual user role

3. **store.html** - Modified:
   - Auth check uses `replace()`
   - `authLogout` listener doesn't redirect
   - Storage listener uses `replace()`

4. **order-history.html** - Auth check uses `replace()`
5. **order-confirmation.html** - Auth check uses `replace()`
6. **checkout.html** - Auth check uses `replace()`

### Role-Specific Pages
7. **hosteller/app.js** - Modified:
   - Init auth check uses `replace()`
   - `authLogout` listener cleans state but doesn't redirect
   - Storage listener uses `replace()`

8. **manager/app.js** - Modified:
   - Init auth check uses `replace()`
   - `authLogout` listener cleans state but doesn't redirect
   - Storage listener uses `replace()`

9. **day-scholar/index.html** - Auth check uses `replace()`

### Role Operations Pages
10. **manager/operations.html** - Modified:
    - Auth check uses `replace()`
    - `authLogout` listener doesn't redirect
    - Storage listener uses `replace()`

11. **admin/dashboard.html** - Auth check uses `replace()`
12. **hosteller/mess-booking.html** - Auth check uses `replace()`

### Login Page
13. **auth/login.html** - Modified:
    - `authLogout` listener doesn't redirect (login page stays on login)
    - Storage listener doesn't redirect

## Key Technical Changes

### Before (Problematic):
```javascript
// Auth.logout() had path-based redirect logic
if (currentPath.includes('/auth/')) {
  window.location.href = 'login.html';
} else if (currentPath.includes('/hosteller/')) {
  window.location.href = '../auth/login.html';
}

// Plus page-level redirects on authLogout event
window.addEventListener('authLogout', (event) => {
  setTimeout(() => {
    window.location.href = '../auth/login.html';
  }, 500);
});
// Result: Double redirect or redirect loops
```

### After (Fixed):
```javascript
// Single redirect in Auth.logout()
if (redirect) {
  const currentPath = window.location.pathname;
  if (currentPath.includes('/auth/')) {
    window.location.replace('login.html');
  } else if (currentPath.includes('/hosteller/') || currentPath.includes('/manager/')) {
    window.location.replace('../auth/login.html');
  } else {
    window.location.replace('auth/login.html');
  }
}

// Dispatch event WITHOUT redirect
window.dispatchEvent(new CustomEvent('authLogout', { detail: { timestamp: Date.now() } }));

// Page listeners clean state, NOT redirect
window.addEventListener('authLogout', (event) => {
  console.log('State cleanup only - Auth.logout() handles redirect');
  STATE.reset();
  Cart.clear();
});
```

## Why `location.replace()` Instead of `href`?

- **`location.href`**: Adds to browser history → back button returns to just-logged-out page
- **`location.replace()`**: Replaces history entry → back button skips logged-out page
- **Result**: Users can't accidentally see authenticated pages after logout

## Storage Cleared on Logout

```javascript
localStorage.removeItem('campusFoodCurrentUser');  // User object
localStorage.removeItem('campusFoodToken');         // Auth token
localStorage.removeItem('campusFoodCart');          // Shopping cart
localStorage.removeItem('campusFoodData');          // Cached data
localStorage.removeItem('campus_food_role');        // Selected role
localStorage.removeItem('campus_food_bypass_login'); // Dev flag
localStorage.removeItem('campus_food_user_name');   // Dev data
localStorage.removeItem('campus_food_user_roll');   // Dev data

sessionStorage.clear();                             // All session data
```

## Event Flow After Fix

```
1. User clicks logout button
   ↓
2. Auth.logout() called
   ↓
3. Clear all auth data from localStorage & sessionStorage
   ↓
4. Disconnect socket
   ↓
5. Dispatch authLogout event (NO redirect in dispatch)
   ↓
6. All listening pages receive event
   ├→ Clean local state (STATE, Cart)
   └→ Don't redirect
   ↓
7. Auth.logout() performs SINGLE redirect
   └→ To appropriate login page based on current path
   ↓
8. User sees clean login page
```

## Testing Checklist

- [ ] Login works normally
- [ ] Click logout button
- [ ] Redirects cleanly to login page (no loop)
- [ ] Login form fields are empty
- [ ] No error in browser console
- [ ] Browser back button doesn't show old pages
- [ ] Open 2 tabs, logout from one → other redirects too
- [ ] Landing page shows when unauthenticated
- [ ] Select role from landing page → correct page loads
- [ ] Logout from any page → always goes to login
- [ ] Cart cleared after logout
- [ ] User B's data shown after logout + login as B

## Backward Compatibility

✅ **All changes are backward compatible:**
- Existing login flow unchanged
- No API changes
- No database changes
- Auth checks still prevent unauthorized access
- Event listeners are passive (don't interfere if removed)

## Troubleshooting

**Issue:** Still seeing redirect loop
- Check DevTools Console → look for multiple "Auth logout event" messages
- Check localStorage → all auth keys should be empty after logout
- Verify `window.location.replace()` is being used (not `href`)

**Issue:** Landing page keeps redirecting after logout
- Verify landing page `selectRole()` checks `Auth.isAuthenticated()` first
- Check that landing page has `authLogout` event listener
- Listener should NOT redirect

**Issue:** Old email still in login form
- Check `clearLoginForm()` is called on page load
- Verify `authLogout` listener calls `clearLoginForm()`
- Check form inputs have correct IDs: `identifier`, `password`

**Issue:** Cart not clearing
- Verify `Cart.items = []` and `Cart.save()` in page cleanup
- Check all pages have `authLogout` listener
- Verify `Auth.logout()` removes `campusFoodCart` key
