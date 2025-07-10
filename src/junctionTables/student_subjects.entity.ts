import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Subject } from '../subjects/subjects.entity';

@Entity('student_subjects')
export class StudentSubject {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.studentSubjects, { eager: false })
  @JoinColumn({ name: 'student_id' })
  student: User;

  @ManyToOne(() => Subject, (subject) => subject.studentSubjects, {
    eager: false,
  })
  @JoinColumn({ name: 'subject_id' })
  subject: Subject;
}
