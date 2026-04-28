/**
 * Migration Script: JSON data → MongoDB
 * 
 * This script migrates existing JSON data files to MongoDB collections
 * with proper password hashing and data validation.
 * 
 * Usage: npm run migrate
 */

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const MenuItem = require('../models/MenuItem');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/studentdine';
const DATA_DIR = path.join(__dirname, '../data');

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
  console.log('\n📦 Migrating Users...');
  
  try {
    const usersFile = path.join(DATA_DIR, 'users.json');
    const usersData = JSON.parse(fs.readFileSync(usersFile, 'utf-8'));

    // Clear existing users
    await User.deleteMany({});

    let migratedCount = 0;
    
    for (const user of usersData) {
      try {
        await User.create({
          email: user.email,
          rollNumber: user.rollNumber,
          name: user.name,
          password: user.password, // Will be hashed by pre-save hook
          role: user.role || 'student',
          wallet: user.wallet || 500,
        });
        migratedCount++;
      } catch (error) {
        console.warn(`  ⚠ Skipped user ${user.email}: ${error.message}`);
      }
    }

    console.log(`  ✓ Migrated ${migratedCount}/${usersData.length} users`);
  } catch (error) {
    console.error('  ✗ Failed to migrate users:', error.message);
  }
}

async function migrateMenuItems() {
  console.log('\n🍽️  Migrating Menu Items...');
  
  try {
    const menuFile = path.join(DATA_DIR, 'menu.json');
    const menuData = JSON.parse(fs.readFileSync(menuFile, 'utf-8'));

    // Clear existing menu items
    await MenuItem.deleteMany({});

    let migratedCount = 0;
    
    for (const item of menuData) {
      try {
        await MenuItem.create({
          name: item.name,
          description: item.description,
          price: item.price,
          category: item.category || 'snacks',
          vegetarian: item.vegetarian || false,
          available: item.available !== false,
          image: item.image,
        });
        migratedCount++;
      } catch (error) {
        console.warn(`  ⚠ Skipped item ${item.name}: ${error.message}`);
      }
    }

    console.log(`  ✓ Migrated ${migratedCount}/${menuData.length} menu items`);
  } catch (error) {
    console.error('  ✗ Failed to migrate menu items:', error.message);
  }
}

async function migrateOrders() {
  console.log('\n📋 Migrating Orders...');
  
  try {
    const ordersFile = path.join(DATA_DIR, 'orders.json');
    const ordersData = JSON.parse(fs.readFileSync(ordersFile, 'utf-8'));

    // Clear existing orders
    await Order.deleteMany({});

    // Get user and menu item mappings
    const users = await User.find({});
    const menuItems = await MenuItem.find({});

    let migratedCount = 0;
    
    for (const order of ordersData) {
      try {
        // Find user by email or use first user as fallback
        const user = users.find(u => u.email === order.userEmail) || users[0];
        
        if (!user) {
          console.warn(`  ⚠ Skipped order: No users found`);
          continue;
        }

        // Map items to menu items
        const items = order.items.map(item => {
          const menuItem = menuItems.find(m => m.name === item.name);
          return {
            menuItemId: menuItem?._id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          };
        });

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
        console.warn(`  ⚠ Skipped order: ${error.message}`);
      }
    }

    console.log(`  ✓ Migrated ${migratedCount}/${ordersData.length} orders`);
  } catch (error) {
    console.error('  ✗ Failed to migrate orders:', error.message);
  }
}

async function migrateCoupons() {
  console.log('\n🎟️  Migrating Coupons...');
  
  try {
    const couponsFile = path.join(DATA_DIR, 'coupons.json');
    
    if (!fs.existsSync(couponsFile)) {
      console.log('  ℹ No coupons.json file found, skipping');
      return;
    }

    const couponsData = JSON.parse(fs.readFileSync(couponsFile, 'utf-8'));

    // Clear existing coupons
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
        console.warn(`  ⚠ Skipped coupon ${coupon.code}: ${error.message}`);
      }
    }

    console.log(`  ✓ Migrated ${migratedCount}/${couponsData.length} coupons`);
  } catch (error) {
    console.error('  ✗ Failed to migrate coupons:', error.message);
  }
}

async function runMigration() {
  console.log('🚀 Starting Migration: JSON → MongoDB');
  console.log('=====================================\n');

  try {
    await connectDB();
    
    await migrateUsers();
    await migrateMenuItems();
    await migrateOrders();
    await migrateCoupons();

    console.log('\n✅ Migration completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`  - Users: ${await User.countDocuments()} total`);
    console.log(`  - Menu Items: ${await MenuItem.countDocuments()} total`);
    console.log(`  - Orders: ${await Order.countDocuments()} total`);
    console.log(`  - Coupons: ${await Coupon.countDocuments()} total`);
    console.log('\n✅ Restaurants and Staff data files created:');
    console.log('  - data/restaurants.json');
    console.log('  - data/staff.json');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB\n');
  }
}

// Run migration
runMigration();
