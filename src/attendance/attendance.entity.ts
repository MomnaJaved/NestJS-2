import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Subject } from '../subjects/subjects.entity';
import { AttendanceRecord } from '../junctionTables/attendance_record.entity';

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  date: string;
  // Eager automatically loads the related Subject entity whenever an Attendance is fetched, no need to additionally define a relation.
  @ManyToOne(() => Subject, (subject) => subject.attendances, { eager: true })
  subject: Subject;

  @OneToMany(() => AttendanceRecord, (record) => record.attendance)
  records: AttendanceRecord[];
}
