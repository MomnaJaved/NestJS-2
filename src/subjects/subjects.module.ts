import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from './subjects.entity';
import { SubjectsService } from './subjects.service';
import { SubjectsController } from './subjects.controller';
import { User } from '../users/user.entity';
import { StudentSubject } from '../junctionTables/student_subjects.entity';
import { JwtModule } from '@nestjs/jwt';
import { StudentFaculty } from '../junctionTables/student_faculty.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subject, User, StudentSubject, StudentFaculty]),
    JwtModule.register({
      secret: 'mySuperSecretKey12345',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [SubjectsService],
  controllers: [SubjectsController],
  exports: [SubjectsService],
})
export class SubjectsModule {}
