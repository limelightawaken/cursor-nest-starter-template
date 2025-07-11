import { Injectable } from '@nestjs/common';
import { prisma } from '../../../lib/prisma';

@Injectable()
export class AuthService {
  constructor() {}

  // Custom auth-related business logic can go here.
  // For example, methods to run after a user signs up, 
  // custom user profile management, role assignments, etc.

  /**
   * Example: Custom logic to run after user registration
   * This could be called from a webhook or custom endpoint
   */
  async onUserRegistered(userId: string) {
    // Custom logic like:
    // - Send welcome email
    // - Initialize user preferences
    // - Assign default role
    // - Create related records
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user) {
      // Add your custom logic here
      console.log(`User ${user.email} has been registered`);
    }

    return user;
  }

  /**
   * Example: Get user profile with additional data
   */
  async getUserProfile(userId: string) {
    return await prisma.user.findUnique({
      where: { id: userId },
      include: {
        sessions: true,
        accounts: true,
      },
    });
  }

  /**
   * Example: Update user status
   */
  async updateUserStatus(userId: string, isActive: boolean) {
    return await prisma.user.update({
      where: { id: userId },
      data: { isActive },
    });
  }
} 