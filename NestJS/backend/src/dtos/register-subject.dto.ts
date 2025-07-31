import { IsUUID, IsInt } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterSubjectDto {
  @ApiProperty({
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    description: 'UUID of the student',
  })
  @IsUUID()
  studentId: string;

  @ApiProperty({ example: 1, description: 'ID of the subject' })
  @IsInt()
  subjectId: number;
}
