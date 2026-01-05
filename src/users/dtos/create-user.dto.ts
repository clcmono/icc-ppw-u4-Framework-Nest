import { IsString, IsEmail, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MinLength(3)
  @MaxLength(150)
  name: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Debe ingresar un email válido' })
  @MaxLength(150)
  email: string;

  @IsNotEmpty()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  password: string;
}