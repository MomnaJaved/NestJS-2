// student_subjects.entity.ts
import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';
import { Subject } from './subjects.entity';

@Entity()
export class StudentSubjects {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.studentSubjects)
  user: User;

  @ManyToOne(() => Subject, (subject) => subject.studentSubjects)
  subject: Subject;
}
