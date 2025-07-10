import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StudentSubject } from '../junctionTables/student_subjects.entity';
import { StudentFaculty } from '../junctionTables/student_faculty.entity';

@Injectable()
export class RolesOrOwnerFacultyGuard implements CanActivate {
  constructor(
    @InjectRepository(StudentFaculty)
    private readonly studentFacultyRepo: Repository<StudentFaculty>,

    @InjectRepository(StudentSubject)
    private readonly studentSubjectRepo: Repository<StudentSubject>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<{
      user?: { sub: string; role: { name: string } };
      params: { studentId?: string };
    }>();

    const user = request.user;
    const studentIdParam = request.params.studentId;

    if (!user) {
      return false;
    }

    if (user.role.name === 'Student') {
      if (user.sub !== studentIdParam) {
        throw new ForbiddenException(
          'Students can only access their own attendance records',
        );
      }
      return true;
    }

    if (user.role.name === 'admin') {
      return true;
    }

    if (user.role.name === 'Faculty') {
      if (!studentIdParam) {
        throw new ForbiddenException('Student ID parameter missing');
      }
      const facultyId = user.sub;
      const studentId = studentIdParam;

      // Check if faculty and student have a relation
      const relationExists = await this.studentFacultyRepo.findOne({
        where: {
          faculty: { id: facultyId },
          student: { id: studentId },
        },
      });

      if (!relationExists) {
        throw new ForbiddenException('Faculty is not related to this student');
      }

      // Check if faculty and student share at least one subject
      const facultySubjects = await this.studentSubjectRepo.find({
        where: { student: { id: facultyId } },
        relations: ['subject'],
      });

      const studentSubjects = await this.studentSubjectRepo.find({
        where: { student: { id: studentId } },
        relations: ['subject'],
      });

      const facultySubjectIds = facultySubjects.map((s) => s.subject.id);
      const studentSubjectIds = studentSubjects.map((s) => s.subject.id);

      const commonSubject = facultySubjectIds.find((id) =>
        studentSubjectIds.includes(id),
      );

      if (!commonSubject) {
        throw new ForbiddenException(
          'Faculty and student do not share any subjects',
        );
      }

      return true;
    }

    throw new ForbiddenException('Access denied');
  }
}
