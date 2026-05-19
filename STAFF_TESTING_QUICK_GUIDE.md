# Quick Test Guide - Staff PostgreSQL CRUD

## Before Testing

1. **Ensure backend is running**:
   ```bash
   cd backend
   npm start
   # Should see: ✓ PostgreSQL Staff CRUD routes mounted at /api/prisma/staff
   ```

2. **Ensure frontend is running**:
   ```bash
   # In a new terminal, from frontend/studentdine
   npm start
   # Or open index.html in browser
   ```

3. **Open browser DevTools**: Press `F12` → Console tab

---

## Test Scenario 1: View All Staff

**URL**: `http://localhost:3001/manager/operations.html` (or run manager app)

**Expected Console Output**:
```
[Operations] ✓ Loaded staff from PostgreSQL [...]
[Operations] Data refreshed: { restaurants: X, menuItems: X, staff: X }
[Operations] Rendering staff: [...]
```

**Expected Result**: Staff Management table displays all employees

---

## Test Scenario 2: Create New Staff

**Action**: 
1. Scroll to "Add / Edit Employee" section
2. Fill in:
   - Name: `John Chef`
   - Role: `Chef`
   - Restaurant: `Select any PostgreSQL restaurant`
   - Shift: `Morning`
   - Email: `john@test.com`
   - Phone: `9876543210`
3. Click "Save Employee"

**Expected Console Output** (Backend Terminal):
```
[Staff Route] POST / — Create staff with data: { name: 'John Chef', role: 'Chef', ... }
[Staff Controller] POST create staff
[Staff Controller] Request body: { name: 'John Chef', role: 'Chef', restaurantId: 'rest001', ... }
[Staff Controller] Creating staff with staffId: STAFF001...
[Staff Controller] ✓ Created staff: John Chef (STAFF001...)
```

**Expected Console Output** (Browser):
```
[Frontend] POST /api/prisma/staff { name: 'John Chef', ... }
[Frontend] ✓ Staff added: { success: true, data: { staffId: 'STAFF001...', ... } }
[Operations] Data refreshed: { ... staff: X }
[Operations] Rendering staff: [ { staffId: 'STAFF001...', name: 'John Chef', ... } ]
```

**Expected Result**:
- Green success message: "Saved"
- New staff appears in table
- Neon PostgreSQL has new `staff` row with:
  - `staff_id`: `STAFF001...`
  - `name`: `John Chef`
  - `role`: `Chef`
  - `restaurant_id`: `rest001`

---

## Test Scenario 3: Update Staff

**Action**:
1. Click "Edit" button on "John Chef" row
2. Change Role to `Senior Chef`
3. Change Shift to `Evening`
4. Click "Save Employee"

**Expected Console Output** (Backend Terminal):
```
[Staff Route] PUT /STAFF001... — Update staff { role: 'Senior Chef', shift: 'Evening' }
[Staff Controller] PUT update staff STAFF001...
[Staff Controller] Request body: { role: 'Senior Chef', shift: 'Evening' }
[Staff Controller] Updating with fields: { role: 'Senior Chef', shift: 'Evening' }
[Staff Controller] ✓ Updated staff: John Chef
```

**Expected Console Output** (Browser):
```
[Frontend] PUT /api/prisma/staff/STAFF001... { role: 'Senior Chef', shift: 'Evening' }
[Frontend] ✓ Staff updated: { success: true, data: { staffId: 'STAFF001...', role: 'Senior Chef', shift: 'Evening', ... } }
```

**Expected Result**:
- Green success message: "Saved"
- Staff row updates in table (Role: "Senior Chef", Shift: "Evening")
- Neon PostgreSQL row updates with new values

---

## Test Scenario 4: Delete Staff

**Action**:
1. Staff should still be selected from previous test
2. Click "Delete Employee"

**Expected Console Output** (Backend Terminal):
```
[Staff Route] DELETE /STAFF001...
[Staff Controller] DELETE staff STAFF001...
[Staff Controller] ✓ Deleted staff: STAFF001...
```

**Expected Console Output** (Browser):
```
[Frontend] DELETE /api/prisma/staff/STAFF001...
[Frontend] ✓ Staff deleted: { success: true, data: { staffId: 'STAFF001...' } }
[Operations] Data refreshed: { ... staff: X-1 }
[Operations] Rendering staff: [...]
```

**Expected Result**:
- Green success message: "Deleted"
- "John Chef" row removed from table
- Neon PostgreSQL `staff` table no longer has that row

---

## Troubleshooting

### Issue: Staff not loading
```
Error: [Operations] ✗ Failed to load staff from PostgreSQL: 404
```
**Solution**: 
- Check backend is running: `npm start` in backend folder
- Check route is mounted: Look for `✓ PostgreSQL Staff CRUD routes` in backend console
- Verify Prisma is connected: Check PostgreSQL connection string

### Issue: Create fails
```
[Staff Controller] ✗ POST Error: restaurantId does not exist
```
**Solution**:
- Make sure at least one restaurant exists in PostgreSQL
- Verify restaurant ID is selected correctly in form
- Check that restaurantId matches a valid restaurant ID

### Issue: Update fails
```
[Staff Controller] ✗ Staff not found: STAFF001
```
**Solution**:
- Verify staffId in URL matches database
- Check staffId format (should be like STAFF001...)
- Reload page and try again

### Issue: Database not updating
**Solution**:
- Verify Neon connection string in .env is correct
- Check Prisma schema migration: `npx prisma migrate dev`
- Verify staff table exists: `SELECT * FROM staff;` in Neon console

---

## Key Verification Points

✓ All logs include correct prefixes:
  - `[Staff Route]` - Route handlers
  - `[Staff Controller]` - Prisma operations
  - `[Frontend]` - Browser API calls
  - `[Operations]` - Manager dashboard

✓ All Prisma queries use `staffId` (NOT `id`)

✓ Frontend uses `/api/prisma/staff` (NOT `/api/staff`)

✓ Restaurant dropdown uses `restaurant.id` (NOT `restaurant.name`)

✓ Staff payload uses `restaurantId` field (NOT `restaurant`)

✓ Staff payload uses `isActive` field (NOT `active`)

✓ No MongoDB `/api/staff` API used for manager operations

✓ No modifications to student/order systems
