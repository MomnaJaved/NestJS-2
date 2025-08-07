import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { UserModule } from './user.module';
import { RoleService } from '../services/role.service';
import { DepartmentService } from '../services/department.service';
import { User } from '../decorators/user.decorator';
import { UserService } from '../services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleModule } from './role.module';
import { DepartmentModule } from './department.module';
import { EmailService } from '../services/emailService';
import { AuthEventsListener } from '../listeners/auth-events.listener';
//auth module
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UserModule,
    RoleModule,
    DepartmentModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const secret = configService.get<string>('JWT_SECRET_KEY');
        if (!secret) {
          throw new Error(
            'JWT_SECRET_KEY is not defined in environment variables!',
          );
        }
        return {
          secret,
          signOptions: { expiresIn: '1h' },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, EmailService, AuthEventsListener],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
