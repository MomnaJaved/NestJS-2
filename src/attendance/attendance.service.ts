import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from './attendance.entity';
import { AttendanceRecord } from '../middleTables/attendance_record.entity';
import { Repository } from 'typeorm';
import { StudentSubject } from '../middleTables/student_subjects.entity';
import { User } from '../users/user.entity';
import { AttendanceStatus } from '../common/attendance-status.enum';

export interface AttendanceDetails {
  studentId: string;
  subjects: {
    subject: string;
    attendance: { date: Date; status: AttendanceStatus }[];
  }[];
}

export interface AttendanceSummary {
  subjectId: number;
  subjectName: string;
  students: {
    studentId: string;
    studentName: string;
    attendance: { date: Date; status: AttendanceStatus }[];
  }[];
}

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private readonly attendanceRepo: Repository<Attendance>,

    @InjectRepository(AttendanceRecord)
    private readonly attendanceRecordRepo: Repository<AttendanceRecord>,

    @InjectRepository(StudentSubject)
    private readonly studentSubjectRepo: Repository<StudentSubject>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async markAttendance(
    studentId: string,
    subjectId: number,
    status: AttendanceStatus,
  ): Promise<{ message: string }> {
    // Check if student is registered in the subject
    const registeredCount = await this.studentSubjectRepo
      .createQueryBuilder('ss')
      .where('ss.student_Id = :studentId', { studentId })
      .andWhere('ss.subject_Id = :subjectId', { subjectId })
      .getCount();

    if (registeredCount === 0) {
      throw new NotFoundException('Student not registered in this subject');
    }

    // Verify student exists
    const studentCount = await this.userRepo
      .createQueryBuilder('user')
      .where('user.id = :studentId', { studentId })
      .getCount();

    if (studentCount === 0) {
      throw new NotFoundException('Student not found');
    }

    const date = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'

    // Insert attendance entry
    const attendanceInsert = await this.attendanceRepo
      .createQueryBuilder()
      .insert()
      .into('attendance')
      .values({ date, subjectId })
      .execute();

    const attendanceId = attendanceInsert.identifiers[0].id;

    // Insert attendance record
    await this.attendanceRecordRepo
      .createQueryBuilder()
      .insert()
      .into(AttendanceRecord)
      .values({
        date,
        status,
        student: { id: studentId },
        subject: { id: subjectId },
        attendance: { id: attendanceId },
      })
      .execute();

    return { message: 'Attendance marked successfully' };
  }

  async getStudentAttendanceDetails(
    studentId: string,
  ): Promise<AttendanceDetails> {
    const records = await this.attendanceRecordRepo
      .createQueryBuilder('record')
      .innerJoinAndSelect('record.attendance', 'attendance')
      .innerJoinAndSelect('record.subject', 'subject')
      .where('record.studentId = :studentId', { studentId })
      .orderBy('attendance.date', 'ASC')
      .getMany();

    const grouped: Record<
      string,
      {
        subject: string;
        attendance: { date: Date; status: AttendanceStatus }[];
      }
    > = {};

    for (const rec of records) {
      const subjectName = rec.subject.name;

      if (!grouped[subjectName]) {
        grouped[subjectName] = {
          subject: subjectName,
          attendance: [],
        };
      }

      grouped[subjectName].attendance.push({
        date: new Date(rec.attendance.date),
        status: rec.status,
      });
    }

    return {
      studentId,
      subjects: Object.values(grouped),
    };
  }
  async viewAllAttendance(subjectId: number): Promise<AttendanceSummary> {
    const records = await this.attendanceRecordRepo
      .createQueryBuilder('record')
      .innerJoinAndSelect('record.attendance', 'attendance')
      .innerJoinAndSelect('record.subject', 'subject')
      .innerJoinAndSelect('record.student', 'student')
      .where('subject.id = :subjectId', { subjectId })
      .orderBy('attendance.date', 'ASC')
      .getMany();

    const grouped: Record<
      string,
      {
        studentId: string;
        studentName: string;
        attendance: { date: Date; status: AttendanceStatus }[];
      }
    > = {};

    // Group the attendance by studentId
    for (const rec of records) {
      const studentId = rec.student.id;
      const studentName = `${rec.student.firstName} ${rec.student.lastName}`;

      if (!grouped[studentId]) {
        grouped[studentId] = {
          studentId,
          studentName,
          attendance: [],
        };
      }

      // Ensure the date is correctly converted to a Date object
      const attendanceDate = new Date(rec.attendance.date);

      // Add attendance data for each student
      grouped[studentId].attendance.push({
        date: attendanceDate, // Store as Date object
        status: rec.status, // Attendance status (e.g., present/absent)
      });
    }

    return {
      subjectId,
      subjectName: records[0]?.subject?.name || 'Unknown Subject', // Handle case when subject is missing
      students: Object.values(grouped), // Return the grouped data as an array
    };
  }

  async getAttendanceRecordById(id: number): Promise<AttendanceRecord> {
    const record = await this.attendanceRecordRepo
      .createQueryBuilder('record')
      .innerJoinAndSelect('record.attendance', 'attendance')
      .innerJoinAndSelect('record.subject', 'subject')
      .innerJoinAndSelect('record.student', 'student')
      .addSelect([
        'attendance.date',
        'subject.name',
        'student.firstName',
        'student.lastName',
      ])
      .where('record.id = :id', { id })
      .getOne();

    if (!record) {
      throw new NotFoundException(`Attendance record with ID ${id} not found`);
    }

    return record;
  }

  async updateAttendance(
    id: number,
    status: AttendanceStatus,
  ): Promise<AttendanceRecord> {
    const updateResult = await this.attendanceRecordRepo
      .createQueryBuilder()
      .update()
      .set({ status })
      .where('id = :id', { id })
      .execute();

    if (updateResult.affected === 0) {
      throw new NotFoundException(`Attendance record with ID ${id} not found`);
    }

    return this.getAttendanceRecordById(id);
  }

  async deleteAttendance(id: number): Promise<{ message: string }> {
    const deleteResult = await this.attendanceRecordRepo
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id })
      .execute();

    if (deleteResult.affected === 0) {
      throw new NotFoundException(`Attendance record with ID ${id} not found`);
    }

    return { message: 'Attendance record deleted successfully.' };
  }
}
