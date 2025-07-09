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
      secret: 'mySuperSecretKey12345', // Add your JWT secret here, or use ConfigService for dynamic values
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [DepartmentService],
  controllers: [DepartmentController],
  exports: [DepartmentService, TypeOrmModule],
})
export class DepartmentModule {}
