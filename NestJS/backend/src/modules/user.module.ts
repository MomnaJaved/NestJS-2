import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { User } from '../entities/user.entity';
import { UserService } from '../services/user.service';
import { UserController } from '../controllers/user.controller';
import { RoleModule } from '../modules/role.module';
import { DepartmentModule } from './department.module';
import { EmailService } from '../services/emailService';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    RoleModule,
    DepartmentModule,
    JwtModule.registerAsync({
      imports: [ConfigModule], // ConfigModule is global, but still recommended here for clarity
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  providers: [UserService, EmailService],
  controllers: [UserController],
  exports: [UserService, TypeOrmModule],
})
export class UserModule {}
