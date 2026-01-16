import { IsString, IsNotEmpty, MinLength, MaxLength, IsNumber, IsPositive, IsInt, ArrayNotEmpty, ArrayUnique, IsOptional } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  @MaxLength(150, { message: 'El nombre no puede superar 150 caracteres' })
  name: string;

  @IsNumber({}, { message: 'El precio debe ser un número' })
  @IsNotEmpty({ message: 'El precio es obligatorio' })
  @IsPositive({ message: 'El precio debe ser mayor a 0' })
  price: number;

  @IsString()
  @IsOptional()
  @MaxLength(500, { message: 'La descripción no puede superar 500 caracteres' })
  description?: string;

  // ============== RELACIONES =================
  @ArrayNotEmpty({ message: 'Debe especificar al menos una categoría' })
  @ArrayUnique({ message: 'No se permiten categorías repetidas' })
  @IsInt({ each: true, message: 'Cada ID de categoría debe ser un número entero' })
  categoryIds: number[];
}
