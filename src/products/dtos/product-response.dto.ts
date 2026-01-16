export class ProductResponseDto {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;

  // ================== RELACIONES ANIDADAS ==================
  user?: UserSummaryDto;
  categories?: CategoryResponseDto[];

  // ================== INFORMACIÓN PLANA ==================
  userId?: number;
  userName?: string;
  userEmail?: string;

  createdAt: Date;
  updatedAt: Date;
}

export class UserSummaryDto {
  id: number;
  name: string;
  email: string;
}

export class CategoryResponseDto {
  id: number;
  name: string;
  description?: string;
}
