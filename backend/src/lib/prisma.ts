import { PrismaClient } from '@prisma/client';

// Create a singleton Prisma client instance to prevent creating too many database connections
export const prisma = new PrismaClient(); 