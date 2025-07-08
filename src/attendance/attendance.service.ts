import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { Subject } from '../subjects/subjects.entity';
import { Attendance } from './attendance.entity';
import { AttendanceRecord } from './attendance_record.entity';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepo: Repository<Attendance>,

    @InjectRepository(AttendanceRecord)
    private readonly attendanceRecordRepo: Repository<AttendanceRecord>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Subject)
    private readonly subjectRepository: Repository<Subject>,
  ) {}

  async markAttendance(
    subjectId: number,
    studentIds: string[],
    status: boolean,
  ) {
    const date = new Date();

    const subject = await this.subjectRepository.findOneBy({ id: subjectId });
    if (!subject) throw new Error('Subject not found');

    // Step 1: Create attendance record for today & subject
    const attendanceRecord = this.attendanceRecordRepo.create({
      date,
      status,
      subject,
    });
    const savedRecord = await this.attendanceRecordRepo.save(attendanceRecord);

    // Step 2: Create individual attendance entries for each student
    const attendances = studentIds.map((studentId) =>
      this.attendanceRepo.create({
        user: { id: studentId },
        subjectName: subject.name,
        attendanceRecord: savedRecord,
      }),
    );

    return await this.attendanceRepo.save(attendances);
  }
}
