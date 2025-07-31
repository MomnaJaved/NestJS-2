import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Attendance } from '../entities/attendance.entity';
import { User } from '../entities/user.entity';
import { Subject } from '../entities/subjects.entity';
import { AttendanceStatus } from '../common/attendance-status.enum';

@Entity()
export class AttendanceRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Attendance, (attendance) => attendance.records)
  attendance: Attendance;

  @ManyToOne(() => User, (user) => user.attendanceRecords)
  student: User;

  @ManyToOne(() => Subject, (subject) => subject.attendanceRecords)
  subject: Subject;

  @Column({
    type: 'enum',
    enum: AttendanceStatus,
    default: AttendanceStatus.ABSENT,
  })
  status: AttendanceStatus;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  date: string;
}
