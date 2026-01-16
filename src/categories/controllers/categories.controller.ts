import { Controller, Get, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../entities/CategoryEntities';
import { ProductEntity } from '../../products/entities/product.entity';

@Controller('categories')
export class CategoriesController {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
  ) {}

  // Endpoint para contar productos por categoría
  @Get(':id/products/count')
  async countProducts(@Param('id') id: number): Promise<{ categoryId: number; count: number }> {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) {
      return { categoryId: id, count: 0 };
    }
    const count = await this.productRepository
      .createQueryBuilder('product')
      .leftJoin('product.categories', 'category')
      .where('category.id = :id', { id })
      .getCount();
    return { categoryId: id, count };
  }
}
