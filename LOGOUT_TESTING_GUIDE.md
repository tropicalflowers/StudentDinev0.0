# Logout Fix - Complete Testing Guide

## Test Environment Setup

### Prerequisites
- ✅ Backend running on `http://localhost:3000`
- ✅ Frontend served (live server or npm start)
- ✅ Browser DevTools open (Console tab)
- ✅ Multiple browser tabs ready for cross-tab testing

### Test Data
- ✅ Test user account (email: student@test.com, password: test123)
- ✅ Test manager account (email: manager@test.com, password: test123)

---

## Test Suite 1: Basic Logout Flow

### Test 1.1: Logout from Store Page
**Steps:**
1. Login as day scholar user
2. Go to store page (`/studentdine/store.html`)
3. Click "Logout" button/link
4. Observe console output

**Expected Results:**
- ✅ Immediately redirected to login page
- ✅ No redirect loop (single entry in console for logout event)
- ✅ No errors in console
- ✅ URL shows `/studentdine/auth/login.html`

**Verification Commands (DevTools Console):**
```javascript
// Should be empty after logout:
localStorage.getItem('campusFoodToken') // → null
localStorage.getItem('campusFoodCurrentUser') // → null
localStorage.getItem('campusFoodCart') // → null
sessionStorage.length // → 0
```

---

### Test 1.2: Logout from Hosteller Page
**Steps:**
1. Login as hosteller user
2. Go to hosteller dashboard (`/studentdine/hosteller/index.html`)
3. Click "Logout" button
4. Observe page behavior

**Expected Results:**
- ✅ Redirected to login page
- ✅ STATE reset (visible in console: "Reset to Guest")
- ✅ Cart cleared
- ✅ No errors

**Console Verification:**
```javascript
// Both should be null:
localStorage.getItem('campusFoodToken')
localStorage.getItem('campusFoodCurrentUser')

// Check sessionStorage is completely cleared:
for (let i = 0; i < sessionStorage.length; i++) {
  console.log(sessionStorage.key(i));
}
// Should print nothing (length should be 0)
```

---

### Test 1.3: Logout from Manager Page
**Steps:**
1. Login as manager user
2. Go to manager dashboard (`/studentdine/manager/index.html`)
3. Click "Logout" button
4. Observe redirect

**Expected Results:**
- ✅ Redirected to login page
- ✅ Manager STATE reset
- ✅ Cart cleared
- ✅ No console errors

**Verification:**
```javascript
// Check all auth keys are cleared:
const authKeys = [
  'campusFoodCurrentUser', 'campusFoodToken', 'campusFoodCart',
  'campusFoodData', 'campus_food_role', 'campus_food_bypass_login',
  'campus_food_user_name', 'campus_food_user_roll'
];
authKeys.forEach(key => {
  console.log(key + ':', localStorage.getItem(key));
});
// All should be null
```

---

## Test Suite 2: Login Form Clearing

### Test 2.1: Form Fields Empty After Logout
**Steps:**
1. Login with email "user@example.com"
2. Logout
3. Look at login form email input field

**Expected Results:**
- ✅ Email input field is **completely empty** (no pre-fill)
- ✅ Password field is empty
- ✅ Form validation state cleared

**Manual Check:**
```javascript
// In DevTools Console after logout:
document.getElementById('identifier').value // → "" (empty string)
document.getElementById('password').value // → "" (empty string)
```

---

### Test 2.2: Login After Logout
**Steps:**
1. Login as user A
2. Logout
3. Login again as user B
4. Check if user B's data shows (not user A's data)

**Expected Results:**
- ✅ User B logged in successfully
- ✅ User B's cart shown (empty)
- ✅ User B's dashboard visible
- ✅ No user A data visible

---

## Test Suite 3: Browser History & Back Button

### Test 3.1: Back Button After Logout
**Steps:**
1. Login to any page
2. Click logout
3. You're now on login page
4. Click browser **back button**

**Expected Results:**
- ✅ Back button does NOT show the just-logged-out authenticated page
- ✅ Browser navigation history doesn't include logged-out page
- ✅ Back button likely goes to page before first login

**Why This Works:**
- `window.location.replace()` replaces history entry instead of adding to it
- `window.location.href` would keep authenticated page in history (bad!)

---

### Test 3.2: Multiple Page Visits Then Logout
**Steps:**
1. Login
2. Visit: Store → Checkout → Order History (3 pages)
3. Click logout
4. You're on login page
5. Click back button (multiple times)

**Expected Results:**
- ✅ Back button shows Order History → Checkout → Store (original history)
- ✅ None of these pages auto-redirect or show stale data
- ✅ Each page properly checks Auth.isAuthenticated() and redirects to login

---

## Test Suite 4: Cross-Tab Synchronization

### Test 4.1: Logout in Tab A, Observe Tab B
**Steps:**
1. Open 2 browser tabs
2. Login in Tab A to store page
3. Login in Tab B to hosteller page
4. In Tab A: Click logout
5. Switch to Tab B immediately (within 1 second)

**Expected Results:**
- ✅ Tab B either still shows hosteller page OR redirects to login
- ✅ Tab B doesn't show error or strange state
- ✅ If Tab B refreshed: redirects to login
- ✅ Storage event fired in Tab B (seen in console: "Token cleared in another tab")

**Manual Verification:**
```javascript
// Tab B Console should show (within 1 second of Tab A logout):
// "Token cleared in another tab - redirecting"
```

---

### Test 4.2: Wait After Cross-Tab Logout
**Steps:**
1. Same as 4.1
2. Wait 2-3 seconds before checking Tab B
3. Switch to Tab B

**Expected Results:**
- ✅ Tab B has already redirected to login
- ✅ Or Tab B's next interaction redirects to login
- ✅ No error messages

---

## Test Suite 5: Role-Based Behavior

### Test 5.1: Landing Page After Logout
**Steps:**
1. Login and go to any role page
2. Logout
3. Should land on login page (NOT landing page)
4. After login, go to landing page (`/studentdine/app.js`)
5. Logout from landing page
6. Should still go to login page

**Expected Results:**
- ✅ Logout always goes to login page (not landing page)
- ✅ Landing page doesn't auto-redirect after logout
- ✅ Can logout and stay on landing page (doesn't redirect away)

---

### Test 5.2: Role Selection After Fresh Login
**Steps:**
1. Fresh login as manager
2. Go to landing page
3. Click "Enter as Hosteller" (role selection)

**Expected Results:**
- ✅ Redirects to ACTUAL user role (manager operations page)
- ✅ NOT to hosteller page (landing page selection ignored)
- ✅ Routes based on server-validated user.role, not landing page selection

**Reasoning:** User's actual role is determined by backend, landing page selection is just for display purposes

---

## Test Suite 6: Edge Cases

### Test 6.1: Rapid Logout Clicks
**Steps:**
1. Login
2. Rapidly click logout button multiple times
3. Observe page behavior

**Expected Results:**
- ✅ No double-redirect or loop
- ✅ Eventually lands on login page
- ✅ No console errors

---

### Test 6.2: Logout Then Immediate Refresh
**Steps:**
1. Login
2. Click logout
3. Immediately press F5 (refresh) before fully redirected

**Expected Results:**
- ✅ Refresh happens, page redirects to login
- ✅ No stale data shown
- ✅ Form is empty

---

### Test 6.3: Logout from Deeply Nested Page
**Steps:**
1. Login as manager
2. Go to operations page (`/studentdine/manager/operations.html`)
3. Click logout
4. Observe redirect path

**Expected Results:**
- ✅ Correctly redirects to `../auth/login.html` (relative path)
- ✅ Ends up at `/studentdine/auth/login.html` (correct absolute path)
- ✅ Not at `/manager/auth/login.html` (wrong path)

---

## Test Suite 7: Cart & Session State

### Test 7.1: Cart Cleared After Logout
**Steps:**
1. Login
2. Add items to cart (3-4 items)
3. Check cart count
4. Logout
5. Login again

**Expected Results:**
- ✅ After logout, cart shows 0 items
- ✅ Cart data removed from localStorage
- ✅ After re-login, cart starts empty (no items from previous session)

**Console Check:**
```javascript
// Before logout:
JSON.parse(localStorage.getItem('campusFoodCart')) // → array with items

// After logout:
localStorage.getItem('campusFoodCart') // → null

// After re-login:
JSON.parse(localStorage.getItem('campusFoodCart')) // → null or []
```

---

### Test 7.2: User State Doesn't Bleed Between Users
**Steps:**
1. Login as User A (email: userA@test.com)
2. Place order or add items
3. Logout
4. Login as User B (email: userB@test.com)
5. Check if User A's data is visible

**Expected Results:**
- ✅ User B sees empty cart (not User A's cart)
- ✅ User B sees their own order history (not User A's)
- ✅ User B's name shows in dashboard (not User A)

---

## Test Suite 8: Console Logging Verification

### Test 8.1: Console Messages on Logout
**Steps:**
1. Open DevTools Console tab
2. Login
3. Click logout
4. Watch console output

**Expected Output (should see these messages):**
```
✅ Auth: Logging out...
✅ Auth: Token cleared and localStorage cleaned
✅ Auth logout event
✅ [Page Name] page received logout event - cleaning local state
```

**NOT Expected (should NOT see these):**
```
❌ [Page Name] received logout event - [page specific redirect message]
❌ Multiple redirects
❌ Error: Cannot set property of undefined
```

---

### Test 8.2: No Error Messages
**Steps:**
1. Open DevTools Console (filter to Errors)
2. Login and logout
3. Check for any error messages

**Expected Results:**
- ✅ No red error messages
- ✅ No warning about undefined localStorage keys
- ✅ No redirect loop warnings

---

## Test Summary Checklist

### Critical Tests (Must Pass)
- [ ] Single logout → lands on clean login page
- [ ] Form fields empty after logout
- [ ] Back button doesn't show old authenticated pages
- [ ] Cross-tab logout works (Tab A logout → Tab B redirects)
- [ ] Login works after logout
- [ ] No console errors
- [ ] Logout from any page type works

### Important Tests (Should Pass)
- [ ] Cart cleared after logout
- [ ] User B data shown after logging in as B
- [ ] Console shows expected logout messages
- [ ] Landing page doesn't auto-redirect after logout
- [ ] Role selection respects server-validated role

### Nice-to-Have Tests
- [ ] Performance: logout is fast (< 1 second)
- [ ] Rapid logout clicks don't cause issues
- [ ] sessionStorage completely empty after logout

---

## Debugging If Tests Fail

### Issue: Redirect Loop
**Check:**
```javascript
// In auth.js, verify logout() uses dispatchEvent WITHOUT redirect:
window.dispatchEvent(new CustomEvent('authLogout', ...));
// Then LATER:
window.location.replace(...); // Separate call

// Check page listeners don't redirect:
window.addEventListener('authLogout', (event) => {
  // Should NOT have window.location.xxx here
  STATE.reset();
  Cart.clear();
});
```

---

### Issue: Form Not Clearing
**Check:**
```javascript
// In auth/login.html, verify clearLoginForm() exists:
function clearLoginForm() {
  document.getElementById('identifier').value = '';
  document.getElementById('password').value = '';
  // ... other clearing code ...
}

// And is called on page load AND logout event:
document.addEventListener('DOMContentLoaded', () => {
  clearLoginForm();
});

window.addEventListener('authLogout', (event) => {
  clearLoginForm();
});
```

---

### Issue: Back Button Shows Old Page
**Check:**
```javascript
// All redirects should use replace(), NOT href:
window.location.replace('auth/login.html');  // ✅ Correct
window.location.href = 'auth/login.html';    // ❌ Wrong

// Verify with grep:
grep -r "location.href.*auth" frontend/studentdine/
// Should return nothing (0 results)
```

---

### Issue: Cross-Tab Logout Not Working
**Check:**
```javascript
// Verify storage event listener:
window.addEventListener('storage', (event) => {
  if (event.key === 'campusFoodToken' && event.newValue === null) {
    window.location.replace('../auth/login.html');
  }
});

// Test manually:
// Tab A: localStorage.removeItem('campusFoodToken')
// Tab B: Should see 'storage' event fired
```

---

## Test Report Template

```
TEST RUN: [Date] [Time]
TESTER: [Name]
BROWSER: [Chrome/Firefox/Safari] v[Version]

PASSED TESTS:
- [ ] Test 1.1: Logout from Store Page ✅
- [ ] Test 1.2: Logout from Hosteller Page ✅
- [ ] Test 2.1: Form Fields Empty ✅

FAILED TESTS:
- [ ] Test X.X: [Description]
  Error: [Console message or observed behavior]
  Steps to reproduce: [Steps]

NOTES:
[Any additional observations]

OVERALL RESULT: [PASS / FAIL / PARTIAL]
```

---

## Post-Testing Checklist

After all tests pass:
- [ ] Document any issues found
- [ ] Verify all 13 files are deployed
- [ ] Check backend is running
- [ ] Clear browser cache if needed
- [ ] Test on second browser/device if possible
- [ ] Update docs if behavior differs from expected

---

**Status:** Ready for Testing ✅  
**Last Updated:** May 17, 2026  
**Version:** 1.0
