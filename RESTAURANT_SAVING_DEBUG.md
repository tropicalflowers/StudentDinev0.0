# Restaurant Saving - Testing & Debugging Guide

## Summary of Changes

### Backend Changes:
1. ✅ **Enhanced logging** in `restaurantController.js` updateRestaurant() function
   - Logs incoming request ID and body
   - Logs before and after state of the restaurant
   - Logs timestamp of update

2. ✅ **Added authentication middleware** to PUT route in `restaurantRoutes.js`
   - Protects restaurant updates with JWT token validation
   - Ensures only authenticated users can update

3. ✅ **Created test script** `test-restaurant-update.js`
   - Tests direct MongoDB update independently
   - Verifies Restaurant model update works correctly

### Frontend Changes:
1. ✅ **Enhanced saveRestaurant() function** in `manager/operations.html`
   - Comprehensive console logging with section headers
   - Validates authentication token before API call
   - Detailed error messages with user alerts
   - Visual feedback (green/red text for success/error)
   - Logs both request and response data
   - Delays refresh by 500ms to ensure MongoDB has processed update

2. ✅ **Enhanced toggleRestaurant() function**
   - Same logging and error handling improvements
   - Shows status change in message

3. ✅ **Improved refreshAll() function**
   - Better error handling
   - Logs number of items fetched

---

## Testing Workflow

### Step 1: Start the backend server
```bash
cd backend
npm start
# Expected: Server running on http://localhost:3000
```

### Step 2: Test MongoDB connectivity directly
Run the test script to verify MongoDB updates work:
```bash
cd backend
node test-restaurant-update.js
```

Expected output:
```
✓ Connected to MongoDB
📋 Original Restaurant:
  ID: [some-id]
  Name: [restaurant-name]
  Cluster: [current-cluster]
  Phone: [phone]

🔄 Applying updates...
✓ Update successful!
✓ Verification (fresh read from DB):
  Name: [updated-name]
  Cluster: TEST CLUSTER
  Phone: 9999999999

✓ All tests passed! MongoDB updates are working correctly.
```

If this fails, there's a MongoDB connection issue. Check:
- MongoDB daemon is running: `mongod`
- Database name is correct: `student_dine`
- Connection URL: `mongodb://localhost:27017/student_dine`

### Step 3: Test via frontend UI

1. **Open manager operations page:**
   - Go to `http://localhost:8000/frontend/studentdine/manager/operations.html`
   - Login with manager account

2. **Open browser DevTools (F12):**
   - Go to **Console** tab
   - Look for messages starting with `=== SAVE RESTAURANT ===`

3. **Edit a restaurant:**
   - Select a restaurant from dropdown
   - Change the Name field (add something like " - UPDATED")
   - Click "Save Restaurant" button
   - Look at console output

4. **Expected console output:**
   ```
   === SAVE RESTAURANT ===
   Restaurant ID: [id]
   Restaurant payload: {name: "...", cluster: "...", ...}
   Sending PUT request to /api/restaurants/[id]
   Response status: 200
   Response data: {success: true, message: "...", data: {...}}
   ✓ Restaurant saved successfully
   Verified data in response:
     - Name: [updated-name]
     - Cluster: [cluster]
     - Phone: [phone]
   Refreshing restaurant list...
   ```

5. **Verify in MongoDB Compass:**
   - Open MongoDB Compass
   - Connect to `mongodb://localhost:27017`
   - Select database: `student_dine`
   - Select collection: `restaurants`
   - Search for the updated restaurant
   - Check that `updatedAt` timestamp is recent
   - Verify the fields match what you saved

---

## Backend Console Debugging

Monitor the backend terminal for detailed logs:

```
=== UPDATE RESTAURANT ===
Request ID: [restaurantId]
Request Body: {name: "...", cluster: "...", ...}
Updates to apply: {name: "...", cluster: "...", ..., updatedAt: [timestamp]}
Existing restaurant found: YES
  - Current name: [old-name]
  - Current cluster: [old-cluster]
Update result: SUCCESS
  - Updated name: [new-name]
  - Updated cluster: [new-cluster]
  - Updated at: [timestamp]
```

### Common Backend Issues:

1. **"Restaurant not found"**
   - The restaurantId from frontend doesn't match any document
   - Check if ID format is correct (should be numeric string or REST###)
   - Verify restaurant exists in MongoDB Compass

2. **"Update result: FAILED"**
   - MongoDB update query didn't find the restaurant
   - Check the ID is correct
   - Look for case sensitivity issues

3. **Authentication error (401)**
   - Token not sent or invalid
   - Check `Auth.getToken()` returns a valid JWT
   - Verify user is logged in before clicking save

---

## Frontend Debugging Checklist

In browser console, watch for these:

1. ✅ `console.log('=== SAVE RESTAURANT ===')` - Function was called
2. ✅ `Restaurant ID: [value]` - ID was retrieved from select dropdown
3. ✅ `Restaurant payload: {...}` - Form data was collected correctly
4. ✅ `Sending PUT request to /api/restaurants/[id]` - API call is being made
5. ✅ `Response status: 200` - Server responded successfully
6. ✅ `Response data: {success: true, ...}` - Backend confirmed update
7. ✅ `Verified data in response: ...` - Response contains updated values
8. ✅ Green "Restaurant saved successfully ✓" message appears

---

## Troubleshooting Flowchart

```
Issue: "Restaurant saved successfully" shows but MongoDB doesn't update
│
├─ Check Backend Console Log:
│  │
│  ├─ "Restaurant not found with ID: X" → ID mismatch, verify restaurantId
│  │
│  ├─ "Update result: FAILED" → Query didn't find restaurant
│  │  └─ Check MongoDB Compass: does restaurant exist?
│  │  └─ Try searching by _id instead of restaurantId
│  │
│  └─ "Update result: SUCCESS" but data not in DB
│     └─ Check MongoDB connection
│     └─ Verify database name
│     └─ Check collection name
│
├─ Check Frontend Console:
│  │
│  ├─ No "=== SAVE RESTAURANT ===" message → onClick not firing
│  │  └─ Verify button is not disabled
│  │  └─ Check browser console for JS errors
│  │
│  ├─ "Restaurant ID: " (empty) → Select dropdown has no value
│  │  └─ Verify restaurant list loaded
│  │  └─ Check refreshAll() is working
│  │
│  ├─ "Response status: 404" → Restaurant not found on backend
│  │  └─ Same as "Restaurant not found with ID" above
│  │
│  ├─ "Response status: 401" → Authentication failed
│  │  └─ Check Auth.getToken() returns a token
│  │  └─ Verify user is logged in as manager
│  │
│  └─ "Response status: 500" → Server error
│     └─ Check backend logs for error details
│     └─ Verify all fields in request are correct format
│
└─ Test Directly with curl:
   curl -X PUT http://localhost:3000/api/restaurants/123 \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -d '{"name":"Test","cluster":"Test Cluster"}'
   (Check response and backend logs)
```

---

## Next Steps if Still Not Working

1. **Enable debug mode on backend:**
   ```javascript
   // In app.js, before routes:
   mongoose.set('debug', true); // Log all MongoDB queries
   ```

2. **Check MongoDB directly:**
   ```bash
   mongo student_dine
   db.restaurants.findOne({restaurantId: "123"})
   db.restaurants.updateOne({restaurantId: "123"}, {$set: {name: "Test"}})
   ```

3. **Check network requests in browser:**
   - Open DevTools → Network tab
   - Click Save Restaurant
   - Click on the PUT request
   - Check Request Headers (Authorization header present?)
   - Check Response body (success: true?)
   - Check Response Headers (any errors?)

4. **Capture full request/response:**
   Run this in browser console after making update:
   ```javascript
   fetch('http://localhost:3000/api/restaurants/123', {
     method: 'PUT',
     headers: {
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${Auth.getToken()}`
     },
     body: JSON.stringify({name: 'TEST', cluster: 'TEST'})
   })
   .then(r => r.json())
   .then(d => console.log(JSON.stringify(d, null, 2)))
   ```

---

## Success Indicators

You'll know it's working when:

✅ Backend console shows "Update result: SUCCESS"  
✅ MongoDB Compass shows updated values immediately  
✅ `updatedAt` timestamp is current  
✅ Refreshing page shows saved values  
✅ Frontend shows green success message  
✅ No authentication errors in console  

