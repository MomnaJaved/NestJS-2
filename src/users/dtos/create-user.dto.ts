import {
  IsString,
  MaxLength,
  MinLength,
  IsEmail,
  IsBoolean,
  IsInt,
  IsDate,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MaxLength(24)
  firstName: string;

  @IsString()
  @MaxLength(24)
  lastName: string;

  @IsString()
  @MinLength(6, { message: 'Password should have at least 6 characters.' })
  @MaxLength(24)
  password: string;

  @IsString()
  contact: string;

  @IsEmail()
  @MaxLength(56)
  email: string;

  @IsBoolean()
  status: boolean;

  @IsString()
  @MaxLength(8)
  code: string;

  @IsString()
  gender: string;

  @IsDate()
  DOB: Date;

  @IsString()
  @MaxLength(16)
  maritalStatus: string;

  @IsString()
  @MaxLength(16)
  CNIC: string;

  @IsString()
  @MaxLength(32)
  @IsOptional()
  designation: string;

  @IsDate()
  @IsOptional()
  joiningDate?: Date; // Optional for students

  @IsString()
  @MaxLength(16)
  @IsOptional()
  probationPeriod?: string; // Optional for students

  @IsUUID()
  @IsOptional()
  lineManagerID?: string; // Optional for students

  @IsString()
  @MaxLength(32)
  @IsOptional()
  program?: string; // Optional for faculty

  @IsDate()
  @IsOptional()
  admissionDate?: Date; // Optional for faculty

  @IsString()
  @MaxLength(16)
  @IsOptional()
  programDuration?: string; // Optional for faculty

  @IsInt()
  roleId: number;

  @IsInt()
  departmentId: string;
}
