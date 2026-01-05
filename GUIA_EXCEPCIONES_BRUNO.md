# 📋 Guía de Pruebas en Bruno - Sistema de Excepciones Personalizado

## Resumen del Sistema Implementado

Se ha implementado un **sistema completo de manejo global de excepciones** con:

✅ **Base de excepciones**: `ApplicationException`  
✅ **Excepciones de dominio**: `NotFoundException`, `ConflictException`, `BadRequestException`  
✅ **Filter global**: `AllExceptionsFilter` registrado en `main.ts`  
✅ **Interfaz de respuesta**: `ErrorResponse` estandarizada  
✅ **Validación de reglas de negocio**: No se permite crear productos/usuarios con nombres/emails duplicados  

---

## 🎯 Captura 1: Error 404 - Recurso No Encontrado

### Escenario
Intenta obtener un producto que **NO existe** en la base de datos.

### Pasos en Bruno

1. **Crea una nueva petición GET**
   - URL: `http://localhost:3000/api/products/9999`
   
2. **Envía la petición**

3. **Resultado esperado**

```json
{
  "timestamp": "2026-01-05T02:20:15.123Z",
  "status": 404,
  "error": "Not Found",
  "message": "Producto no encontrado con ID: 9999",
  "path": "/api/products/9999"
}
```

### ✨ Características observadas
- ✅ HTTP Status: **404**
- ✅ Campo `error`: `"Not Found"`
- ✅ Mensaje claro y en español
- ✅ Path de la solicitud incluido
- ✅ Timestamp en ISO format
- ✅ **NO hay campo `details`** (no hay validación)

### 📸 Captura
Toma una captura del resultado en Bruno mostrando:
- La URL de la solicitud
- El status code 404
- El JSON de respuesta completo

---

## 🎯 Captura 2: Error 409 - Conflicto (Nombre Duplicado)

### Escenario
Intenta crear un producto con un **nombre que ya existe** en la base de datos.

### Pasos en Bruno

1. **Primero, obtén los productos existentes** (para saber qué nombres existen)
   - GET `http://localhost:3000/api/products`
   - Observa los nombres en la respuesta

2. **Crea una petición POST**
   - URL: `http://localhost:3000/api/products`
   - Method: `POST`
   - Body (JSON):
   
   ```json
   {
     "name": "Mouse",
     "description": "Intento duplicar nombre existente",
     "price": 25.99,
     "stock": 10
   }
   ```
   
   *Si no hay productos, crea primero uno con un nombre único, luego intenta crearlo nuevamente con el mismo nombre*

3. **Envía la petición**

4. **Resultado esperado**

```json
{
  "timestamp": "2026-01-05T02:22:45.789Z",
  "status": 409,
  "error": "Conflict",
  "message": "Ya existe un producto con el nombre \"Mouse\"",
  "path": "/api/products"
}
```

### ✨ Características observadas
- ✅ HTTP Status: **409**
- ✅ Campo `error`: `"Conflict"`
- ✅ Mensaje claro indicando el conflicto
- ✅ Nombre del producto duplicado entre comillas
- ✅ **NO hay campo `details`** (es un error de negocio simple)
- ✅ Se lanzó desde el **servicio** (ProductsService), no del DTO

### 📸 Captura
Toma una captura mostrando:
- La petición POST con los datos enviados
- El status code 409
- El JSON de respuesta con el mensaje del conflicto

---

## 🎯 Captura 3: Error 400 - Validación de Datos

### Escenario
Envías una petición con **datos mal formados** (campos vacíos, tipos incorrectos).

### Pasos en Bruno

1. **Crea una petición POST**
   - URL: `http://localhost:3000/api/products`
   - Method: `POST`
   - Body (JSON intencionalmente inválido):
   
   ```json
   {
     "name": "",
     "price": -50,
     "stock": -5
   }
   ```

2. **Envía la petición**

3. **Resultado esperado**

```json
{
  "timestamp": "2026-01-05T02:24:12.456Z",
  "status": 400,
  "error": "Bad Request",
  "message": "Datos de entrada inválidos",
  "path": "/api/products",
  "details": {
    "name": "name should not be empty",
    "price": "price must be a positive number or zero",
    "stock": "stock should not be empty"
  }
}
```

### ✨ Características observadas
- ✅ HTTP Status: **400**
- ✅ Campo `error`: `"Bad Request"`
- ✅ Mensaje general: `"Datos de entrada inválidos"`
- ✅ **Campo `details` PRESENTE** con errores por cada campo
- ✅ Cada error es específico del campo que falla
- ✅ Validación ocurre **ANTES de llegar al servicio**
- ✅ **ValidationPipe automático** de NestJS + class-validator

### 📸 Captura
Toma una captura mostrando:
- La petición POST con los datos inválidos enviados
- El status code 400
- El JSON de respuesta con el campo `details` expandido

---

## 📊 Comparativa de los 3 Escenarios

| Aspecto | 404 (Not Found) | 409 (Conflict) | 400 (Validation) |
|---------|-----------------|----------------|------------------|
| **Status Code** | 404 | 409 | 400 |
| **Error Type** | Not Found | Conflict | Bad Request |
| **Dónde ocurre** | En el servicio (findOne) | En el servicio (create/update) | En ValidationPipe (antes del servicio) |
| **Campo details** | ❌ No | ❌ No | ✅ Sí |
| **Causa** | Recurso no existe | Violación de regla de negocio | Datos estructuralmente inválidos |
| **Acción del cliente** | Verificar el ID | Cambiar nombre/email | Corregir estructura de datos |

---

## 🔍 Flujo de Validación Completo

```
Request HTTP
    ↓
Controller
    ↓
ValidationPipe (comprueba decoradores en DTO)
    ↓
    ¿Datos válidos?
    ├─ NO → BadRequestException (400)
    │        ↓
    │        AllExceptionsFilter
    │        ↓
    │        extractValidationErrors
    │        ↓
    │        ErrorResponse con "details"
    │
    └─ SÍ → Service
            ↓
            Lógica de negocio
            ↓
            ¿Conflicto? → ConflictException (409)
            ¿No encontrado? → NotFoundException (404)
            ¿Error negocio? → BadRequestException (400)
            ↓
            AllExceptionsFilter
            ↓
            ErrorResponse sin "details"
            ↓
            Response HTTP
```

---

## 💡 Puntos Clave del Diseño

### 1. **Separación de Responsabilidades**
- **DTOs**: Validación estructural (class-validator decoradores)
- **Servicios**: Validación de negocio (excepciones custom)
- **Filter**: Formato de respuesta (ErrorResponse interface)

### 2. **Excepciones Semánticas**
- `NotFoundException`: El recurso no existe (404)
- `ConflictException`: Viola restricción única o de integridad (409)
- `BadRequestException`: Violación de regla de negocio (400)

### 3. **Respuestas Consistentes**
- Todas las respuestas siguen `ErrorResponse`
- Incluyen: timestamp, status, error, message, path, details (opcional)
- Nunca se expone información interna del servidor

### 4. **Flujo Unificado**
- Un único filter `AllExceptionsFilter` maneja TODOS los errores
- Automáticamente detecta validaciones y errores de dominio
- Extrae y estructura información sin code en controladores

---

## 📝 Pruebas Adicionales (Opcionales)

### Prueba: Conflicto en actualización
```
PUT /api/products/1
{
  "name": "Mouse"  // Nombre de otro producto
}
```
Resultado: 409 Conflict

### Prueba: Email duplicado en usuarios
```
POST /api/usuarios
{
  "name": "John",
  "email": "existing@email.com",
  "password": "password123"
}
```
Resultado: 409 Conflict (si el email ya existe)

### Prueba: Campos extra rechazados
```
POST /api/products
{
  "name": "Laptop",
  "price": 999.99,
  "stock": 5,
  "extra_field": "esto no debería estar aquí"
}
```
Resultado: 400 Bad Request (forbidNonWhitelisted: true)

---

## ✅ Checklist de Validación

Antes de entregar, verifica:

- [ ] **Captura 1**: GET a ID inexistente → 404 con mensaje claro
- [ ] **Captura 2**: POST con nombre duplicado → 409 con conflicto
- [ ] **Captura 3**: POST con datos inválidos → 400 con campo details
- [ ] Los 3 errores tienen formato consistente (timestamp, status, error, message, path)
- [ ] El servidor compila sin errores
- [ ] Todos los endpoints responden correctamente

---

## 🚀 Conclusiones del Aprendizaje

Este sistema demuestra:

1. **Clean Architecture**: Separación clara entre capas (DTOs, Services, Models, Controllers, Filters)
2. **SOLID Principles**: Single Responsibility (cada componente tiene una función específica)
3. **DDD (Domain-Driven Design)**: Excepciones que representan eventos del dominio
4. **Error Handling Profesional**: Respuestas estructuradas y predecibles
5. **Seguridad**: Sin stack traces expuestos, información controlada

El cliente (frontend) recibe información clara y estructurada para:
- Mostrar mensajes de error apropiados
- Destacar campos con errores de validación
- Manejar reintentos inteligentemente
- Depurar problemas más fácilmente

---

**Autor**: GitHub Copilot  
**Fecha**: 2026-01-05  
**Sistema**: NestJS + PostgreSQL + TypeORM  
