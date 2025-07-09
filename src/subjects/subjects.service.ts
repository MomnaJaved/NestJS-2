import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Subject } from './subjects.entity';
import { StudentSubject } from './student_subjects.entity';
import { User } from '../users/user.entity';
import { UpdateSubjectDto } from './dtos/update-subject.dto';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(StudentSubject)
    private readonly studentSubjectRepository: Repository<StudentSubject>,
  ) {}

  async createSubject(name: string): Promise<Subject> {
    const newSubject = this.subjectRepository.create({ name });
    return await this.subjectRepository.save(newSubject);
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
    const deleteResult = await this.subjectRepository.delete(id);
    if (deleteResult.affected === 0) {
      throw new NotFoundException(`Subject with ID ${id} not found`);
    }
  }
  async updateSubject(id: number, dto: UpdateSubjectDto): Promise<Subject> {
    const subject = await this.findById(id);
    Object.assign(subject, dto);
    return this.subjectRepository.save(subject);
  }

  async registerStudentToSubject(
    studentId: string,
    subjectId: number,
  ): Promise<StudentSubject> {
    // Check if student exists
    const student = await this.userRepository.findOne({
      where: { id: studentId },
    });
    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Check if subject exists
    const subject = await this.subjectRepository.findOne({
      where: { id: subjectId },
    });
    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    // Check if already registered
    const existing = await this.studentSubjectRepository.findOne({
      where: {
        student: { id: studentId },
        subject: { id: subjectId },
      },
    });
    if (existing) {
      throw new ConflictException(
        'Student is already registered to this subject',
      );
    }

    // Create registration entity
    const studentSubject = this.studentSubjectRepository.create({
      student,
      subject,
    });

    const saved = await this.studentSubjectRepository.save(studentSubject);

    return saved;
  }
}
