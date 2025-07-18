import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsString } from 'class-validator';
import { AttendanceStatus } from 'src/src/common/attendance-status.enum';

export class UpdateAttendanceDto {
  @ApiProperty({ description: 'ID of the student' })
  @IsString()
  studentId: string;

  @ApiProperty({ example: 4, description: 'ID of the subject' })
  @IsInt()
  subjectId: number;

  @ApiProperty({ description: 'Attendance status ("present" or "absent")' })
  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;
}
