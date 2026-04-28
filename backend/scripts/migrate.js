/**
 * Migration Script: JSON data -> MongoDB
 *
 * Usage: npm run migrate
 */

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const User = require('../models/User');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const Restaurant = require('../models/Restaurant');
const Staff = require('../models/Staff');
const MessBooking = require('../models/MessBooking');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/studentdine';
const DATA_DIR = path.join(__dirname, '../data');

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), 'utf-8'));
}

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

async function migrateUsers() {
  console.log('\nMigrating Users...');
  const usersData = readJson('users.json');
  await User.deleteMany({});

  let migratedCount = 0;
  for (const user of usersData) {
    try {
      await User.create({
        email: user.email,
        rollNumber: user.rollNumber,
        name: user.name,
        password: user.password,
        role: user.role || 'student',
        wallet: user.wallet || 500,
        cluster: user.cluster || 'North Campus',
        restaurant: user.restaurant || 'Main Cafeteria',
      });
      migratedCount++;
    } catch (error) {
      console.warn(`  Skipped user ${user.email}: ${error.message}`);
    }
  }

  console.log(`  Migrated ${migratedCount}/${usersData.length} users`);
}

async function migrateMenuItems() {
  console.log('\nMigrating Menu Items...');
  const menuData = readJson('menu.json');
  await MenuItem.deleteMany({});

  let migratedCount = 0;
  for (const item of menuData) {
    try {
      await MenuItem.create({
        legacyId: item.id,
        restaurantId: item.restaurantId || 'unknown',
        restaurantName: item.restaurantName || 'Unknown',
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category || 'snacks',
        type: item.type || (item.vegetarian ? 'veg' : 'non-veg'),
        vegetarian: item.type ? item.type === 'veg' : item.vegetarian || false,
        available: item.available !== false,
        image: item.image,
        rating: item.rating || 0,
      });
      migratedCount++;
    } catch (error) {
      console.warn(`  Skipped item ${item.name}: ${error.message}`);
    }
  }

  console.log(`  Migrated ${migratedCount}/${menuData.length} menu items`);
}

async function migrateOrders() {
  console.log('\nMigrating Orders...');
  const ordersData = readJson('orders.json');
  await Order.deleteMany({});

  const users = await User.find({});
  const menuItems = await MenuItem.find({});

  let migratedCount = 0;
  for (const order of ordersData) {
    try {
      const user = users.find(u => u.email === order.userEmail) || users[0];
      if (!user) {
        console.warn('  Skipped order: no users found');
        continue;
      }

      const items = (order.items || []).map(item => {
        const menuItem = menuItems.find(m => m.name === item.name);
        return {
          menuItemId: menuItem?._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        };
      }).filter(item => item.menuItemId);

      await Order.create({
        userId: user._id,
        items,
        totalAmount: order.totalAmount,
        couponCode: order.couponCode,
        discountAmount: order.discountAmount || 0,
        finalAmount: order.finalAmount,
        status: order.status || 'Pending',
        paymentMethod: order.paymentMethod || 'wallet',
        deliveryAddress: order.deliveryAddress,
        specialInstructions: order.specialInstructions,
      });
      migratedCount++;
    } catch (error) {
      console.warn(`  Skipped order: ${error.message}`);
    }
  }

  console.log(`  Migrated ${migratedCount}/${ordersData.length} orders`);
}

async function migrateCoupons() {
  console.log('\nMigrating Coupons...');
  const couponsFile = path.join(DATA_DIR, 'coupons.json');
  if (!fs.existsSync(couponsFile)) {
    console.log('  No coupons.json file found, skipping');
    return;
  }

  const couponsData = readJson('coupons.json');
  await Coupon.deleteMany({});

  let migratedCount = 0;
  for (const coupon of couponsData) {
    try {
      await Coupon.create({
        code: coupon.code,
        discountType: coupon.discountType || 'percentage',
        discountValue: coupon.discountValue,
        minOrderAmount: coupon.minOrderAmount || 0,
        maxDiscount: coupon.maxDiscount,
        usageLimit: coupon.usageLimit,
        usageCount: coupon.usageCount || 0,
        expiryDate: coupon.expiryDate,
        active: coupon.active !== false,
      });
      migratedCount++;
    } catch (error) {
      console.warn(`  Skipped coupon ${coupon.code}: ${error.message}`);
    }
  }

  console.log(`  Migrated ${migratedCount}/${couponsData.length} coupons`);
}

async function migrateRestaurants() {
  console.log('\nMigrating Restaurants...');
  const restaurantsData = readJson('restaurants.json');
  const menuData = readJson('menu.json');
  await Restaurant.deleteMany({});

  const restaurantMap = new Map();
  restaurantsData.forEach(restaurant => {
    restaurantMap.set(restaurant.id, restaurant);
  });
  menuData.forEach(item => {
    if (item.restaurantId && !restaurantMap.has(item.restaurantId)) {
      restaurantMap.set(item.restaurantId, {
        id: item.restaurantId,
        name: item.restaurantName || item.restaurantId,
        cluster: 'North Campus',
        address: 'Campus food court',
        phone: '',
        email: '',
        timings: {},
        capacity: 80,
        manager: '',
        isOpen: true,
      });
    }
  });

  const allRestaurants = Array.from(restaurantMap.values());
  let migratedCount = 0;
  for (const restaurant of allRestaurants) {
    try {
      await Restaurant.create({
        restaurantId: restaurant.id,
        name: restaurant.name,
        cluster: restaurant.cluster,
        address: restaurant.address,
        phone: restaurant.phone,
        email: restaurant.email,
        timings: restaurant.timings,
        capacity: restaurant.capacity,
        manager: restaurant.manager,
        isOpen: restaurant.isOpen !== false,
        statusNote: restaurant.statusNote || '',
      });
      migratedCount++;
    } catch (error) {
      console.warn(`  Skipped restaurant ${restaurant.name}: ${error.message}`);
    }
  }

  console.log(`  Migrated ${migratedCount}/${allRestaurants.length} restaurants`);
}

async function migrateStaff() {
  console.log('\nMigrating Staff...');
  const staffData = readJson('staff.json');
  await Staff.deleteMany({});

  let migratedCount = 0;
  for (const member of staffData) {
    try {
      await Staff.create({
        staffId: member.id,
        name: member.name,
        role: member.role,
        restaurant: member.restaurant,
        email: member.email,
        phone: member.phone,
        department: member.department,
        shift: member.shift || 'Morning',
        active: member.active !== false,
      });
      migratedCount++;
    } catch (error) {
      console.warn(`  Skipped staff ${member.name}: ${error.message}`);
    }
  }

  console.log(`  Migrated ${migratedCount}/${staffData.length} staff members`);
}

async function migrateMessBookings() {
  console.log('\nMigrating Mess Bookings...');
  const bookingsFile = path.join(DATA_DIR, 'mess-bookings.json');
  if (!fs.existsSync(bookingsFile)) {
    console.log('  No mess-bookings.json file found, skipping');
    return;
  }

  const bookingsData = readJson('mess-bookings.json');
  await MessBooking.deleteMany({});

  let migratedCount = 0;
  for (const booking of bookingsData) {
    try {
      await MessBooking.create({
        bookingId: booking.id,
        userId: String(booking.userId),
        userName: booking.userName || 'User',
        meal: booking.meal,
        menuOption: booking.menuOption || 'Option 1',
        date: booking.date,
        time: booking.time || '12:00',
        seat: booking.seat || 1,
        status: booking.status || 'confirmed',
        guests: booking.guests || [],
      });
      migratedCount++;
    } catch (error) {
      console.warn(`  Skipped mess booking ${booking.id}: ${error.message}`);
    }
  }

  console.log(`  Migrated ${migratedCount}/${bookingsData.length} mess bookings`);
}

async function runMigration() {
  console.log('Starting Migration: JSON -> MongoDB');
  console.log('====================================');

  try {
    await connectDB();

    await migrateUsers();
    await migrateMenuItems();
    await migrateOrders();
    await migrateCoupons();
    await migrateRestaurants();
    await migrateStaff();
    await migrateMessBookings();

    console.log('\nMigration completed successfully!');
    console.log('\nSummary:');
    console.log(`  - Users: ${await User.countDocuments()} total`);
    console.log(`  - Menu Items: ${await MenuItem.countDocuments()} total`);
    console.log(`  - Orders: ${await Order.countDocuments()} total`);
    console.log(`  - Coupons: ${await Coupon.countDocuments()} total`);
    console.log(`  - Restaurants: ${await Restaurant.countDocuments()} total`);
    console.log(`  - Staff: ${await Staff.countDocuments()} total`);
    console.log(`  - Mess Bookings: ${await MessBooking.countDocuments()} total`);
  } catch (error) {
    console.error('\nMigration failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

runMigration();
