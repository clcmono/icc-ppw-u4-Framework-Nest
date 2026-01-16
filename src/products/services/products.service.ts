import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductEntity } from '../entities/product.entity';
import { Product } from '../models/product.model';
import { CreateProductDto } from '../dtos/create-product.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';
import { PartialUpdateProductDto } from '../dtos/partial-update-product.dto';
import { ProductResponseDto } from '../dtos/product-response.dto';
import { NotFoundException } from 'src/exceptions/domain/not-found.exception';
import { ConflictException } from 'src/exceptions/domain/conflict.exception';
import { UserEntity } from '../../users/entities/user.entity';
import { CategoryEntity } from 'src/categories/entities/CategoryEntities';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  // ==================== GET ALL ====================
  async findAll(): Promise<ProductResponseDto[]> {
    const entities = await this.productRepository.find({
      relations: ['owner', 'categories'], // plural
    });
    return entities.map(entity => this.toResponseDto(entity));
  }

  // ==================== GET ONE ====================
  async findOne(id: number): Promise<ProductResponseDto> {
    const entity = await this.productRepository.findOne({
      where: { id },
      relations: ['owner', 'categories'],
    });
    if (!entity) throw new NotFoundException(`Producto no encontrado con ID: ${id}`);
    return this.toResponseDto(entity);
  }

  // ==================== CREATE ====================
  async create(dto: CreateProductDto): Promise<ProductResponseDto> {
    const existing = await this.productRepository.findOne({ where: { name: dto.name } });
    if (existing) throw new ConflictException(`Ya existe un producto con el nombre "${dto.name}"`);

    const owner = await this.userRepository.findOne({ where: { id: dto.userId } });
    if (!owner) throw new NotFoundException(`Usuario no encontrado con ID: ${dto.userId}`);

    const categories = await this.validateAndGetCategories(dto.categoryIds);

    const product = Product.fromDto(dto);
    const entity = product.toEntity(owner, categories);

    const saved = await this.productRepository.save(entity);
    return this.toResponseDto(saved);
  }

  // ==================== UPDATE (PUT) ====================
  async update(id: number, dto: UpdateProductDto): Promise<ProductResponseDto> {
    const entity = await this.productRepository.findOne({
      where: { id },
      relations: ['owner', 'categories'],
    });
    if (!entity) throw new NotFoundException(`Producto no encontrado con ID: ${id}`);

    if (dto.name && dto.name !== entity.name) {
      const existing = await this.productRepository.findOne({ where: { name: dto.name } });
      if (existing) throw new ConflictException(`Ya existe un producto con el nombre "${dto.name}"`);
    }

    const categories = await this.validateAndGetCategories(dto.categoryIds);

    const product = Product.fromEntity(entity).update(dto);
    const updatedEntity = product.toEntity(entity.owner, categories);
    updatedEntity.categories = categories;

    const saved = await this.productRepository.save(updatedEntity);
    return this.toResponseDto(saved);
  }

  // ==================== PARTIAL UPDATE (PATCH) ====================
  async partialUpdate(id: number, dto: PartialUpdateProductDto): Promise<ProductResponseDto> {
    const entity = await this.productRepository.findOne({
      where: { id },
      relations: ['owner', 'categories'],
    });
    if (!entity) throw new NotFoundException(`Producto no encontrado con ID: ${id}`);

    if (dto.name && dto.name !== entity.name) {
      const existing = await this.productRepository.findOne({ where: { name: dto.name } });
      if (existing) throw new ConflictException(`Ya existe un producto con el nombre "${dto.name}"`);
    }

    let categories = entity.categories;
    if (dto.categoryIds) {
      categories = await this.validateAndGetCategories(dto.categoryIds);
    }

    const product = Product.fromEntity(entity).partialUpdate(dto);
    const updatedEntity = product.toEntity(entity.owner, categories);

    const saved = await this.productRepository.save(updatedEntity);
    return this.toResponseDto(saved);
  }

  // ==================== DELETE ====================
  async delete(id: number): Promise<{ message: string }> {
    const entity = await this.productRepository.findOne({ where: { id } });
    if (!entity) throw new NotFoundException(`Producto no encontrado con ID: ${id}`);
    await this.productRepository.remove(entity);
    return { message: `Producto eliminado con ID: ${id}` };
  }

  // ==================== HELPERS ====================
  private async validateAndGetCategories(ids: number[]): Promise<CategoryEntity[]> {
    const categories: CategoryEntity[] = [];
    for (const id of ids) {
      const category = await this.categoryRepository.findOne({ where: { id } });
      if (!category) throw new NotFoundException(`Categoría no encontrada con ID: ${id}`);
      categories.push(category);
    }
    return categories;
  }

  private toResponseDto(entity: ProductEntity): ProductResponseDto {
    return {
      id: entity.id,
      name: entity.name,
      price: entity.price,
      description: entity.description,
      stock: entity.stock,
      user: {
        id: entity.owner.id,
        name: entity.owner.name,
        email: entity.owner.email,
      },
      categories: entity.categories.map(c => ({
        id: c.id,
        name: c.name,
        description: c.description,
      })),
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
