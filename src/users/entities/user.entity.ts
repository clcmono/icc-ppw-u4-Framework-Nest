import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../../core/entities/base.entity';

@Entity('users')
export class UserEntity extends BaseEntity {

  @Column({ type: 'varchar', length: 150, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 150, unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  password: string;
}
