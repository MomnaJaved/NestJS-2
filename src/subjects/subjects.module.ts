import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from './subjects.entity';
import { SubjectsService } from './subjects.service';
import { SubjectsController } from './subjects.controller';
import { AttendanceRecord } from '../attendance/attendance_record.entity';
import { StudentSubjects } from './student_subjects.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subject, AttendanceRecord, StudentSubjects]),
  ],
  controllers: [SubjectsController],
  providers: [SubjectsService],
  exports: [TypeOrmModule],
})
export class SubjectsModule {}
