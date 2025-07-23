import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentSubject } from '../middleTables/student_subjects.entity';
import { StudentFaculty } from '../middleTables/student_faculty.entity';

@Injectable()
export class RolesOrOwnerFacultyGuard implements CanActivate {
  constructor(
    @InjectRepository(StudentFaculty)
    private readonly studentFacultyRepo: Repository<StudentFaculty>,

    @InjectRepository(StudentSubject)
    private readonly studentSubjectRepo: Repository<StudentSubject>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Get the user object from the request
    const studentIdParam = request.params.studentId; // Get the studentId from the URL

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Allow access to the student only for their own attendance records
    if (user.role === 'Student') {
      if (user.sub !== studentIdParam) {
        throw new ForbiddenException(
          'Students can only access their own attendance records',
        );
      }
      return true; // Allow student to access their own attendance
    }

    //Allow admin to access all attendance records
    if (user.role === 'admin') {
      return true; // Allow admin access to all records
    }

    //Allow faculty to access student attendance if they are assigned to the student
    if (user.role === 'Faculty') {
      if (!studentIdParam) {
        throw new ForbiddenException('Student ID parameter missing');
      }

      const facultyId = user.sub; // Faculty ID from JWT token
      const studentId = studentIdParam; // Student ID from URL parameter

      console.log('Faculty ID:', facultyId); // Debugging the faculty ID

      // Check if faculty and student have a relation in the `StudentFaculty` table
      const relationExists = await this.studentFacultyRepo.findOne({
        where: {
          faculty: { id: facultyId },
          student: { id: studentId },
        },
      });

      if (!relationExists) {
        throw new ForbiddenException('Faculty is not related to this student');
      }

      return true; // Allow faculty access to this student's attendance
    }

    // Default fallback: If none of the roles match, deny access
    throw new ForbiddenException('Access denied');
  }
}
