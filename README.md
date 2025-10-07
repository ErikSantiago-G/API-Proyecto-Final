# API Backend E-Commerce

Backend completo de e-commerce construido con NestJS + TypeScript + PostgreSQL + Prisma + Stripe, siguiendo principios SOLID y arquitectura limpia.

## Características

- **Autenticación y Autorización**: JWT con tokens de acceso/refresh, control de acceso basado en roles (Admin, Manager, Customer)
- **Gestión de Productos**: CRUD completo con filtros, paginación, control de stock e imágenes
- **Gestión de Categorías**: Organizar productos en categorías
- **Módulo CMS**: Gestionar banners, secciones y contenido de noticias
- **Carrito de Compras**: Agregar, actualizar, eliminar artículos con validación de stock
- **Integración con Stripe**: Sesiones de checkout seguras y manejo de webhooks
- **Gestión de Pedidos**: Seguimiento de pedidos con múltiples estados
- **Seguridad**: Helmet, limitación de velocidad, validación de entrada, manejo de errores
- **Documentación de API**: Documentación interactiva Swagger/OpenAPI

## Stack Tecnológico

- **Framework**: NestJS
- **Lenguaje**: TypeScript
- **Base de Datos**: PostgreSQL
- **ORM**: Prisma
- **Autenticación**: JWT con Passport
- **Pagos**: Stripe
- **Validación**: class-validator
- **Documentación**: Swagger/OpenAPI

## Estructura del Proyecto

```
src/
├── auth/              # Módulo de autenticación (JWT, estrategias, guards)
├── users/             # Servicio de gestión de usuarios
├── products/          # CRUD de productos y filtros
├── categories/        # Gestión de categorías
├── cms/               # CMS (banners, secciones, noticias)
├── cart/              # Carrito de compras y checkout
├── orders/            # Gestión de pedidos
├── prisma/            # Servicio y cliente de Prisma
└── common/            # Utilidades compartidas (decoradores, guards, filtros)
```

## Configuración

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

Actualiza `.env` con tus credenciales:

```env
DATABASE_URL="postgresql://user:password@host:5432/database"
JWT_SECRET=tu-clave-secreta
JWT_REFRESH_SECRET=tu-clave-secreta-refresh
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
STRIPE_SECRET_KEY=sk_test_tu_clave_stripe
STRIPE_WEBHOOK_SECRET=whsec_tu_secreto_webhook
PORT=3000
```

### 3. Generar Cliente de Prisma

```bash
npm run prisma:generate
```

### 4. Ejecutar Migraciones de Base de Datos

```bash
npm run prisma:migrate
```

## Ejecutar la Aplicación

### Modo Desarrollo

```bash
npm run dev
```

### Modo Producción

```bash
npm run build
npm run prod
```

## Documentación de la API

Una vez que el servidor esté ejecutándose, accede a la documentación interactiva de la API en:

```
http://localhost:3000/api
```

## Endpoints de la API

### Autenticación
- `POST /auth/register` - Registrar nuevo usuario
- `POST /auth/login` - Iniciar sesión de usuario
- `POST /auth/refresh` - Renovar token de acceso
- `POST /auth/logout` - Cerrar sesión de usuario
- `GET /auth/me` - Obtener perfil del usuario actual

### Productos (Público)
- `GET /products` - Obtener todos los productos (con filtros y paginación)
- `GET /products/:id` - Obtener producto por ID
- `GET /products/slug/:slug` - Obtener producto por slug

### Productos (Admin/Manager)
- `POST /admin/products` - Crear producto
- `PATCH /admin/products/:id` - Actualizar producto
- `PATCH /admin/products/:id/stock` - Actualizar solo el stock
- `DELETE /admin/products/:id` - Eliminar producto (Solo Admin)

### Categorías
- `GET /categories` - Obtener todas las categorías
- `GET /categories/:id` - Obtener categoría por ID
- `POST /admin/categories` - Crear categoría (Admin/Manager)
- `PATCH /admin/categories/:id` - Actualizar categoría (Admin/Manager)
- `DELETE /admin/categories/:id` - Eliminar categoría (Admin)

### CMS - Banners, Secciones, Noticias
Estructura similar para `/banners`, `/sections`, `/news` con endpoints públicos y `/admin/*`

### Carrito
- `GET /cart` - Obtener carrito del usuario
- `POST /cart` - Agregar artículo al carrito
- `PATCH /cart/:itemId` - Actualizar cantidad de artículo del carrito
- `DELETE /cart/:itemId` - Eliminar artículo del carrito
- `DELETE /cart` - Limpiar carrito

### Checkout
- `POST /checkout/create` - Crear sesión de checkout de Stripe

### Pedidos
- `GET /orders` - Obtener pedidos del usuario
- `GET /orders/:id` - Obtener pedido por ID
- `GET /admin/orders` - Obtener todos los pedidos (Admin/Manager)
- `PATCH /admin/orders/:id/status` - Actualizar estado del pedido (Admin/Manager)

### Webhooks
- `POST /webhooks/stripe` - Manejar webhooks de pagos de Stripe

## Roles de Usuario

- **CUSTOMER**: Puede navegar productos, gestionar carrito, realizar pedidos
- **MANAGER**: Puede gestionar productos, categorías, contenido CMS, ver pedidos
- **ADMIN**: Acceso completo incluyendo gestión de usuarios y eliminaciones

## Arquitectura y Mejores Prácticas

### Principios SOLID
- **Responsabilidad Única**: Cada servicio maneja un dominio
- **Abierto/Cerrado**: DTOs y entidades son extensibles
- **Sustitución de Liskov**: Guards y estrategias siguen contratos
- **Segregación de Interfaces**: Interfaces enfocadas por módulo
- **Inversión de Dependencias**: Inyección de dependencias en todo el proyecto

### Arquitectura Limpia
- **Controladores**: Manejan peticiones/respuestas HTTP
- **Servicios**: Capa de lógica de negocio
- **Repositorios**: Acceso a datos (via Prisma)
- **DTOs**: Validación y transformación de datos
- **Guards**: Autenticación y autorización
- **Filtros**: Manejo centralizado de errores

### Características de Seguridad
- Hash de contraseñas con bcrypt
- Autenticación JWT con tokens de refresh
- Control de acceso basado en roles
- Validación y sanitización de entrada
- Limitación de velocidad (10 peticiones por minuto)
- Helmet para headers de seguridad
- CORS habilitado

### Mejores Prácticas de Base de Datos
- ORM Prisma para consultas type-safe
- Transacciones de base de datos para checkout
- Indexación apropiada en slugs y claves foráneas
- Eliminaciones en cascada para integridad referencial

## Integración con Stripe

### Flujo de Checkout
1. El usuario agrega artículos al carrito
2. El usuario inicia el checkout con dirección de envío
3. El backend crea la sesión de checkout de Stripe
4. El usuario completa el pago en Stripe
5. Stripe envía webhook al backend
6. El backend actualiza el estado del pedido y decrementa el stock
7. El carrito se limpia automáticamente

### Configuración de Webhook
Configura el endpoint de webhook de Stripe:
```
https://localhost:3000/webhooks/stripe
```

Eventos escuchados:
- `checkout.session.completed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

## Esquema de Base de Datos

Modelos clave:
- **User**: Autenticación y perfil
- **Category**: Organización de productos
- **Product**: Catálogo de productos con stock
- **Cart/CartItem**: Carrito de compras
- **Order/OrderItem**: Seguimiento de pedidos
- **Banner/Section/News**: Contenido CMS

## Licencia

MIT
