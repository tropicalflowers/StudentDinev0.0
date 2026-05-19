# Seed Script Guide: MongoDB → PostgreSQL Restaurants

## Overview
The `seedPrismaRestaurants.js` script safely copies all restaurants from MongoDB into PostgreSQL Prisma.

**Important:** MongoDB collections remain untouched. This is a one-way copy operation.

---

## How to Run (Step-by-Step)

### Step 1: Ensure MongoDB is Running
Make sure your MongoDB server is running and the backend can connect to it.

### Step 2: Start the Backend Server
In your first terminal, start the backend:
```bash
cd backend
npm start
```

Wait for the server to start and verify:
- ✓ "MongoDB connected"
- ✓ "PostgreSQL connected" (or similar Prisma message)

### Step 3: Run the Seed Script
In a **new terminal**, run the seed script:
```bash
cd backend
node scripts/seedPrismaRestaurants.js
```

### Expected Output
```
=== STARTING MONGODB → POSTGRESQL SEED ===

✓ PostgreSQL connected

📖 Reading restaurants from MongoDB...
Found 5 restaurants in MongoDB

  ✓ Copied: "Tadka House" (ID: REST001)
  ✓ Copied: "Bean & Bloom" (ID: REST002)
  ✓ Copied: "Pizza Piazza" (ID: REST003)
  ⊘ Skipped: "Existing Restaurant" (restaurantId already exists)

=== SEED SUMMARY ===
✓ Copied:  3 restaurants
⊘ Skipped: 1 restaurants (duplicates)
✗ Errors:  0 restaurants

✓ Seed completed successfully! All restaurants are now in PostgreSQL.
```

---

## What the Script Does

1. **Connects to PostgreSQL** — Verifies Prisma connection is active
2. **Reads from MongoDB** — Fetches all restaurants from the MongoDB `Restaurant` model
3. **Transforms Data** — Converts MongoDB documents to Prisma format
4. **Avoids Duplicates** — Checks if `restaurantId` already exists in PostgreSQL before inserting
5. **Logs Progress** — Shows each copied restaurant with color-coded output
6. **Prints Summary** — Total copied, skipped, and errors at the end

---

## Important Notes

### ✓ What is Copied
- `restaurantId` (unique identifier)
- `name`
- `cluster`
- `address`, `phone`, `email`, `manager`
- `capacity`
- `isOpen` status
- `statusNote`

### ⊘ What is NOT Copied
- MongoDB `timings` field (breakfast, lunch, snacks, dinner)
  - **Why?** Not present in Prisma schema
  - **Action**: Can be added to Prisma later if needed

### 🔒 What is NOT Modified
- MongoDB restaurants remain completely unchanged
- All student orders, menu items, and staff records stay in MongoDB
- No data is deleted

---

## Safe Execution Checklist

- [ ] Backend server is running (`npm start`)
- [ ] MongoDB is connected and accessible
- [ ] PostgreSQL/Prisma is initialized and running
- [ ] No other processes are modifying restaurants simultaneously
- [ ] You have a backup of MongoDB (just in case)

---

## Troubleshooting

### Error: "PostgreSQL connection not available"
**Solution:** Make sure the backend server is running (`npm start`)

### Error: "Cannot read property 'restaurantId' of undefined"
**Solution:** Ensure MongoDB has restaurants. Check MongoDB data manually:
```javascript
// In MongoDB shell or studio:
db.restaurants.find().count()
```

### Some restaurants skipped with "already exists"
**This is normal!** The script ran before and those restaurants were already copied. Run it again safely — it will:
- Skip duplicates (no harm done)
- Copy any new restaurants that weren't copied before

### Error: Duplicate restaurantId in PostgreSQL
**Solution:** Manually delete duplicates or check data integrity:
```sql
-- Check for duplicates in PostgreSQL:
SELECT "restaurant_id", COUNT(*) FROM restaurants GROUP BY "restaurant_id" HAVING COUNT(*) > 1;
```

---

## Post-Seed Verification

After running the script successfully:

1. **Check the Manager Dashboard**
   - Navigate to Manager Operations page
   - Restaurant dropdown should show all copied restaurants
   - Table should display all restaurants

2. **Verify Count**
   - MongoDB count: `db.restaurants.count()` or check restaurants.json
   - PostgreSQL count: Should match or have more (if you added new ones)

3. **Test Manager Operations**
   - Try editing a restaurant
   - Try toggling Open/Close status
   - Try creating a new restaurant
   - All should work via PostgreSQL now

---

## Rolling Back (If Needed)

If something goes wrong, you can:

1. **Delete copied restaurants** (PostgreSQL):
   ```sql
   DELETE FROM restaurants WHERE restaurant_id IN (
     SELECT restaurant_id FROM restaurants
   );
   ```

2. **Or truncate the entire table**:
   ```sql
   TRUNCATE TABLE restaurants;
   ```

3. **MongoDB remains intact** — no action needed

Then run the script again.

---

## Questions?

- Check console output for detailed error messages
- Verify MongoDB and PostgreSQL connections
- Ensure Prisma schema matches your database
- Check backend logs for additional context
