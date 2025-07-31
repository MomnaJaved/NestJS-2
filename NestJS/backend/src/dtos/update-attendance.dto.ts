import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsString } from 'class-validator';
import { AttendanceStatus } from 'src/src/common/attendance-status.enum';

export class UpdateAttendanceDto {
  @ApiProperty({
    example: 'a3c6a1b9-3b98-4e2a-8e89-923c71e0f1bc',
    description: 'ID of the student',
  })
  @IsString()
  studentId: string;

  @ApiProperty({ example: 4, description: 'ID of the subject' })
  @IsInt()
  subjectId: number;

  @ApiProperty({ description: 'Attendance status ("present" or "absent")' })
  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;
}
