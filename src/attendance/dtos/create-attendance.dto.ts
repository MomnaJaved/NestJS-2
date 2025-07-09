import { IsDateString, IsInt } from 'class-validator';

export class CreateAttendanceDto {
  @IsInt()
  subjectId: number;

  @IsDateString()
  date: string;
}
