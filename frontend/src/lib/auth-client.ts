import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  // Better Auth will automatically append the correct endpoint paths
  // Our NestJS backend handles these at /auth/* routes
  fetchOptions: {
    credentials: 'include', // Important for session cookies
  },
});

// Export hooks and methods for easier usage
export const {
  useSession,
  signIn,
  signUp,
  signOut,
} = authClient;

// Export types for TypeScript
export type Session = typeof authClient.$Infer.Session;
export type User = typeof authClient.$Infer.Session.user; 