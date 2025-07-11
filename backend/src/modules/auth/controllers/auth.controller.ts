import { Controller, All, Req, Res } from '@nestjs/common';
import { auth } from '../../../lib/auth';
import { toNodeHandler } from 'better-auth/node';
import { Request, Response } from 'express';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  @All('*')
  @ApiOperation({ summary: 'Handle all Better Auth endpoints' })
  async handleAuth(@Req() req: Request, @Res() res: Response) {
    // Use Better Auth's Node.js handler - this handles all auth endpoints
    return toNodeHandler(auth)(req, res);
  }
} 