import { IsString, MaxLength, IsOptional } from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  @MaxLength(100, {
    message: 'Subject name is too long. Maximum length is 100 characters.',
  })
  name: string;

  @IsString()
  @MaxLength(500, {
    message: 'Description is too long. Maximum length is 500 characters.',
  })
  @IsOptional() // This field is optional
  description?: string;
}
