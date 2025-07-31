import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { Subject } from '../entities/subjects.entity';
import { SubjectsService } from '../services/subjects.service';
import { SubjectsController } from '../controllers/subjects.controller';
import { User } from '../entities/user.entity';
import { StudentSubject } from '../middleTables/student_subjects.entity';
import { StudentFaculty } from '../middleTables/student_faculty.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subject, User, StudentSubject, StudentFaculty]),
    JwtModule.registerAsync({
      imports: [ConfigModule], // optional if ConfigModule is global, but good for clarity
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  providers: [SubjectsService],
  controllers: [SubjectsController],
  exports: [SubjectsService],
})
export class SubjectsModule {}
