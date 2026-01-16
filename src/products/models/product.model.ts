import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { PartialUpdateProductDto } from '../dtos/partial-update-product.dto';
import { ProductEntity } from '../entities/product.entity';
import { UserEntity } from '../../users/entities/user.entity';
import { CategoryEntity } from 'src/categories/entities/CategoryEntities';
import { ProductResponseDto, UserSummaryDto, CategoryResponseDto } from '../dtos/product-response.dto';

export class Product {
  private id?: number;
  private name: string;
  private price: number;
  private description?: string;
  private stock: number;

  constructor(name: string, price: number, description?: string, stock?: number) {
    this.validateBusinessRules(name, price, description);
    this.name = name;
    this.price = price;
    this.description = description;
    this.stock = stock ?? 0;
  }

  // ==================== VALIDACIONES ====================
  private validateBusinessRules(name: string, price: number, description?: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('El nombre del producto es obligatorio');
    }
    if (price == null || price <= 0) {
      throw new Error('El precio debe ser mayor a 0');
    }
    if (description && description.length > 500) {
      throw new Error('La descripción no puede superar 500 caracteres');
    }
  }

  // ==================== FACTORY METHODS ====================
  static fromDto(dto: CreateProductDto): Product {
    return new Product(dto.name, dto.price, dto.description, dto.stock);
  }

  static fromEntity(entity: ProductEntity): Product {
    const product = new Product(entity.name, entity.price, entity.description, entity.stock ?? 0);
    product.id = entity.id;
    return product;
  }

  // ==================== CONVERSION METHODS ====================
  /**
   * Adaptado para N:N
   */
  toEntity(owner: UserEntity, categories: Set<CategoryEntity> | CategoryEntity[]): ProductEntity {
    const entity = new ProductEntity();
    if (this.id !== undefined) entity.id = this.id;
    entity.name = this.name;
    entity.price = this.price;
    entity.description = this.description ?? '';
    entity.stock = this.stock;
    entity.owner = owner;

    // Asignar categorías (Set o Array)
    entity.categories = Array.isArray(categories) ? categories : Array.from(categories);

    return entity;
  }

  // ==================== RESPONSE DTO ====================
  toResponseDto(owner?: UserEntity, categories?: CategoryEntity[]): ProductResponseDto {
    const response: ProductResponseDto = {
      id: this.id!,
      name: this.name,
      description: this.description,
      price: this.price,
      stock: this.stock,
      createdAt: new Date(), // puedes reemplazar con entity.createdAt real
      updatedAt: new Date(), // puedes reemplazar con entity.updatedAt real

      // Objetos anidados
      user: owner
        ? { id: owner.id, name: owner.name, email: owner.email }
        : undefined,
      categories: categories
        ? categories.map(cat => ({
            id: cat.id,
            name: cat.name,
            description: cat.description,
          }))
        : undefined,

      // Información plana
      userId: owner?.id,
      userName: owner?.name,
      userEmail: owner?.email,
      // ...campos planos de categoría eliminados para evitar error de tipo
    };

    return response;
  }

  // ==================== UPDATE METHODS ====================
  update(dto: UpdateProductDto): Product {
    this.validateBusinessRules(dto.name, dto.price, dto.description);
    this.name = dto.name;
    this.price = dto.price;
    this.description = dto.description;
    return this;
  }

  partialUpdate(dto: PartialUpdateProductDto): Product {
    const name = dto.name ?? this.name;
    const price = dto.price ?? this.price;
    const description = dto.description ?? this.description;
    const stock = (dto as any).stock ?? this.stock;

    this.validateBusinessRules(name, price, description);

    this.name = name;
    this.price = price;
    this.description = description;
    this.stock = stock;

    return this;
  }

  // ==================== STOCK METHODS ====================
  reduceStock(quantity: number): void {
    if (quantity > this.stock) throw new Error('Stock insuficiente');
    this.stock -= quantity;
  }

  addStock(quantity: number): void {
    this.stock += quantity;
  }

  // ==================== GETTERS & SETTERS ====================
  getId(): number | undefined { return this.id; }
  getName(): string { return this.name; }
  getPrice(): number { return this.price; }
  getDescription(): string | undefined { return this.description; }
  getStock(): number { return this.stock; }

  setId(id: number): void { this.id = id; }
  setName(name: string): void { this.name = name; }
  setPrice(price: number): void { this.price = price; }
  setDescription(description: string): void { this.description = description; }
  setStock(stock: number): void { this.stock = stock; }
}
