/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../users/user.entity';
import { Role } from '../roles/role.entity';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    // Get the roles metadata set on the route handler
    const roles = this.reflector.get<string[]>('roles', context.getHandler());

    if (!roles) {
      return true; // If no roles are specified, allow access
    }

    const request = context.switchToHttp().getRequest();
    const user: User = request.user; // Explicitly type the user as User

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const userRole: Role = user.role; // Explicitly type the user's role as Role

    if (!userRole) {
      throw new ForbiddenException('User role is not defined');
    }

    // Check if the user's role is in the allowed roles
    if (!roles.includes(userRole.name)) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return true;
  }
}
