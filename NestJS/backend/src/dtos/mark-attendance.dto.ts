import { IsUUID, IsInt, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { AttendanceStatus } from '../common/attendance-status.enum';

export class MarkAttendanceDto {
  @ApiProperty({
    example: '123e4567-e89b-12d3-a456-426614174000',
    description: 'UUID of the student',
  })
  @IsUUID()
  studentId: string;

  @ApiProperty({
    example: 5,
    description: 'ID of the subject',
  })
  @IsInt()
  subjectId: number;

  @ApiProperty({
    enum: AttendanceStatus,
    example: AttendanceStatus.PRESENT,
    description: 'Status of attendance like "Present", "absent"',
  })
  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;
}
