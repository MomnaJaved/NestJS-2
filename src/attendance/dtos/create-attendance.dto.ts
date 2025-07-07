import { IsArray, IsBoolean, IsInt, IsString } from 'class-validator';

export class CreateAttendanceDto {
  @IsInt()
  subjectId: number; // ID of the subject for which attendance is being marked

  @IsArray()
  @IsString({ each: true })
  studentIds: string[]; // Array of student IDs whose attendance is being marked

  @IsBoolean()
  status: boolean; // Status of attendance (true for present, false for absent)
}
