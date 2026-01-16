import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { ProductEntity } from '../entities/product.entity';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly repo: Repository<ProductEntity>,
  ) {}

  
  findByOwnerId(userId: number): Promise<ProductEntity[]> {
    return this.repo.find({
      where: { owner: { id: userId } },
    });
  }

  
  findByCategoryId(categoryId: number): Promise<ProductEntity[]> {
    return this.repo
      .createQueryBuilder('product')
      .leftJoin('product.categories', 'category')
      .where('category.id = :categoryId', { categoryId })
      .getMany();
  }



  findByOwnerName(ownerName: string): Promise<ProductEntity[]> {
    return this.repo.find({
      where: { owner: { name: ownerName } },
      relations: ['owner'], 
    });
  }

  
  findByCategoryName(categoryName: string): Promise<ProductEntity[]> {
    return this.repo
      .createQueryBuilder('product')
      .leftJoin('product.categories', 'category')
      .where('category.name = :categoryName', { categoryName })
      .getMany();
  }

  findByCategoryIdAndPriceGreaterThan(
    categoryId: number,
    price: number,
  ): Promise<ProductEntity[]> {
    return this.repo
      .createQueryBuilder('product')
      .leftJoin('product.categories', 'category')
      .where('category.id = :categoryId', { categoryId })
      .andWhere('product.price > :price', { price })
      .getMany();
  }
}
