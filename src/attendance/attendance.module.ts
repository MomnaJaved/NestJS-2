import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './attendance.entity';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { User } from '../users/user.entity';
import { Department } from '../departments/department.entity';
import { Subject } from '../subjects/subjects.entity';
import { AttendanceRecord } from '../middleTables/attendance_record.entity';
import { AuthModule } from '../auth/auth.module';
import { StudentSubject } from '../middleTables/student_subjects.entity';
import { StudentFaculty } from '../middleTables/student_faculty.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forFeature([
      Attendance,
      User,
      Department,
      Subject,
      AttendanceRecord,
      StudentSubject,
      StudentFaculty,
    ]),
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService],
  exports: [TypeOrmModule],
})
export class AttendanceModule {}
