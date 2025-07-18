import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateDepartmentDto {
  @ApiProperty({
    example: 'Human Resources',
    maxLength: 100,
    description: 'Name of the department',
  })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    example: 'Handles employee relations and recruitment.',
    maxLength: 200,
    description: 'Description of the department',
  })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  description?: string;
}
