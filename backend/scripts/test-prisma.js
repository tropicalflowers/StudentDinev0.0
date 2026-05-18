require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const { connectPrisma, getPrisma, disconnectPrisma } = require('../config/prisma');

(async () => {
  const ok = await connectPrisma();
  if (!ok) {
    process.exit(1);
  }

  const count = await getPrisma().feedback.count();
  console.log('Neon OK — feedback table exists, row count:', count);
  await disconnectPrisma();
})();
