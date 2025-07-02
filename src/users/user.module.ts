import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RoleModule } from 'src/roles/role.module'; // Import RoleModule
import { DepartmentModule } from 'src/departments/department.module'; // Import DepartmentModule

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // Import User entity
    RoleModule, // Import RoleModule to have access to RoleRepository
    DepartmentModule, // Import DepartmentModule to have access to DepartmentRepository
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
