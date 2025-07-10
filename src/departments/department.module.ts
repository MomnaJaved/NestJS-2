import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './department.entity';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Department]),
    JwtModule.register({
      secret: 'mySuperSecretKey12345',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [DepartmentService],
  controllers: [DepartmentController],
  exports: [DepartmentService, TypeOrmModule],
})
export class DepartmentModule {}
