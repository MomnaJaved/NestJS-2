import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { User } from '../entities/user.entity'; // Adjust the path if needed

// Extend Express Request to optionally include user property typed as User
type CustomRequest = Request & {
  user?: User;
};

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: CustomRequest, res: Response, next: NextFunction): void {
    // Extract user role if available, default to 'Guest' otherwise
    const role = req.user?.role ? String(req.user.role) : 'Guest';

    // Log method, url and user role with a timestamp
    console.log(
      `[${new Date().toISOString()}] [${req.method}] ${req.originalUrl} | Role: ${role}`,
    );

    next();
  }
}
