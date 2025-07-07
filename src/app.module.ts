import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './roles/role.entity';
import { User } from './users/user.entity';
import { Department } from './departments/department.entity';
import { Attendance } from './attendance/attendance.entity';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AdminSeed } from './seeding/admin.seed';
import { RoleModule } from './roles/role.module';
import { DepartmentModule } from './departments/department.module';
import { UserModule } from './users/user.module';
import { AttendanceModule } from './attendance/attendance.module';
import { AuthModule } from './auth/auth.module';
import { SubjectsModule } from './subjects/subjects.module';
import { Subject } from './subjects/subjects.entity';
import { AttendanceRecord } from './attendance/attendance_record.entity';
import { StudentSubjects } from './subjects/student_subjects.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: +(process.env.DB_PORT || 5433),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'Momna292003.',
      database: process.env.DB_DATABASE || 'Attendance',
      entities: [
        Role,
        User,
        Department,
        Attendance,
        Subject,
        AttendanceRecord,
        StudentSubjects,
      ],
      synchronize: true,
    }),
    RoleModule,
    DepartmentModule,
    UserModule,
    AuthModule,
    SubjectsModule,
    AttendanceModule,
  ],
  controllers: [AppController],
  providers: [AppService, AdminSeed],
  exports: [AdminSeed],
})
export class AppModule {}
