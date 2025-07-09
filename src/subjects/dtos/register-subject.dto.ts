import { IsUUID, IsInt } from 'class-validator';

export class RegisterSubjectDto {
  @IsUUID()
  studentId: string;

  @IsInt()
  subjectId: number;
}
