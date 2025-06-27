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

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'Role_id', referencedColumnName: 'id' })
  role: Role;
}
