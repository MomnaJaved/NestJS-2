import { IsUUID, IsInt, IsEnum } from 'class-validator';

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
}

export class MarkAttendanceDto {
  @IsUUID()
  studentId: string;

  @IsInt()
  subjectId: number;

  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;
}
