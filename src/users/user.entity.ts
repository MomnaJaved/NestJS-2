import { Role } from 'src/roles/role.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid') // Auto-generated UUID for User ID
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

  @Column({ type: 'varchar', length: 32 })
  designation: string;

  @Column({ type: 'date' })
  joiningDate: Date;

  @Column({ type: 'varchar', length: 16 })
  probationPeriod: string;

  @Column({ type: 'uuid' })
  lineManagerID: string;

  @Column({ type: 'uuid' })
  finalAuthorityID: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @Column({ type: 'uuid', nullable: true })
  createdBy: string;

  @Column({ type: 'int' })
  roleId: number;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'roleId', referencedColumnName: 'id' })
  role: Role; // This is just for TypeORM to know about the relation, but `roleId` is now used directly
}
