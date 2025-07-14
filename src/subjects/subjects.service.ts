import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from './subjects.entity';
import { StudentSubject } from '../junctionTables/student_subjects.entity';
import { User } from '../users/user.entity';
import { UpdateSubjectDto } from './dtos/update-subject.dto';
import { StudentFaculty } from '../junctionTables/student_faculty.entity';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(StudentSubject)
    private readonly studentSubjectRepository: Repository<StudentSubject>,

    @InjectRepository(StudentFaculty)
    private readonly studentFacultyRepository: Repository<StudentFaculty>,
  ) {}

  async createSubject(name: string) {
    const newSubject = this.subjectRepository.create({ name });
    return await this.subjectRepository.save(newSubject);
  }

  async findAll() {
    return await this.subjectRepository.find();
  }

  async findById(id: number) {
    const subject = await this.subjectRepository.findOne({ where: { id } });
    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }
    return subject;
  }

  async deleteSubject(id: number) {
    const deleteResult = await this.subjectRepository.delete(id);
    if (deleteResult.affected === 0) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }
  }

  async updateSubject(id: number, dto: UpdateSubjectDto) {
    const subject = await this.findById(id);
    Object.assign(subject, dto);
    return this.subjectRepository.save(subject);
  }

  async registerStudentToSubject(studentId: string, subjectId: number) {
    const student = await this.userRepository.findOne({
      where: { id: studentId },
    });
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const subject = await this.subjectRepository.findOne({
      where: { id: subjectId },
    });
    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    const existing = await this.studentSubjectRepository.findOne({
      where: {
        student: { id: studentId },
        subject: { id: subjectId },
      },
      relations: ['student', 'subject'],
    });

    if (existing) {
      throw new ConflictException(
        'Student is already registered to this subject',
      );
    }

    const studentSubject = this.studentSubjectRepository.create({
      student,
      subject,
    });

    return await this.studentSubjectRepository.save(studentSubject);
  }

  async updateStudentFacultyRelations(subjectId: number) {
    const userSubjects = await this.studentSubjectRepository.find({
      where: { subject: { id: subjectId } },
      relations: ['student'],
    });

    const usersWithRoles = await Promise.all(
      userSubjects.map(async (us: StudentSubject) => {
        const user = await this.userRepository.findOne({
          where: { id: us.student.id },
          relations: ['role'],
        });

        if (!user) throw new NotFoundException('User not found');
        return { userId: user.id, roleId: user.role.id };
      }),
    );

    const students = usersWithRoles.filter((u) => u.roleId === 8); // Student roleId = 8
    const faculties = usersWithRoles.filter((u) => u.roleId === 9); // Faculty roleId = 9

    for (const student of students) {
      for (const faculty of faculties) {
        const exists = await this.studentFacultyRepository.findOne({
          where: {
            student: { id: student.userId },
            faculty: { id: faculty.userId },
          },
          relations: ['student', 'faculty'],
        });

        if (!exists) {
          const relation = this.studentFacultyRepository.create({
            student: { id: student.userId },
            faculty: { id: faculty.userId },
          });

          await this.studentFacultyRepository.save(relation);
        }
      }
    }
  }
}
