import { Attendance } from '../attendance/attendance.entity';
import { AttendanceRecord } from '../attendance/attendance_record.entity';
import { Department } from '../departments/department.entity';
import { Role } from '../roles/role.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { StudentSubjects } from '../subjects/student_subjects.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 24 })
  firstName: string;

  @Column({ type: 'varchar', length: 24 })
  lastName: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar' })
  contact: string;

  @Column({ unique: true, type: 'varchar', length: 56 })
  email: string;

  @Column({ type: 'boolean' })
  status: boolean;

  @Column({ type: 'varchar', length: 8 })
  code: string;

  @Column({ type: 'varchar', length: 8 })
  gender: string;

  @Column({ type: 'date' })
  DOB: Date;

  @Column({ type: 'varchar', length: 16 })
  maritalStatus: string;

  @Column({ type: 'varchar', length: 16 })
  CNIC: string;

  @Column({ type: 'varchar', length: 32, nullable: true })
  designation: string;

  @Column({ type: 'date', nullable: true })
  joiningDate: Date;

  @Column({ type: 'varchar', length: 16, nullable: true })
  probationPeriod: string;

  @Column({ type: 'uuid', nullable: true })
  lineManagerID: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'uuid', nullable: true })
  createdBy: string;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'roleId', referencedColumnName: 'id' })
  role: Role; // Corrected to refer directly to Role entity

  @ManyToOne(() => Department)
  @JoinColumn({ name: 'departmentId', referencedColumnName: 'id' })
  department: Department;

  @Column({ type: 'varchar', length: 32, nullable: true })
  program: string;

  @Column({ type: 'date', nullable: true })
  admissionDate: Date;

  @Column({ type: 'varchar', length: 16, nullable: true })
  programDuration: string;

  @OneToMany(() => Attendance, (attendances) => attendances.user)
  attendanceRecords: AttendanceRecord[];

  @OneToMany(() => StudentSubjects, (ss) => ss.user)
  studentSubjects: StudentSubjects[];
}
