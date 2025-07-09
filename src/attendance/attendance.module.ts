import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attendance } from './attendance.entity';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { User } from '../users/user.entity';
import { Department } from '../departments/department.entity';
import { Subject } from '../subjects/subjects.entity';
import { AttendanceRecord } from './attendance_record.entity';
import { JwtGuard } from '../guards/jwt.guard';
import { AuthModule } from '../auth/auth.module';
import { StudentSubject } from '../subjects/student_subjects.entity';

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
    ]),
  ],
  controllers: [AttendanceController],
  providers: [AttendanceService, JwtGuard],
  exports: [TypeOrmModule],
})
export class AttendanceModule {}
