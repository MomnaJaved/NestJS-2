import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subject } from './subjects.entity';
import { SubjectsService } from './subjects.service';
import { SubjectsController } from './subjects.controller';
import { User } from '../users/user.entity';
import { StudentSubject } from './student_subjects.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subject, User, StudentSubject]),
    JwtModule.register({
      secret: 'mySuperSecretKey12345', // Add your JWT secret here, or use ConfigService for dynamic values
      signOptions: { expiresIn: '1h' },
    }),
  ],
  providers: [SubjectsService],
  controllers: [SubjectsController],
  exports: [SubjectsService],
})
export class SubjectsModule {}
