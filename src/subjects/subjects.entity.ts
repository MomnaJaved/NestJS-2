// subject.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { AttendanceRecord } from '../attendance/attendance_record.entity';
import { StudentSubjects } from './student_subjects.entity';

@Entity()
export class Subject {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(
    () => AttendanceRecord,
    (attendanceRecord) => attendanceRecord.subject,
  )
  attendanceRecords: AttendanceRecord[];

  @OneToMany(() => StudentSubjects, (ss) => ss.subject)
  studentSubjects: StudentSubjects[];
}
