import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { CategoryEntity } from '../entities/CategoryEntities';

@Injectable()
export class CategoryRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly repo: Repository<CategoryEntity>,
  ) {}

  /**
   * Verifica si ya existe una categoría con ese nombre
   */
  async existsByName(name: string): Promise<boolean> {
    const count = await this.repo.count({ where: { name } });
    return count > 0;
  }

  /**
   * Busca categoría por nombre (case insensitive)
   */
  async findByNameIgnoreCase(name: string): Promise<CategoryEntity | null> {
    return this.repo.findOne({
      where: { name: ILike(name) },
    });
  }
}
