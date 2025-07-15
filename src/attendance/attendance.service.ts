import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from './attendance.entity';
import { AttendanceRecord } from '../junctionTables/attendance_record.entity';
import { Repository } from 'typeorm';
import { StudentSubject } from '../junctionTables/student_subjects.entity';
import { User } from '../users/user.entity';
import { Subject } from '../subjects/subjects.entity';

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

    @InjectRepository(Subject)
    private readonly subjectRepo: Repository<Subject>,
  ) {}

  async markAttendance(
    studentId: string,
    subjectId: number,
    status: 'present' | 'absent',
  ) {
    const studentSubject = await this.studentSubjectRepo.findOne({
      where: {
        student: { id: studentId },
        subject: { id: subjectId },
      },
    });

    if (!studentSubject) {
      throw new NotFoundException('Student not registered in this subject');
    }

    const subject = await this.subjectRepo.findOne({
      where: { id: subjectId },
    });
    if (!subject) throw new NotFoundException('Subject not found');

    const attendance = await this.attendanceRepo.save({
      date: new Date().toISOString().slice(0, 10), // format to yyyy-mm-dd
      subject,
    });

    const student = await this.userRepo.findOne({ where: { id: studentId } });
    if (!student) throw new NotFoundException('Student not found');

    const attendanceRecord = this.attendanceRecordRepo.create({
      attendance,
      student,
      subject,
      status,
      date: new Date().toISOString().slice(0, 10),
    });

    return await this.attendanceRecordRepo.save(attendanceRecord);
  }

  async getStudentAttendanceDetails(studentId: string) {
    const records = await this.attendanceRecordRepo.find({
      where: { student: { id: studentId } },
      relations: ['attendance', 'subject'],
      order: { attendance: { date: 'ASC' } },
    });

    // Group records by subject
    const grouped: Record<string, { subject: string; attendance: any[] }> = {};

    for (const rec of records) {
      const subjectName = rec.subject.name;

      if (!grouped[subjectName]) {
        grouped[subjectName] = {
          subject: subjectName,
          attendance: [],
        };
      }

      grouped[subjectName].attendance.push({
        date: rec.attendance.date,
        status: rec.status,
      });
    }

    return {
      studentId,
      subjects: Object.values(grouped),
    };
  }

  async viewAllAttendance(subjectId: number) {
    const records = await this.attendanceRecordRepo.find({
      where: { subject: { id: subjectId } },
      relations: ['attendance', 'subject', 'student'],
      order: { attendance: { date: 'ASC' } },
    });

    // Group by student
    const grouped: Record<
      string,
      { studentId: string; studentName: string; attendance: any[] }
    > = {};

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

      grouped[studentId].attendance.push({
        date: rec.attendance.date,
        status: rec.status,
      });
    }

    return {
      subjectId,
      subjectName: records[0]?.subject?.name || 'Unknown',
      students: Object.values(grouped),
    };
  }
  // Get attendance record by id
  async getAttendanceRecordById(id: number) {
    const record = await this.attendanceRecordRepo.findOne({
      where: { id },
      relations: ['attendance', 'subject', 'student'],
    });
    if (!record) {
      throw new NotFoundException(`Attendance record with ID ${id} not found`);
    }
    return record;
  }
  // Update attendance record status
  async updateAttendance(id: number, status: 'present' | 'absent') {
    // Find the record by ID
    const record = await this.attendanceRecordRepo.findOne({ where: { id } });

    // Handle the case where the record is not found
    if (!record) {
      throw new NotFoundException(`Attendance record with ID ${id} not found`);
    }

    // Update the status
    record.status = status;

    // Save the updated record
    return this.attendanceRecordRepo.save(record);
  }

  // Delete attendance record
  async deleteAttendance(id: number) {
    const record = await this.attendanceRecordRepo.findOne({ where: { id } });

    if (!record) {
      throw new NotFoundException(`Attendance record with ID ${id} not found`);
    }

    // Proceed to delete the record
    await this.attendanceRecordRepo.remove(record);
    return { message: 'Attendance record deleted successfully.' };
  }
}
