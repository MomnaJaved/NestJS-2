import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentSubject } from '../middleTables/student_subjects.entity';

@Injectable()
export class FacultyAssignedToSubjectGuard implements CanActivate {
  constructor(
    @InjectRepository(StudentSubject)
    private readonly studentSubjectRepo: Repository<StudentSubject>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      user?: { sub: string };
      body: { subjectId: number };
    }>();

    const facultyId = request.user?.sub; // from JWT
    const { subjectId } = request.body;

    if (!facultyId || !subjectId) {
      throw new ForbiddenException('Missing authentication or subject data');
    }

    // Check if the logged-in faculty is registered in the subject
    const isRegistered = await this.studentSubjectRepo.findOne({
      where: {
        student: { id: facultyId },
        subject: { id: subjectId },
      },
    });

    if (!isRegistered) {
      throw new ForbiddenException(
        'You are not assigned to this subject as faculty',
      );
    }

    return true;
  }
}
