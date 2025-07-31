import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers.authorization?.split(' ')[1]; // Extract token from Bearer

    if (!token) {
      throw new UnauthorizedException('Token not provided'); // If no token, throw an error
    }

    try {
      // Verify the JWT and decode it
      const decoded = this.jwtService.verify<JwtPayload>(token);
      console.log('Decoded JWT:', decoded); // Log decoded JWT for debugging (avoid this in production)

      // Attach the decoded user data to the request object for later use in controllers or other guards
      request.user = decoded;

      console.log('Request user:', request.user); // Log user data for debugging (avoid this in production)

      return true; // Allow the request to proceed
    } catch (error) {
      console.error('JWT verification error:', error); // Log error for debugging
      throw new UnauthorizedException('Invalid or expired token'); // Token is either invalid or expired
    }
  }
}
