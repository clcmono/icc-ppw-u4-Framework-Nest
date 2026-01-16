import { IsString, IsNumber, IsNotEmpty, IsOptional, Min, MinLength, MaxLength, IsInt, ArrayNotEmpty, ArrayUnique } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del producto es obligatorio' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(200, { message: 'El nombre no puede superar 200 caracteres' })
  name: string;

  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'La descripción no puede superar 500 caracteres' })
  description?: string;

  @IsNumber({}, { message: 'El precio debe ser un número' })
  @IsNotEmpty({ message: 'El precio es obligatorio' })
  @Min(0.01, { message: 'El precio debe ser mayor a 0' })
  price: number;

  @IsNumber({}, { message: 'El stock debe ser un número' })
  @IsOptional()
  @Min(0, { message: 'El stock no puede ser negativo' })
  stock?: number;

  // ============== RELACIONES ==============
  @IsNotEmpty({ message: 'El ID del usuario es obligatorio' })
  @IsInt({ message: 'El ID del usuario debe ser un número entero' })
  userId: number;

  @ArrayNotEmpty({ message: 'Debe especificar al menos una categoría' })
  @ArrayUnique({ message: 'No se permiten categorías repetidas' })
  @IsInt({ each: true, message: 'Cada ID de categoría debe ser un número entero' })
  categoryIds: number[];
}
