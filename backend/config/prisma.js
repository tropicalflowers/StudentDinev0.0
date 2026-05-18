const { PrismaClient } = require('@prisma/client');

let prisma = null;
let isConnected = false;

function getPrisma() {
  if (!process.env.DATABASE_URL) {
    return null;
  }

  if (!prisma) {
    prisma = new PrismaClient();
  }

  return prisma;
}

/**
 * Optional PostgreSQL connect. Never throws — server must keep running if PG is down.
 * @returns {Promise<boolean>}
 */
async function connectPrisma() {
  if (!process.env.DATABASE_URL) {
    console.warn('PostgreSQL: DATABASE_URL not set — Prisma disabled (MongoDB unchanged)');
    return false;
  }

  try {
    const client = getPrisma();
    await client.$connect();
    isConnected = true;
    console.log('PostgreSQL connected successfully (Prisma)');
    return true;
  } catch (error) {
    isConnected = false;
    console.warn(
      'PostgreSQL connection failed — server will continue without Prisma:',
      error.message
    );
    return false;
  }
}

async function disconnectPrisma() {
  if (!prisma) return;

  try {
    await prisma.$disconnect();
  } catch (_) {
    // ignore shutdown errors
  } finally {
    isConnected = false;
    prisma = null;
  }
}

function isPrismaConnected() {
  return isConnected;
}

module.exports = {
  getPrisma,
  connectPrisma,
  disconnectPrisma,
  isPrismaConnected,
};
