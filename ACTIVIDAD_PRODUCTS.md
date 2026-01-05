# 📋 Actividad Práctica - Módulo Products

## ✅ Completado: Implementación Completa del Módulo Products

### 10.1 DTOs con Validación

#### CreateProductDto
```typescript
- @IsNotEmpty() - El nombre es obligatorio
- @MinLength(3) - Mínimo 3 caracteres
- @MaxLength(200) - Máximo 200 caracteres
- price: @IsNotEmpty() + @Min(0) - Obligatorio, no negativo
- stock: @IsOptional() + @Min(0) - Opcional, no negativo
```

#### UpdateProductDto
```typescript
- Todos los campos opcionales
- Validaciones iguales a CreateProductDto
```

#### PartialUpdateProductDto
```typescript
- Todos los campos opcionales (para PATCH)
- Validaciones iguales a UpdateProductDto
```

#### ProductResponseDto
```typescript
- id: number
- name: string
- description: string
- price: number
- stock: number
- createdAt: string (ISO format)
```

---

### 10.2 Modelo de Dominio Product

#### Métodos Implementados:

1. **Product.fromDto(dto: CreateProductDto)**
   - Factory method que crea un Product desde un DTO
   - Asigna ID 0 (se asignará en BD)
   - Inicializa stock en 0 si no se proporciona

2. **Product.fromEntity(entity: ProductEntity)**
   - Factory method que crea un Product desde una entidad persistente
   - Mantiene ID de la BD

3. **product.toEntity()**
   - Convierte el modelo a entidad para persistencia en BD
   - Solo incluye ID si es > 0

4. **product.toResponseDto()**
   - Convierte el modelo a DTO de respuesta
   - Formatea la fecha en ISO string

5. **product.update(dto: UpdateProductDto)**
   - Actualización completa
   - Valida reglas de negocio después de actualizar

6. **product.partialUpdate(dto: PartialUpdateProductDto)**
   - Actualización parcial
   - Solo actualiza campos proporcionados
   - Valida reglas de negocio

#### Métodos Adicionales de Negocio:

7. **product.reduceStock(quantity: number)**
   - Reduce el stock
   - Valida que haya suficiente stock

8. **product.addStock(quantity: number)**
   - Aumenta el stock

---

### 10.3 Validaciones de Negocio (Servicio)

Implementadas en el constructor del modelo Product:

```typescript
private validateBusinessRules(): void {
  // Validar nombre
  if (!this.name || this.name.trim().length < 3) {
    throw new Error('El nombre del producto debe tener al menos 3 caracteres');
  }

  // Validar precio
  if (this.price < 0) {
    throw new Error('El precio no puede ser negativo');
  }

  // Validar stock
  if (this.stock < 0) {
    throw new Error('El stock no puede ser negativo');
  }
}
```

---

### 10.4 ValidationPipe Global

Ya configurado en `src/main.ts`:

```typescript
app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true,
}));
```

**Beneficio**: Todos los DTOs se validan automáticamente en el controlador.

---

## 📂 Estructura de Carpetas

```
src/products/
├── dtos/
│   ├── create-product.dto.ts (Validación completa)
│   ├── update-product.dto.ts (Campos opcionales)
│   ├── partial-update-product.dto.ts (Todos opcionales)
│   └── product-response.dto.ts (Respuesta sin password)
├── entities/
│   └── product.entity.ts (TypeORM entity)
├── models/
│   └── product.model.ts (Modelo de dominio con validaciones)
├── mappers/
│   └── product.mapper.ts (Transformaciones)
├── services/
│   └── products.service.ts (Lógica de negocio con BD)
├── controllers/
│   └── products.controller.ts (Endpoints API)
└── products.module.ts (Configuración del módulo)
```

---

## 🔗 Endpoints Implementados

| Método | Ruta | DTO | Descripción |
|--------|------|-----|------------|
| POST | `/api/products` | CreateProductDto | Crear producto |
| GET | `/api/products` | - | Listar todos |
| GET | `/api/products/:id` | - | Obtener uno |
| PUT | `/api/products/:id` | UpdateProductDto | Actualizar completo |
| PATCH | `/api/products/:id` | PartialUpdateProductDto | Actualizar parcial |
| DELETE | `/api/products/:id` | - | Eliminar |

---

## ✨ Flujo de Datos

```
Request Body (DTO)
      ↓
ValidationPipe (Valida automáticamente)
      ↓
Controller
      ↓
Service (Crea modelo desde DTO)
      ↓
Product Model (Valida reglas de negocio)
      ↓
Repository (Guarda en BD)
      ↓
ResponseDto (Retorna al cliente)
```

---

## 🎓 Conceptos Aprendidos

✅ DTOs con validación de clase  
✅ Modelos de dominio con lógica de negocio  
✅ Factory methods para crear instancias  
✅ Validación automática con ValidationPipe  
✅ Separación de capas (Controller → Service → Model → Repository)  
✅ Transformación de datos entre capas  
✅ Endpoints RESTful completos  

---

**Estado**: ✅ COMPLETADO Y FUNCIONAL
