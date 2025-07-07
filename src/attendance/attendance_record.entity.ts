import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Attendance } from './attendance.entity'; // Import the Attendance entity
import { Subject } from '../subjects/subjects.entity';

@Entity()
export class AttendanceRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  date: Date; // Date of the attendance record

  @Column({ type: 'boolean' })
  status: boolean; // true for present, false for absent

  @OneToMany(() => Attendance, (attendance) => attendance.attendanceRecord)
  attendances: Attendance[]; // Link back to multiple attendance entries

  @ManyToOne(() => Subject, (subject) => subject.attendanceRecords)
  subject: Subject;
}
