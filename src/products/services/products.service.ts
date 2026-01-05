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

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  /**
   * Obtener todos los productos (enfoque funcional)
   */
  async findAll(): Promise<ProductResponseDto[]> {
    const entities = await this.productRepository.find();

    return entities
      .map(Product.fromEntity)
      .map(product => product.toResponseDto());
  }

  /**
   * Obtener un producto por ID
   */
  async findOne(id: number): Promise<ProductResponseDto> {
    const entity = await this.productRepository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(`Producto no encontrado con ID: ${id}`);
    }

    return Product.fromEntity(entity).toResponseDto();
  }

  /**
   * Crear producto
   */
  async create(dto: CreateProductDto): Promise<ProductResponseDto> {
    // Validar que no exista un producto con el mismo nombre
    const existingProduct = await this.productRepository.findOne({
      where: { name: dto.name },
    });

    if (existingProduct) {
      throw new ConflictException(
        `Ya existe un producto con el nombre "${dto.name}"`,
      );
    }

    const product = Product.fromDto(dto);
    const entity = product.toEntity();
    const saved = await this.productRepository.save(entity);

    return Product.fromEntity(saved).toResponseDto();
  }

  /**
   * Actualizar producto completo (PUT)
   */
  async update(id: number, dto: UpdateProductDto): Promise<ProductResponseDto> {
    const entity = await this.productRepository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(`Producto no encontrado con ID: ${id}`);
    }

    // Si cambió el nombre, validar que no exista otro con ese nombre
    if (dto.name && dto.name !== entity.name) {
      const existingProduct = await this.productRepository.findOne({
        where: { name: dto.name },
      });

      if (existingProduct) {
        throw new ConflictException(
          `Ya existe un producto con el nombre "${dto.name}"`,
        );
      }
    }

    const updated = Product.fromEntity(entity)
      .update(dto)
      .toEntity();

    const saved = await this.productRepository.save(updated);

    return Product.fromEntity(saved).toResponseDto();
  }

  /**
   * Actualizar parcialmente (PATCH)
   */
  async partialUpdate(id: number, dto: PartialUpdateProductDto): Promise<ProductResponseDto> {
    const entity = await this.productRepository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(`Producto no encontrado con ID: ${id}`);
    }

    // Si cambió el nombre, validar que no exista otro con ese nombre
    if (dto.name && dto.name !== entity.name) {
      const existingProduct = await this.productRepository.findOne({
        where: { name: dto.name },
      });

      if (existingProduct) {
        throw new ConflictException(
          `Ya existe un producto con el nombre "${dto.name}"`,
        );
      }
    }

    const updated = Product.fromEntity(entity)
      .partialUpdate(dto)
      .toEntity();

    const saved = await this.productRepository.save(updated);

    return Product.fromEntity(saved).toResponseDto();
  }

  /**
   * Eliminar producto
   */
  async delete(id: number): Promise<{ message: string }> {
    const entity = await this.productRepository.findOne({ where: { id } });

    if (!entity) {
      throw new NotFoundException(`Producto no encontrado con ID: ${id}`);
    }

    await this.productRepository.remove(entity);

    return { message: `Producto eliminado con ID: ${id}` };
  }
}