import { IsUUID, IsBoolean, IsDate } from 'class-validator';

export class CreateAttendanceDto {
  @IsUUID() // Make sure userId and departmentId are UUIDs
  userId: string;

  @IsUUID()
  departmentId: string;

  @IsDate()
  date: Date; // The date of the attendance

  @IsBoolean()
  status: boolean; // Present or Absent
}
