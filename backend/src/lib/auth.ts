import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from './prisma';

export const auth = betterAuth({
  // Use Prisma as the database adapter
  database: prismaAdapter(prisma, { provider: 'postgresql' }),
  
  // Enable the email and password provider
  emailAndPassword: { 
    enabled: true,
    requireEmailVerification: false, // Set to true when email is configured
  },

  // Configure session management
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  },

  // Basic rate limiting for security
  rateLimit: {
    enabled: true,
    storage: 'database',
    window: 15 * 60, // 15 minutes
    max: 20, // 20 attempts per window
  },

  // Base URL for the application (will be overridden by environment)
  baseURL: process.env.BASE_URL || 'http://localhost:3000',
  
  // Secret for signing tokens and sessions
  secret: process.env.AUTH_SECRET || 'your_super_secret_32_character_key_here_please_change_in_env',
}); 