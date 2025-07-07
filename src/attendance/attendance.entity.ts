import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Department } from '../departments/department.entity';
import { AttendanceRecord } from '../attendance/attendance_record.entity'; // Import AttendanceRecord

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.attendanceRecords)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(
    () => AttendanceRecord,
    (attendanceRecord) => attendanceRecord.attendances,
  )
  @JoinColumn({ name: 'attendanceRecordId' })
  attendanceRecord: AttendanceRecord; // Link to AttendanceRecord entity

  @ManyToOne(() => Department)
  @JoinColumn({ name: 'departmentId' })
  department: Department;

  @Column({ type: 'varchar', length: 32 })
  subjectName: string; // Add subject or any additional fields if needed
}
