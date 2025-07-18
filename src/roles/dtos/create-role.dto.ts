import { IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoleDto {
  @ApiProperty({
    example: 'Admin',
    maxLength: 100,
    description: 'Name of the role',
  })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({
    example: 'Administrator with full access to all resources',
    maxLength: 200,
    description: 'Description of the role',
  })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  description?: string;
}
