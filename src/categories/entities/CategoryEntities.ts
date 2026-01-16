import { Entity, Column, ManyToMany } from 'typeorm';
import { BaseEntity } from '../../core/entities/base.entity';
import { ProductEntity } from '../../products/entities/product.entity';

@Entity('categories')
export class CategoryEntity extends BaseEntity {

  @Column({ type: 'varchar', length: 120, unique: true, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string;

  // ==================== RELACIÓN BIDIRECCIONAL N:N ====================
  @ManyToMany(() => ProductEntity, product => product.categories, { lazy: true })
  products: ProductEntity[] = []; // ✅ Inicializar array evita errores de undefined

  // ==================== MÉTODOS DE CONVENIENCIA ====================
  addProduct(product: ProductEntity) {
    if (!this.products) this.products = [];
    this.products.push(product);
  }

  removeProduct(product: ProductEntity) {
    if (!this.products) return;
    this.products = this.products.filter(p => p.id !== product.id);
  }

  clearProducts() {
    this.products = [];
  }
}
