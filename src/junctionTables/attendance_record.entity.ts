import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Attendance } from '../attendance/attendance.entity';
import { User } from '../users/user.entity';
import { Subject } from '../subjects/subjects.entity';

@Entity()
export class AttendanceRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Attendance, (attendance) => attendance.records, {
    onDelete: 'CASCADE',
  })
  attendance: Attendance;

  @ManyToOne(() => User, (user) => user.attendanceRecords, { eager: true })
  student: User;

  @ManyToOne(() => Subject, (subject) => subject.attendanceRecords)
  subject: Subject;

  @Column({ type: 'varchar', default: 'absent' })
  status: string;

  @Column({ type: 'date', default: () => 'CURRENT_DATE' })
  date: string;
}
