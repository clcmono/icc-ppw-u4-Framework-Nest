import { IsString, IsNumber, IsOptional, Min, MinLength, MaxLength, IsInt, ArrayUnique, ArrayNotEmpty } from 'class-validator';

export class PartialUpdateProductDto {
  @IsString()
  @IsOptional()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(200, { message: 'El nombre no puede superar 200 caracteres' })
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'El precio no puede ser negativo' })
  price?: number;

  @IsNumber()
  @IsOptional()
  @Min(0, { message: 'El stock no puede ser negativo' })
  stock?: number;

  // ================== RELACIONES ==================
  @IsOptional()
  @ArrayNotEmpty({ message: 'Debe especificar al menos una categoría' })
  @ArrayUnique({ message: 'No se permiten categorías repetidas' })
  @IsInt({ each: true, message: 'Cada ID de categoría debe ser un número entero' })
  categoryIds?: number[];
}
