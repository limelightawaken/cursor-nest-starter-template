import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { auth } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    try {
      // 1. Verify session with Better Auth using headers/cookies
      const session = await auth.api.getSession({ headers: request.headers });

      if (!session?.session) {
        throw new UnauthorizedException('Invalid or expired session');
      }

      // 2. Load user from the database to ensure they are active
      const user = await prisma.user.findUnique({
        where: { id: session.session.userId },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('User not found or inactive');
      }

      // 3. Attach user data to the request for downstream use
      request.user = session.user;
      request.session = session.session;

      return true;
    } catch (error) {
      throw new UnauthorizedException('Authentication failed');
    }
  }
} 