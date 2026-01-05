import { IsString, IsNumber, IsNotEmpty, IsOptional, Min, MinLength, MaxLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del producto es obligatorio' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(200)
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsNotEmpty({ message: 'El precio es obligatorio' })
  @Min(0, { message: 'El precio no puede ser negativo' })
  price: number;

  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'El stock no puede ser negativo' })
  stock?: number;
}