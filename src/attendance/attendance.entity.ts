import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Subject } from '../subjects/subjects.entity';
import { AttendanceRecord } from './attendance_record.entity';

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  date: string;

  @ManyToOne(() => Subject, (subject) => subject.attendances, { eager: true })
  subject: Subject;

  @OneToMany(() => AttendanceRecord, (record) => record.attendance)
  records: AttendanceRecord[];
}
