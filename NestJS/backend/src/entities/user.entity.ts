import { AttendanceRecord } from '../middleTables/attendance_record.entity';
import { Department } from './department.entity';
import { Role } from './role.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { StudentSubject } from '../middleTables/student_subjects.entity';
import { StudentFaculty } from '../middleTables/student_faculty.entity';

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

  @Column({ type: 'boolean', default: false })
  status: boolean;

  @Column({ type: 'varchar', length: 8, nullable: true })
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
  role: Role;

  @ManyToOne(() => Department)
  @JoinColumn({ name: 'departmentId', referencedColumnName: 'id' })
  department: Department;

  @Column({ type: 'varchar', length: 32, nullable: true })
  program: string;

  @Column({ type: 'date', nullable: true })
  admissionDate: Date;

  @Column({ type: 'varchar', length: 16, nullable: true })
  programDuration: string;

  @OneToMany(() => StudentSubject, (ss) => ss.student)
  studentSubjects: StudentSubject[];

  @OneToMany(() => AttendanceRecord, (record) => record.student)
  attendanceRecords: AttendanceRecord[];

  @OneToMany(() => StudentFaculty, (sf) => sf.student)
  studentFacultyLinks: StudentFaculty[];

  @OneToMany(() => StudentFaculty, (sf) => sf.faculty)
  facultyStudentLinks: StudentFaculty[];
}
