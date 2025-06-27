import { IsString, MaxLength, MinLength } from 'class-validator';

export class CreateRoleDto {
  @IsString({ message: 'Name should be a string value.' })
  @MinLength(2, { message: 'Name should have a minimum of 5 characters.' })
  @MaxLength(100)
  name: string;

  @IsString({ message: 'Description should be a string value.' })
  @MinLength(10, {
    message: 'Description should have a minimum of 10 characters.',
  })
  @MaxLength(200)
  description: string;
}
