import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentSubject } from '../junctionTables/student_subjects.entity';

@Injectable()
export class FacultySubjectAccessGuard implements CanActivate {
  constructor(
    @InjectRepository(StudentSubject)
    private readonly studentSubjectRepo: Repository<StudentSubject>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      user?: { sub: string; role: { name: string } };
      params: { subjectId?: string };
    }>();

    const user = request.user;
    const subjectId = Number(request.params.subjectId);

    if (!user || !subjectId) {
      throw new ForbiddenException('Missing user or subject ID');
    }

    if (user.role.name === 'admin') {
      return true; // Admin has access
    }

    if (user.role.name === 'Faculty') {
      const isAssigned = await this.studentSubjectRepo.findOne({
        where: {
          student: { id: user.sub },
          subject: { id: subjectId },
        },
      });

      if (!isAssigned) {
        throw new ForbiddenException(
          'You are not assigned to this subject as faculty',
        );
      }

      return true;
    }

    // All others denied (students, etc.)
    throw new ForbiddenException('Access denied');
  }
}
