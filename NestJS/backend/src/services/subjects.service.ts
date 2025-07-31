import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from '../entities/subjects.entity';
import { StudentSubject } from '../middleTables/student_subjects.entity';
import { User } from '../entities/user.entity';
import { UpdateSubjectDto } from '../dtos/update-subject.dto';
import { StudentFaculty } from '../middleTables/student_faculty.entity';

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

  async createSubject(name: string): Promise<Subject> {
    const newSubject = this.subjectRepository.create({ name });
    const insertResult = await this.subjectRepository
      .createQueryBuilder()
      .insert()
      .into(Subject)
      .values(newSubject)
      .execute();

    // Return the inserted subject with generated ID
    return this.subjectRepository.findOneOrFail({
      where: { id: insertResult.identifiers[0].id },
    });
  }

  async findAll(): Promise<Subject[]> {
    return await this.subjectRepository.find();
  }

  async findById(id: number): Promise<Subject> {
    const subject = await this.subjectRepository.findOne({ where: { id } });
    if (!subject) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }
    return subject;
  }

  async deleteSubject(id: number): Promise<void> {
    const deleteResult = await this.subjectRepository
      .createQueryBuilder()
      .delete()
      .from(Subject)
      .where('id = :id', { id })
      .execute();

    if (deleteResult.affected === 0) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }
  }

  async updateSubject(id: number, dto: UpdateSubjectDto): Promise<Subject> {
    const subject = await this.findById(id);

    // Manually update fields from dto
    if (dto.name !== undefined) subject.name = dto.name;

    await this.subjectRepository
      .createQueryBuilder()
      .update(Subject)
      .set({ name: subject.name })
      .where('id = :id', { id })
      .execute();

    // Return updated subject
    return this.findById(id);
  }

  async registerStudentToSubject(
    studentId: string,
    subjectId: number,
  ): Promise<StudentSubject> {
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

    const insertResult = await this.studentSubjectRepository
      .createQueryBuilder()
      .insert()
      .into(StudentSubject)
      .values(studentSubject)
      .execute();

    return this.studentSubjectRepository.findOneOrFail({
      where: { id: insertResult.identifiers[0].id },
      relations: ['student', 'subject'],
    });
  }

  async updateStudentFacultyRelations(subjectId: number): Promise<void> {
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

          await this.studentFacultyRepository
            .createQueryBuilder()
            .insert()
            .into(StudentFaculty)
            .values(relation)
            .execute();
        }
      }
    }
  }
}
