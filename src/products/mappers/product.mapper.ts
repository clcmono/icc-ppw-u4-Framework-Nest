import { Product } from "../models/product.model";
import { ProductEntity } from "../entities/product.entity";
import { ProductResponseDto } from "../dtos/product-response.dto";

export class ProductMapper {
    static toEntity(dto: any): Product {
        // Usa el método estático del modelo para crear un Product
        return Product.fromDto(dto);
    }

    static toResponse(product: Product): ProductResponseDto {
        // Usa los getters para acceder a las propiedades
        return {
            id: product.getId?.() ?? 0,
            name: product.getName(),
            description: product.getDescription(),
            price: product.getPrice(),
            stock: product['stock'] ?? 0, // Si no hay getter, accede directamente
            createdAt: new Date(), // Ajusta según tu lógica
            updatedAt: new Date(),
        };
    }
}