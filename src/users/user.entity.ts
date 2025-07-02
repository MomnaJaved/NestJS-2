import { Attendance } from '../attendance/attendance.entity';
import { Department } from '../departments/department.entity';
import { Role } from 'src/roles/role.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 24 })
  firstName: string;

  @Column({ type: 'varchar', length: 24 })
  lastName: string;

  @Column({ type: 'varchar', length: 24 })
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
  joiningDate: Date; // Optional for students

  @Column({ type: 'varchar', length: 16, nullable: true })
  probationPeriod: string; // Optional for students

  @Column({ type: 'uuid', nullable: true })
  lineManagerID: string; // Optional for students

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'uuid', nullable: true })
  createdBy: string;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'roleId', referencedColumnName: 'id' })
  role: Role;

  @ManyToOne(() => Department)
  @JoinColumn({ name: 'departmentId', referencedColumnName: 'id' })
  department: Department;

  @Column({ type: 'varchar', length: 32, nullable: true })
  program: string; // Optional for faculty

  @Column({ type: 'date', nullable: true })
  admissionDate: Date; // Optional for faculty

  @Column({ type: 'varchar', length: 16, nullable: true })
  programDuration: string; // Optional for faculty

  @OneToMany(() => Attendance, (attendance) => attendance.user) // One-to-many relationship with Attendance
  attendances: Attendance[];
}
