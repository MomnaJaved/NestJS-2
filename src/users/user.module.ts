import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RoleModule } from '../roles/role.module';
import { DepartmentModule } from '../departments/department.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // This makes the UserRepository available
    RoleModule,
    DepartmentModule,
    JwtModule.register({
      secret: 'mySuperSecretKey12345', // Add your JWT secret here, or use ConfigService for dynamic values
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService, TypeOrmModule], // Ensure the UserService is exported
})
export class UserModule {}
