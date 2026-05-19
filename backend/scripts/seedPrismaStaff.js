/**
 * Seed Script: Copy Staff from MongoDB to PostgreSQL Prisma
 * 
 * This script reads staff from MongoDB and inserts them into PostgreSQL.
 * It directly connects to both databases (no server dependency required).
 * It safely avoids duplicate staffId entries.
 * 
 * How to run:
 * node scripts/seedPrismaStaff.js
 * 
 * MongoDB staff remain untouched. This is a one-way copy operation.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { PrismaClient } = require('@prisma/client');

// Import MongoDB Staff model
const Staff = require('../models/Staff');

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
async function seedStaff() {
  let prisma = null;
  
  try {
    log('\n=== STARTING MONGODB → POSTGRESQL STAFF SEED ===\n', 'blue');

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

    // Step 3: Fetch all staff from MongoDB
    log('\n👥 Reading staff from MongoDB...', 'yellow');
    const mongoStaff = await Staff.find({}).lean();
    log(`Found ${mongoStaff.length} staff members in MongoDB\n`, 'blue');

    if (mongoStaff.length === 0) {
      log('⚠ No staff found in MongoDB. Nothing to seed.', 'yellow');
      return;
    }

    // Step 4: Prepare staff for Prisma insertion
    let copiedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const mongoMember of mongoStaff) {
      try {
        // Check if this staff already exists in PostgreSQL by staffId
        const existing = await prisma.staff.findUnique({
          where: { staffId: mongoMember.staffId },
        });

        if (existing) {
          log(`  ⊘ Skipped: "${mongoMember.name}" (staffId already exists)`, 'yellow');
          skippedCount++;
          continue;
        }

        // Transform MongoDB document to Prisma format
        const prismaData = {
          staffId: mongoMember.staffId,
          name: mongoMember.name,
          role: mongoMember.role || 'Waiter',
          email: mongoMember.email || null,
          phone: mongoMember.phone || null,
          restaurantId: mongoMember.restaurant || 'Main Cafeteria',
          shift: mongoMember.shift || 'Morning',
          isActive: mongoMember.active !== false,
          // Note: MongoDB 'department' field is NOT migrated (not in Prisma schema)
        };

        // Insert into PostgreSQL
        await prisma.staff.create({ data: prismaData });
        log(`  ✓ Copied: "${mongoMember.name}" (ID: ${mongoMember.staffId})`, 'green');
        copiedCount++;

      } catch (error) {
        log(`  ✗ Error copying "${mongoMember.name}": ${error.message}`, 'red');
        errorCount++;
      }
    }

    // Step 5: Print summary
    log('\n=== SEED SUMMARY ===', 'blue');
    log(`✓ Copied:  ${copiedCount} staff members`, 'green');
    log(`⊘ Skipped: ${skippedCount} staff members (duplicates)`, 'yellow');
    log(`✗ Errors:  ${errorCount} staff members`, errorCount > 0 ? 'red' : 'green');
    log(`═══════════════════════`, 'blue');

    if (errorCount === 0) {
      log('\n✓ Staff seed completed successfully! All staff are now in PostgreSQL.', 'green');
    } else {
      log(`\n⚠ Staff seed completed with ${errorCount} error(s). Review the log above.`, 'yellow');
    }

    log('\nNext steps:', 'blue');
    log('1. MongoDB staff remain unchanged', 'blue');
    log('2. PostgreSQL now has your staff data', 'blue');
    log('3. Manager UI will use PostgreSQL for staff CRUD', 'blue');
    log('4. Student app still uses MongoDB data\n', 'blue');

  } catch (error) {
    log(`\n✗ STAFF SEED FAILED: ${error.message}\n`, 'red');
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
seedStaff()
  .then(() => {
    log('Exiting staff seed script.\n', 'blue');
    process.exit(0);
  })
  .catch(error => {
    log(`\nUnexpected error: ${error.message}\n`, 'red');
    process.exit(1);
  });
