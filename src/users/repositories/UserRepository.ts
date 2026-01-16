import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  // Métodos automáticos
  findAll(): Promise<UserEntity[]> {
    return this.repo.find();
  }

  findById(id: number): Promise<UserEntity | null> {
    return this.repo.findOne({ where: { id } });
  }

  save(user: UserEntity): Promise<UserEntity> {
    return this.repo.save(user);
  }

  delete(user: UserEntity): Promise<UserEntity> {
    return this.repo.remove(user);
  }

  // 🔹 Método personalizado como en Spring
  findByEmail(email: string): Promise<UserEntity | null> {
    return this.repo.findOne({ where: { email } });
  }
}


