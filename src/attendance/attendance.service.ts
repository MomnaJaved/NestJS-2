import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { AttendanceRecord } from './attendance_record.entity';
import { Subject } from '../subjects/subjects.entity';

@Injectable()
export class AttendanceService {
  getAttendanceForSubject() {
    throw new Error('Method not implemented.');
  }
  constructor(
    @InjectRepository(AttendanceRecord)
    private readonly attendanceRepository: Repository<AttendanceRecord>, // Inject AttendanceRecord repository
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {}

  // Mark attendance for students in a subject
  async markAttendance(
    subjectId: number,
    studentIds: string[],
    status: boolean,
  ) {
    const date = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    // Map studentIds to create attendance records
    const records = studentIds.map((studentId) => ({
      student: { id: studentId }, // Reference to the student using their ID
      subject: { id: subjectId }, // Reference to the subject using its ID
      date,
      status,
    }));

    // Save attendance records
    return this.attendanceRepository.save(records);
  }
}
