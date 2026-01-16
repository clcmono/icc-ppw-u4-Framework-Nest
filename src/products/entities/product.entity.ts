
import {
  Entity,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { CategoryEntity } from 'src/categories/entities/CategoryEntities';

@Entity('products')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  name: string;

  @Column('decimal')
  price: number;

  @Column({ length: 500, nullable: true })
  description: string;

  @Column({ default: 0 })
  stock: number;

  @ManyToOne(() => UserEntity, { eager: true })
  owner: UserEntity;

  @ManyToMany(() => CategoryEntity, category => category.products, { eager: true })
  @JoinTable({ name: 'product_categories' })
  categories: CategoryEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // ==================== MÉTODOS DE CONVENIENCIA ====================
  addCategory(category: CategoryEntity) {
    if (!this.categories) this.categories = [];
    this.categories.push(category);
  }

  removeCategory(category: CategoryEntity) {
    if (!this.categories) return;
    this.categories = this.categories.filter(c => c.id !== category.id);
  }

  clearCategories() {
    this.categories = [];
  }
}
