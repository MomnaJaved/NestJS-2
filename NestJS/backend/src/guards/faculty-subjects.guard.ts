import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentSubject } from '../middleTables/student_subjects.entity';

@Injectable()
export class FacultySubjectAccessGuard implements CanActivate {
  constructor(
    @InjectRepository(StudentSubject)
    private readonly studentSubjectRepo: Repository<StudentSubject>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Get the user object from the request
    const subjectId = Number(request.params.subjectId); // Get the subjectId from the URL

    console.log('Request User:', user); // Log user info
    console.log('Subject ID from params:', subjectId); // Log subjectId to check if it's correct

    if (!user || !subjectId) {
      throw new ForbiddenException('Missing user or subject ID');
    }

    // Allow full access
    if (user.role === 'admin') {
      return true; // Admin has access
    }

    // Allow access only to their own attendance
    if (user.role === 'Student') {
      if (user.sub !== request.params.studentId) {
        // Check if the student is accessing their own records
        throw new ForbiddenException(
          'Students can only access their own attendance records',
        );
      }
      return true;
    }

    // Check if faculty is assigned to the subject
    if (user.role === 'Faculty') {
      const isAssigned = await this.studentSubjectRepo.findOne({
        where: {
          student: { id: user.sub }, // Check if faculty is assigned to this student
          subject: { id: subjectId },
        },
        relations: ['student', 'subject'], // Ensure we load the student and subject relations
      });

      console.log('Faculty Assigned Check:', isAssigned); // Log to verify faculty-subject relationship

      if (!isAssigned) {
        throw new ForbiddenException(
          'You are not assigned to this subject as faculty',
        );
      }

      return true; // Faculty can access their assigned student's attendance
    }

    throw new ForbiddenException('Access denied');
  }
}
