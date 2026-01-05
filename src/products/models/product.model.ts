import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { PartialUpdateProductDto } from '../dtos/partial-update-product.dto';
import { ProductResponseDto } from '../dtos/product-response.dto';

export class Product {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public price: number,
    public stock: number,
    public createdAt: Date,
  ) {
    this.validateBusinessRules();
  }

  private validateBusinessRules(): void {
    if (!this.name || this.name.trim().length < 3) {
      throw new Error('El nombre del producto debe tener al menos 3 caracteres');
    }

    if (this.price < 0) {
      throw new Error('El precio no puede ser negativo');
    }

    if (this.stock < 0) {
      throw new Error('El stock no puede ser negativo');
    }
  }

  // ==================== FACTORY METHODS ====================

 
  static fromDto(dto: CreateProductDto): Product {
    return new Product(
      0, // El ID se asigna en BD
      dto.name,
      dto.description || '',
      dto.price,
      dto.stock || 0,
      new Date(),
    );
  }

 
  static fromEntity(entity: any): Product {
    return new Product(
      entity.id,
      entity.name,
      entity.description,
      entity.price,
      entity.stock,
      entity.createdAt,
    );
  }

  toEntity(): any {
    const entity = {};
    if (this.id > 0) {
      entity['id'] = this.id;
    }
    entity['name'] = this.name;
    entity['description'] = this.description;
    entity['price'] = this.price;
    entity['stock'] = this.stock;
    return entity;
  }
  toResponseDto(): ProductResponseDto {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      price: this.price,
      stock: this.stock,
      createdAt: this.createdAt.toISOString(),
    };
  }
  update(dto: UpdateProductDto): Product {
    if (dto.name !== undefined) this.name = dto.name;
    if (dto.description !== undefined) this.description = dto.description;
    if (dto.price !== undefined) this.price = dto.price;
    if (dto.stock !== undefined) this.stock = dto.stock;
    this.validateBusinessRules();
    return this;
  }

  partialUpdate(dto: PartialUpdateProductDto): Product {
    if (dto.name !== undefined) this.name = dto.name;
    if (dto.description !== undefined) this.description = dto.description;
    if (dto.price !== undefined) this.price = dto.price;
    if (dto.stock !== undefined) this.stock = dto.stock;
    this.validateBusinessRules();
    return this;
  }
  reduceStock(quantity: number): void {
    if (quantity > this.stock) {
      throw new Error('Stock insuficiente');
    }
    this.stock -= quantity;
  }

  addStock(quantity: number): void {
    this.stock += quantity;
  }
}
