import { Product } from "../models/product.model";
import { ProductEntity } from "../entities/product.entity";
import { ProductResponseDto } from "../dtos/product-response.dto";

export class ProductMapper {
    static toEntity(id: number, dto: any) {
        return new Product(
            id,
            dto.name,
            dto.description || '',
            dto.price,
            dto.stock || 0,
            new Date()
        );
    }

    static toResponse(entity: Product): ProductResponseDto {
        return {
            id: entity.id,
            name: entity.name,
            description: entity.description,
            price: entity.price,
            stock: entity.stock,
            createdAt: entity.createdAt.toISOString(),
        };
    }
}