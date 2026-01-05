import { IsString, IsEmail, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class UserResponseDto {
    id: number;
    name: string;
    email: string;
    createdAt: string;
}