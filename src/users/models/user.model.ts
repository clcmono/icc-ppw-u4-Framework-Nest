import { UserEntity } from '../entities/user.entity';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { PartialUptadeUserDto } from '../dtos/partial-update-user.dto';
import { UserResponseDto } from '../dtos/user-response.dto';

export class User {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public password: string,
    public createdAt: Date,
  ) {

    if (!name || name.trim().length < 3) {
      throw new Error("Nombre inválido");
    }

    if (!email || !email.includes("@")) {
      throw new Error("Email inválido");
    }

    if (!password || password.length < 8) {
      throw new Error("Password inválido");
    }
  }

  // ==================== FACTORY METHODS ====================
  static fromDto(dto: CreateUserDto): User {
  return new User(0, dto.name, dto.email, dto.password, new Date());
}

  static fromEntity(entity: UserEntity): User {
  return new User(
    entity.id,
    entity.name,
    entity.email,
    entity.password,
    entity.createdAt,
  );
}

  toEntity(): UserEntity {
  const entity = new UserEntity();
  if (this.id > 0) {
    entity.id = this.id;
  }
  entity.name = this.name;
  entity.email = this.email;
  entity.password = this.password;
  return entity;
}

toResponseDto(): UserResponseDto {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      createdAt: this.createdAt.toISOString(),
    };
  }

  // =================================

  update(dto: UpdateUserDto): User {
    this.name = dto.name;
    this.email = dto.email;
    this.password = dto.password;
    return this;
  }

  partialUpdate(dto: PartialUptadeUserDto): User {
    if (dto.name !== undefined) this.name = dto.name;
    if (dto.email !== undefined) this.email = dto.email;
    if (dto.password !== undefined) this.password = dto.password;
    return this;
  }
}






