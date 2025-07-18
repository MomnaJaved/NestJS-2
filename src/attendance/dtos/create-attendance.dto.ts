import { IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAttendanceDto {
  @ApiProperty({
    example: 10,
    description: 'ID of the subject',
  })
  @IsInt()
  subjectId: number;
}
