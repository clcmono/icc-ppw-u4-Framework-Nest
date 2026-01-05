import { IsString, IsEmail, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class UpdateUserDto {
      @IsNotEmpty()
  @MinLength(3)
  @MaxLength(150)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(150)
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;
}