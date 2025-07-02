import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './department.entity';
import { DepartmentService } from './department.service';
import { DepartmentController } from './department.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Department])], // Make Department entity available for injection
  providers: [DepartmentService],
  controllers: [DepartmentController],
  exports: [DepartmentService, TypeOrmModule], // Export the service and TypeOrmModule for other modules
})
export class DepartmentModule {}
