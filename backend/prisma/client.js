import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Database connection test
prisma.$connect()
  .then(() => console.log('✅ Connected to PostgreSQL'))
  .catch((err) => console.error('❌ Database connection error:', err));

export default prisma;