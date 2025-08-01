import {
  IsString,
  MaxLength,
  MinLength,
  IsEmail,
  IsUUID,
  IsOptional,
  IsDateString,
  IsInt,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ maxLength: 24, example: 'John' })
  @IsString()
  @MaxLength(24)
  firstName: string;

  @ApiProperty({ maxLength: 24, example: 'Doe' })
  @IsString()
  @MaxLength(24)
  lastName: string;

  @ApiProperty({ minLength: 6, maxLength: 24, example: 'securePassword123' })
  @IsString()
  @MinLength(6)
  @MaxLength(24)
  password: string;

  @ApiProperty({ example: '03123456789' })
  @IsString()
  contact: string;

  @ApiProperty({ maxLength: 56, example: 'john.doe@example.com' })
  @IsEmail()
  @MaxLength(56)
  email: string;

  @ApiPropertyOptional({ maxLength: 8, example: 'EMP001' })
  @IsString()
  @MaxLength(8)
  @IsOptional()
  code?: string;

  @ApiProperty({ maxLength: 8, example: 'Male' })
  @IsString()
  @MaxLength(8)
  gender: string;

  @ApiProperty({ example: '1990-01-01' })
  @IsDateString()
  DOB: string;

  @ApiProperty({ maxLength: 16, example: 'Single' })
  @IsString()
  @MaxLength(16)
  maritalStatus: string;

  @ApiProperty({ maxLength: 16, example: '1234567890123' })
  @IsString()
  @MaxLength(16)
  CNIC: string;

  @ApiPropertyOptional({ maxLength: 32, example: 'Manager' })
  @IsString()
  @MaxLength(32)
  @IsOptional()
  designation?: string;

  @ApiPropertyOptional({ example: '2020-01-01' })
  @IsDateString()
  @IsOptional()
  joiningDate?: string;

  @ApiPropertyOptional({ maxLength: 16, example: '6 months' })
  @IsString()
  @MaxLength(16)
  @IsOptional()
  probationPeriod?: string;

  @ApiPropertyOptional({ example: 'a3c6a1b9-3b98-4e2a-8e89-923c71e0f1bc' })
  @IsUUID()
  @IsOptional()
  lineManagerID?: string;

  @ApiPropertyOptional({ maxLength: 32, example: 'Admin Program' })
  @IsString()
  @MaxLength(32)
  @IsOptional()
  program?: string;

  @ApiPropertyOptional({ example: '2021-08-15' })
  @IsDateString()
  @IsOptional()
  admissionDate?: string;

  @ApiPropertyOptional({ maxLength: 16, example: '4 years' })
  @IsString()
  @MaxLength(16)
  @IsOptional()
  programDuration?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  @IsOptional()
  roleId?: number;

  @ApiPropertyOptional({ example: 'a3c6a1b9-3b98-4e2a-8e89-923c71e0f1bc' })
  @IsUUID()
  @IsOptional()
  departmentId?: string;
}
