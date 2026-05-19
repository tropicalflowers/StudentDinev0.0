/**
 * Seed Script: Copy Restaurants from MongoDB to PostgreSQL Prisma
 * 
 * This script reads restaurants from MongoDB and inserts them into PostgreSQL.
 * It directly connects to both databases (no server dependency required).
 * It safely avoids duplicate restaurantId entries.
 * 
 * How to run:
 * node scripts/seedPrismaRestaurants.js
 * 
 * MongoDB restaurants remain untouched. This is a one-way copy operation.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { PrismaClient } = require('@prisma/client');
const path = require('path');

// Import MongoDB Restaurant model
const Restaurant = require('../models/Restaurant');

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
};

// Helper function to log with colors
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Main seed function
 */
async function seedRestaurants() {
  let prisma = null;
  
  try {
    log('\n=== STARTING MONGODB → POSTGRESQL SEED ===\n', 'blue');

    // Step 1: Connect to MongoDB
    log('📦 Connecting to MongoDB...', 'yellow');
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/studentdine';
    await mongoose.connect(mongoUri);
    log('✓ MongoDB connected', 'green');

    // Step 2: Connect to PostgreSQL via Prisma
    log('🗄️  Connecting to PostgreSQL...', 'yellow');
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable not set');
    }
    prisma = new PrismaClient();
    await prisma.$connect();
    log('✓ PostgreSQL connected', 'green');

    // Step 3: Fetch all restaurants from MongoDB
    log('\n📖 Reading restaurants from MongoDB...', 'yellow');
    const mongoRestaurants = await Restaurant.find({}).lean();
    log(`Found ${mongoRestaurants.length} restaurants in MongoDB\n`, 'blue');

    if (mongoRestaurants.length === 0) {
      log('⚠ No restaurants found in MongoDB. Nothing to seed.', 'yellow');
      return;
    }

    // Step 4: Prepare restaurants for Prisma insertion
    let copiedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const mongoRestaurant of mongoRestaurants) {
      try {
        // Check if this restaurant already exists in PostgreSQL by restaurantId
        const existing = await prisma.restaurant.findUnique({
          where: { restaurantId: mongoRestaurant.restaurantId },
        });

        if (existing) {
          log(`  ⊘ Skipped: "${mongoRestaurant.name}" (restaurantId already exists)`, 'yellow');
          skippedCount++;
          continue;
        }

        // Transform MongoDB document to Prisma format
        const prismaData = {
          restaurantId: mongoRestaurant.restaurantId,
          name: mongoRestaurant.name,
          cluster: mongoRestaurant.cluster || 'North Campus',
          address: mongoRestaurant.address || null,
          phone: mongoRestaurant.phone || null,
          email: mongoRestaurant.email || null,
          manager: mongoRestaurant.manager || null,
          capacity: Number(mongoRestaurant.capacity) || 0,
          isOpen: mongoRestaurant.isOpen !== false,
          statusNote: mongoRestaurant.statusNote || '',
          // Note: MongoDB 'timings' field is NOT migrated (not in Prisma schema)
        };

        // Insert into PostgreSQL
        await prisma.restaurant.create({ data: prismaData });
        log(`  ✓ Copied: "${mongoRestaurant.name}" (ID: ${mongoRestaurant.restaurantId})`, 'green');
        copiedCount++;

      } catch (error) {
        log(`  ✗ Error copying "${mongoRestaurant.name}": ${error.message}`, 'red');
        errorCount++;
      }
    }

    // Step 5: Print summary
    log('\n=== SEED SUMMARY ===', 'blue');
    log(`✓ Copied:  ${copiedCount} restaurants`, 'green');
    log(`⊘ Skipped: ${skippedCount} restaurants (duplicates)`, 'yellow');
    log(`✗ Errors:  ${errorCount} restaurants`, errorCount > 0 ? 'red' : 'green');
    log(`═══════════════════════`, 'blue');

    if (errorCount === 0) {
      log('\n✓ Seed completed successfully! All restaurants are now in PostgreSQL.', 'green');
    } else {
      log(`\n⚠ Seed completed with ${errorCount} error(s). Review the log above.`, 'yellow');
    }

    log('\nNext steps:', 'blue');
    log('1. MongoDB restaurants remain unchanged', 'blue');
    log('2. PostgreSQL now has your restaurant data', 'blue');
    log('3. Manager UI will use PostgreSQL for restaurant CRUD', 'blue');
    log('4. Student ordering still uses MongoDB menu data\n', 'blue');

  } catch (error) {
    log(`\n✗ SEED FAILED: ${error.message}\n`, 'red');
    process.exit(1);
  } finally {
    // Step 6: Cleanup connections
    if (prisma) {
      await prisma.$disconnect();
    }
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
    }
  }
}

/**
 * Run the seed script
 */
seedRestaurants()
  .then(() => {
    log('Exiting seed script.\n', 'blue');
    process.exit(0);
  })
  .catch(error => {
    log(`\nUnexpected error: ${error.message}\n`, 'red');
    process.exit(1);
  });
