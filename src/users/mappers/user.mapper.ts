import { User } from "../models/user.model";
import { UserEntity } from "../entities/user.entity";
import { UserResponseDto } from "../dtos/user-response.dto";

export class UserMapper {
    static toEntity(id: number, dto: any) {
        return new User(id, dto.name, dto.email, dto.password, new Date());
    } 
    
    static toResponse(entity: User) {
        return {
            id: entity.id,
            name: entity.name,
            email: entity.email,
        };
    }
}