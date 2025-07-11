import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

// Define a type for user object that might be attached to request
type User = {
  id: string;
  role: string;
  [key: string]: unknown; // Allow other unknown properties if any
};

// Extend Express Request to optionally include user property
type CustomRequest = Request & {
  user?: User;
};

@Injectable() // Marks this class as injectable by NestJS DI system
export class LoggerMiddleware implements NestMiddleware {
  // 'use' method runs on every request that hits the middleware
  use(req: CustomRequest, res: Response, next: NextFunction): void {
    // Extract user role if available, default to 'Guest' otherwise
    const role = req.user?.role ?? 'Guest';

    // Log method, url and user role with a timestamp
    console.log(
      `[${new Date().toISOString()}] [${req.method}] ${req.originalUrl} | Role: ${role}`,
    );

    // Call next() to pass control to the next middleware/handler
    next();
  }
}
