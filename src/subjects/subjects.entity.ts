import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Attendance } from '../attendance/attendance.entity';
import { StudentSubject } from './student_subjects.entity';
import { AttendanceRecord } from '../attendance/attendance_record.entity';

@Entity()
export class Subject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Attendance, (attendance) => attendance.subject)
  attendances: Attendance[];

  @OneToMany(() => StudentSubject, (ss) => ss.subject)
  studentSubjects: StudentSubject[];

  @OneToMany(() => AttendanceRecord, (record) => record.subject)
  attendanceRecords: AttendanceRecord[];
}
