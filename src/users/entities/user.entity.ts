import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../../core/entities/base.entity';
import { ProductEntity } from '../../products/entities/product.entity';

@Entity('users')
export class UserEntity extends BaseEntity {

  @Column({ type: 'varchar', length: 150, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 150, unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;

  // No se agrega relación bidireccional para mantener bajo acoplamiento, según la guía.
}
