import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/user.entity';

@Entity('student_faculty')
export class StudentFaculty {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.studentFacultyLinks)
  student: User;

  @ManyToOne(() => User, (user) => user.facultyStudentLinks)
  faculty: User;
}
