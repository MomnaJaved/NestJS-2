import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    // Get the roles metadata set on the route handler
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return true; // If no roles are specified, allow access
    }

    console.log('role from metadata ', roles);
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Get the user object from the request

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const userRole = user.role;

    if (!userRole) {
      throw new ForbiddenException('User role is not defined');
    }

    // Check if the user's role matches the required roles
    if (!roles.includes(userRole)) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return true;
  }
}
