import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subject } from './subjects.entity';
import { Repository } from 'typeorm';
import { CreateSubjectDto } from './dtos/create-subject.dto';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {}

  async createSubject(createSubjectDto: CreateSubjectDto) {
    const { name, description } = createSubjectDto;
    const newSubject = this.subjectRepository.create({ name, description });
    return await this.subjectRepository.save(newSubject);
  }

  async getSubjects(): Promise<Subject[]> {
    return this.subjectRepository.find({ relations: ['attendanceRecords'] });
  }
}
