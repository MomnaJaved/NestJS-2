import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Department } from '../departments/department.entity';

@Entity()
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.attendances) // Link to User entity
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'boolean' })
  status: boolean; // true for present, false for absent

  @ManyToOne(() => Department)
  @JoinColumn({ name: 'departmentId' })
  department: Department; // Link to Department entity
}
