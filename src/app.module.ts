import { Module, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { Role } from './roles/role.entity';
import { User } from './users/user.entity';
import { Department } from './departments/department.entity';
import { Attendance } from './attendance/attendance.entity';
import { Subject } from './subjects/subjects.entity';
import { AttendanceRecord } from './middleTables/attendance_record.entity';
import { StudentSubject } from './middleTables/student_subjects.entity';
import { StudentFaculty } from './middleTables/student_faculty.entity';

import { AdminSeed } from './seeding/admin.seed';

import { RoleModule } from './roles/role.module';
import { DepartmentModule } from './departments/department.module';
import { UserModule } from './users/user.module';
import { AuthModule } from './auth/auth.module';
import { SubjectsModule } from './subjects/subjects.module';
import { AttendanceModule } from './attendance/attendance.module';

import { LoggerMiddleware } from './middleware/logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +(process.env.DB_PORT as string),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [
        Role,
        User,
        Department,
        Attendance,
        Subject,
        AttendanceRecord,
        StudentSubject,
        StudentFaculty,
      ],
    }),
    RoleModule,
    DepartmentModule,
    UserModule,
    AuthModule,
    SubjectsModule,
    AttendanceModule,
  ],
  controllers: [],
  providers: [AdminSeed],
  exports: [AdminSeed],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('attendance');
  }
}
