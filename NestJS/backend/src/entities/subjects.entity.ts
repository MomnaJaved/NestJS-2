import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Attendance } from './attendance.entity';
import { StudentSubject } from '../middleTables/student_subjects.entity';
import { AttendanceRecord } from '../middleTables/attendance_record.entity';

@Entity()
export class Subject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 24, nullable: true })
  name: string;

  @OneToMany(() => Attendance, (attendance) => attendance.subject)
  attendances: Attendance[];

  @OneToMany(() => StudentSubject, (ss) => ss.subject)
  studentSubjects: StudentSubject[];

  @OneToMany(() => AttendanceRecord, (record) => record.subject)
  attendanceRecords: AttendanceRecord[];
}
