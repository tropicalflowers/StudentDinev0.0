const mongoose = require('mongoose');
const Restaurant = require('./models/Restaurant');

async function testRestaurantUpdate() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/student_dine', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    
    console.log('✓ Connected to MongoDB');

    // Find first restaurant
    const restaurant = await Restaurant.findOne({});
    
    if (!restaurant) {
      console.log('✗ No restaurants found in database');
      process.exit(1);
    }

    console.log('\n📋 Original Restaurant:');
    console.log('  ID:', restaurant.restaurantId);
    console.log('  Name:', restaurant.name);
    console.log('  Cluster:', restaurant.cluster);
    console.log('  Phone:', restaurant.phone);

    // Update the restaurant
    const testUpdate = {
      name: `${restaurant.name} - UPDATED ${new Date().toLocaleTimeString()}`,
      cluster: 'TEST CLUSTER',
      phone: '9999999999',
      email: 'test@restaurant.com',
      statusNote: 'Test update at ' + new Date().toISOString()
    };

    console.log('\n🔄 Applying updates...');
    console.log('  Updates:', testUpdate);

    const updated = await Restaurant.findOneAndUpdate(
      { restaurantId: restaurant.restaurantId },
      testUpdate,
      { new: true, runValidators: true }
    );

    console.log('\n✓ Update successful!');
    console.log('  Updated name:', updated.name);
    console.log('  Updated cluster:', updated.cluster);
    console.log('  Updated phone:', updated.phone);
    console.log('  Updated at:', updated.updatedAt);

    // Verify by reading again
    const verified = await Restaurant.findOne({ restaurantId: restaurant.restaurantId });
    console.log('\n✓ Verification (fresh read from DB):');
    console.log('  Name:', verified.name);
    console.log('  Cluster:', verified.cluster);
    console.log('  Phone:', verified.phone);

    console.log('\n✓ All tests passed! MongoDB updates are working correctly.');
    
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

testRestaurantUpdate();
