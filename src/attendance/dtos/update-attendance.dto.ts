import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateAttendanceDto {
  @ApiProperty({ description: 'ID of the student' })
  @IsString()
  studentId: string;

  @ApiProperty({ description: 'ID of the subject' })
  @IsString()
  subjectId: string;

  @ApiProperty({
    description: 'Attendance status (e.g., true for present, false for absent)',
  })
  @ApiProperty({ description: 'Attendance status ("present" or "absent")' })
  @IsString()
  status: 'present' | 'absent';
}
