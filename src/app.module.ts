/* eslint-disable @typescript-eslint/no-floating-promises */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleModule } from './roles/role.module';
import { Role } from './roles/role.entity';
import { User } from './users/user.entity';
import { UserModule } from './users/user.module';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DepartmentModule } from './departments/department.module';
import { AttendanceModule } from './attendance/attendance.module';
import { Department } from './departments/department.entity';
import { Attendance } from './attendance/attendance.entity';
import { AdminSeed } from './seeding/admin.seed';
@Module({
  imports: [
    RoleModule,
    UserModule,
    DepartmentModule,
    AttendanceModule,
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: +(process.env.DB_PORT || 5433),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'Momna292003.',
      database: process.env.DB_DATABASE || 'Attendance',
      entities: [Role, User, Department, Attendance],
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService, AdminSeed],
})
export class AppModule {
  constructor(private readonly adminSeeder: AdminSeed) {
    this.adminSeeder.run(); // Run the seeder during application startup
  }
}
