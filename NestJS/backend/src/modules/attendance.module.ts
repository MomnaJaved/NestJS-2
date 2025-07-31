import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from '../entities/attendance.entity';
import { AttendanceController } from '../controllers/attendance.controller';
import { AttendanceService } from '../services/attendance.service';
import { User } from '../entities/user.entity';
import { Department } from '../entities/department.entity';
import { Subject } from '../entities/subjects.entity';
import { AttendanceRecord } from '../middleTables/attendance_record.entity';
import { AuthModule } from './auth.module';
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
