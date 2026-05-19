# Auth Cleanup Fix - Testing Guide

## Quick Test (5 minutes)

### Test 1: Basic Logout Clears Form
1. Go to login page
2. **Observe:** Form fields are empty
3. Open browser DevTools → Application → Local Storage
4. **Observe:** `campusFoodCurrentUser` and `campusFoodToken` don't exist
5. Login with valid credentials
6. **Observe:** Form fields populated with credentials during login
7. Click Logout button
8. **Observe:** Redirects to login page
9. **Observe:** Login form fields are empty (not pre-filled!)
10. Check DevTools Local Storage
11. **Observe:** `campusFoodCurrentUser`, `campusFoodToken`, `campusFoodCart` are all gone

### Test 2: Multiple Page Cleanup
1. Login with User A (roll: 23DS001)
2. Navigate to: Store → Hosteller Dashboard → Manager Operations
3. Click Logout from any page
4. **Observe:** All pages redirect to login
5. Check DevTools:
   - Local Storage: All auth keys cleared
   - Session Storage: Should be empty
6. Login as User B (roll: 23HS001)
7. Navigate pages and verify User B's data shown (not User A's)

### Test 3: Cross-Tab Logout Sync
1. **Tab 1:** Login with User A
2. **Tab 2:** Open same app (or navigate to store) - should also be logged in
3. **Tab 1:** Click Logout
4. **Tab 2:** Check immediately - should redirect to login OR show session ended message
5. Try to navigate around **Tab 2** - should redirect to login

### Test 4: Cart Cleanup
1. Login as User A
2. Add items to cart
3. Check DevTools: `campusFoodCart` exists in Local Storage
4. Logout
5. Check DevTools: `campusFoodCart` is gone
6. Login as User B
7. **Observe:** Cart is empty (not User A's cart items)

### Test 5: Role-Specific Page Redirect
1. Login as Hosteller (role: hosteller)
2. Go to: Hosteller Dashboard (hosteller/index.html)
3. Click Logout
4. **Observe:** Redirects to auth/login.html
5. **Repeat for:** Day Scholar Dashboard, Manager Operations page
6. Each should redirect to auth/login.html

---

## Comprehensive Test (15 minutes)

### Scenario 1: Day Scholar Flow
```
1. Login as day_scholar@campus.edu (pass123)
2. Navigate to Store page
3. Add 3 items to cart
4. Check DevTools localStorage:
   - campusFoodCurrentUser ✓
   - campusFoodToken ✓
   - campusFoodCart ✓
5. Click Logout
6. Verify redirect to login.html
7. Check form: both fields empty
8. Check DevTools: all auth keys cleared
9. Check sessionStorage: empty
10. Try to navigate back with browser back button
    → Should redirect to login (auth check)
```

### Scenario 2: Hosteller Mess Booking Flow
```
1. Login as hosteller_user@campus.edu (pass123)
2. Navigate to Hosteller Dashboard (hosteller/index.html)
3. Check page shows correct user
4. Open mess-booking.html
5. Click Logout button
6. Verify redirect to ../auth/login.html
7. Check form cleared
8. DevTools confirms storage cleared
9. Login as different user
10. Verify mess-booking page (if you navigate there)
    shows new user's data
```

### Scenario 3: Manager Operations Flow
```
1. Login as manager@campus.edu (pass123)
2. Navigate to Manager Operations (manager/operations.html)
3. Page loads with manager data
4. Open DevTools Network tab
5. Click Logout
6. Verify:
   - Redirect to auth/login.html
   - No pending API requests
   - Form cleared
   - Storage cleared
7. Login as day scholar
   → Should get redirected (not manager role)
```

### Scenario 4: Multi-Tab Cross-Sync
```
Tab 1: Login page
Tab 2: Logged in, viewing store
Tab 3: Logged in, viewing hosteller dashboard

From Tab 1:
1. Login as User A
2. Tab 2 & 3 should update (if listening)
   
From Tab 2:
1. Add cart items
2. Tab 3 navigate to store
   → Should see same cart items
   
From Tab 1 (or any tab):
1. Logout
2. Wait ~500ms
3. All tabs should redirect to login
4. Verify Tab 2 & 3 also show login page
5. Check all DevTools: storage empty
```

### Scenario 5: Session Persistence Check
```
1. Login as user_a@campus.edu
2. Close DevTools
3. Navigate around app (multiple pages)
4. Open new terminal/tab in BROWSER
   → Should stay logged in
5. Go back to first tab
   → Should still be logged in
6. Logout from first tab
7. New tab should redirect to login (storage event)
8. Navigate in first tab - should show login
```

### Scenario 6: Demo Account Login/Logout
```
1. Use demo account from login page:
   - Email: day_scholar@campus.edu
   - Password: pass123
2. Verify login works
3. Verify page data loads
4. Logout
5. Login again with same account
   → Should work cleanly (no stale data)
6. Check form is empty before login step 2
   → No cached email visible
```

---

## DevTools Verification Checklist

### Before Login (baseline)
```
✓ localStorage → Empty (except theme if set)
✓ sessionStorage → Empty
✓ URL → /auth/login.html or similar
```

### After Login
```
✓ localStorage contains:
  - campusFoodCurrentUser
  - campusFoodToken
  - (optionally: campusFoodTheme)
✓ sessionStorage → Can be empty or have data
✓ User info visible on page
✓ Cart accessible
```

### After Logout
```
✓ localStorage → Empty (except theme)
  ✗ Should NOT have: campusFoodCurrentUser
  ✗ Should NOT have: campusFoodToken
  ✗ Should NOT have: campusFoodCart
  ✗ Should NOT have: campusFoodData
  ✗ Should NOT have: campus_food_role
  ✗ Should NOT have: campus_food_bypass_login
  ✗ Should NOT have: campus_food_user_name
  ✗ Should NOT have: campus_food_user_roll
✓ sessionStorage → Empty
✓ URL → /auth/login.html or similar
✓ Form fields empty
```

---

## Browser Console Verification

### Expected Console Messages During Logout:
```
[Socket.io] Disconnected
[Socket.io] Reconnection failed

// On pages with logout listener:
Day Scholar page received logout event
Hosteller page received logout event
Manager page received logout event
Manager operations page received logout event
Store page received logout event
Auth logout event received, clearing form

// On cross-tab sync:
Token cleared in another tab (day scholar page)
Token cleared in another tab (hosteller page)
etc.
```

### No Errors Expected:
```
✗ Should NOT see: "undefined currentUser"
✗ Should NOT see: "Cannot read cart.items"
✗ Should NOT see: "localStorage is undefined"
✗ Should NOT see: 401 errors after logout
```

---

## Regression Tests (Ensure Nothing Broke)

### Login Still Works
```
✓ Email login works
✓ Roll number login works
✓ Password validation works
✓ Error messages display correctly
✓ Success message displays correctly
```

### Shopping Works
```
✓ Add items to cart
✓ Remove items from cart
✓ Update quantities
✓ Cart persists across navigation
✓ Checkout process starts
```

### Role-Specific Features
```
✓ Hosteller can access mess booking
✓ Manager can access operations
✓ Day Scholar can view store
✓ Cross-role redirects work
```

### Session Features
```
✓ Session timeout still works
✓ Activity detection still works
✓ Socket.io still connects
✓ Real-time updates still work
```

---

## Edge Cases to Test

### Edge Case 1: Rapid Logout/Login
```
1. Login
2. Immediately click Logout
3. Don't wait for redirect
4. Force-navigate back to store
   → Should get redirected to login
5. Login again
   → Should work cleanly
```

### Edge Case 2: Logout with Popup Open
```
1. Login
2. Open a modal/popup
3. Logout from popup
4. Modal should close
5. Redirect to login
```

### Edge Case 3: Logout with API Request In Flight
```
1. Login
2. Add item to cart
3. Logout while API call is processing
4. DevTools Network tab
   → Old API calls should fail (no token)
5. No errors in console
6. Redirect to login works
```

### Edge Case 4: Browser Back After Logout
```
1. Login as User A
2. Navigate to store
3. Logout
4. Browser back button
5. Should redirect to login (not store)
   → Because Auth.isAuthenticated() = false
```

### Edge Case 5: Different Browsers/Profiles
```
1. Chrome window 1: User A logged in
2. Chrome window 2: User B logged in
3. Logout from window 1
   → Window 1 shows login
   → Window 2 stays on User B
     (different localStorage per profile)
4. Logout from window 2
   → Window 2 shows login
```

---

## Performance Test

### Logout should be instant:
```
1. Click Logout button
2. Time to redirect: < 1 second
3. No lag or freeze
4. Form already clearing by 500ms
```

### Storage operations:
```
1. Logout multiple times
2. CPU usage minimal
3. No memory leaks
4. DevTools heap size stable
```

---

## Success Criteria

All of the following must be true:

- [ ] Email not pre-filled after logout
- [ ] All 8+ auth keys cleared from localStorage
- [ ] sessionStorage fully cleared
- [ ] Pages redirect to login on logout
- [ ] Cart cleared on logout
- [ ] Cross-tab logout sync working
- [ ] Form fields cleared
- [ ] No console errors
- [ ] Login/logout cycles work repeatedly
- [ ] User data isolation between users
- [ ] Socket disconnected on logout
- [ ] Session timers cleared
- [ ] Backward compatibility maintained
- [ ] All existing features still work

---

## Troubleshooting

If a test fails:

1. **Email still appears in form:**
   - Check: `clearLoginForm()` function exists
   - Check: Called on page load and after authLogout event
   - Check: Input value actually being set to ''

2. **Storage not clearing:**
   - Check: `Auth.logout()` has complete authKeys list
   - Check: `sessionStorage.clear()` called
   - Check: Browser console for errors

3. **Pages not redirecting:**
   - Check: Page has `authLogout` event listener
   - Check: Redirect URL is correct (relative paths)
   - Check: Browser console for redirect logs

4. **Cross-tab sync not working:**
   - Check: `storage` event listener on page
   - Check: Event checks for token key correctly
   - Check: Redirect happens after event

5. **Other pages still showing old user:**
   - Check: Page state is being reset
   - Check: User info not coming from local memory
   - Check: New user data loaded after login

---

## Sign-Off Checklist

Run through all tests. When complete:

- [ ] Basic logout clears form ✓
- [ ] Multiple pages cleanup ✓
- [ ] Cross-tab sync works ✓
- [ ] Cart cleared ✓
- [ ] Storage fully cleared ✓
- [ ] No console errors ✓
- [ ] Redirect works from all pages ✓
- [ ] User data isolation verified ✓
- [ ] No regressions detected ✓
- [ ] Ready for production ✓
