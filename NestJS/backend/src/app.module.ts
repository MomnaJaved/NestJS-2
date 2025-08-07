import { Module, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

import { Role } from './entities/role.entity';
import { User } from './entities/user.entity';
import { Department } from './entities/department.entity';
import { Attendance } from './entities/attendance.entity';
import { Subject } from './entities/subjects.entity';
import { AttendanceRecord } from './middleTables/attendance_record.entity';
import { StudentSubject } from './middleTables/student_subjects.entity';
import { StudentFaculty } from './middleTables/student_faculty.entity';

import { AdminSeed } from './seeding/admin.seed';

import { RoleModule } from './modules/role.module';
import { DepartmentModule } from './modules/department.module';
import { UserModule } from './modules/user.module';
import { AuthModule } from './modules/auth.module';
import { SubjectsModule } from './modules/subjects.module';
import { AttendanceModule } from './modules/attendance.module';

import { LoggerMiddleware } from './middleware/logger.middleware';
import { UserService } from './services/user.service';
import { AuthService } from './services/auth.service';
import { EmailService } from './services/emailService';
import { EventEmitterModule } from '@nestjs/event-emitter';
//app module
@Module({
  imports: [
    EventEmitterModule.forRoot(),
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
  providers: [AdminSeed, UserService, AuthService, EmailService],
  exports: [AdminSeed],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('attendance');
  }
}
