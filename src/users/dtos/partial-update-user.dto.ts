import { IsOptional, IsEmail, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class PartialUptadeUserDto {
@IsOptional()
  @MinLength(3)
  @MaxLength(150)
  name?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  email?: string;

  @IsOptional()
  @MinLength(8)
  password?: string;
}