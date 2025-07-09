import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class RolesOrOwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<{
      user?: { sub: string; role: { name: string } };
      params: { studentId?: string };
    }>();

    const user = request.user;
    const studentIdParam = request.params.studentId;

    if (!user) return false;

    if (user.role.name === 'Student') {
      if (user.sub !== studentIdParam) {
        throw new ForbiddenException(
          'Students can only access their own attendance records',
        );
      }
      return true;
    }

    if (user.role.name === 'Faculty' || user.role.name === 'admin') {
      return true;
    }

    throw new ForbiddenException('Access denied');
  }
}
