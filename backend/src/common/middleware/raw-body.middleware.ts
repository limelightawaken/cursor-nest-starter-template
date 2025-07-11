import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as express from 'express';

@Injectable()
export class RawBodyMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Check if the route matches the Better Auth pattern
    if (req.baseUrl?.startsWith('/api/auth') || req.url?.startsWith('/api/auth')) {
      // Skip JSON and URL-encoded body parsing for Better Auth routes
      next();
      return;
    }

    // Otherwise, parse the body as usual for other routes
    express.json({ limit: '5mb' })(req, res, (err) => {
      if (err) {
        next(err);
        return;
      }
      express.urlencoded({ extended: true, limit: '5mb' })(req, res, next);
    });
  }
} 