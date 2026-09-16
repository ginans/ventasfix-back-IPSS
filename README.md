# Ventas Fix — Backend Microservice & REST API

Microservicio backend y API REST desarrollado para la empresa **Ventas Fix**, orientado a la modernización de su canal de venta online, gestión interna de inventario/clientes y sincronización con sistemas de terceros (Softland ERP). Desarrollado con fines académicos para el **Instituto Profesional IPSS** como entrega del **Examen Transversal** de la asignatura **Desarrollo de Software Web I — Sección 51**.

| | |
| :--- | :--- |
| **Desarrolladora** | Gina Norambuena Sánchez |
| **Docente** | Boris Belmar |
| **Asignatura** | Desarrollo de Software Web I — Sección 51 |
| **Institución** | Instituto Profesional IPSS |
| **Evaluación** | Examen Transversal (Microservicio y Backoffice) |

Este repositorio contiene el **Backend REST API**. El frontend Backoffice (Next.js 15) se encuentra en el repositorio hermano `ventasfix-front-IPSS`.

---

## Tabla de contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Requisitos](#requisitos)
- [Puesta en marcha](#puesta-en-marcha)
- [Variables de entorno](#variables-de-entorno)
- [Arquitectura](#arquitectura)
- [Justificación de tecnologías](#justificación-de-tecnologías)
- [Control de Acceso Basado en Roles (RBAC)](#control-de-acceso-basado-en-roles-rbac)
- [Documentación interactiva (Swagger)](#documentación-interactiva-swagger)
- [Catálogo de Endpoints](#catálogo-de-endpoints)
- [Pruebas automatizadas (Jest)](#pruebas-automatizadas-jest)
- [Nota sobre el proceso de desarrollo](#nota-sobre-el-proceso-de-desarrollo)

---

## Características

- **Autenticación perimetral JWT:** Inicio de sesión seguro con emisión de JSON Web Tokens firmados y expiración configurada.
- **Control de Acceso Basado en Roles (RBAC):** Sistema jerárquico estricto con roles `ADMIN` (Control total) y `VIEWER` (Solo lectura). Rutas mutantes protegidas con `RolesGuard` (`APP_GUARD`) y `@Roles('ADMIN')`, respondiendo con código HTTP `403 Forbidden` ante accesos no autorizados.
- **Principio de menor privilegio:** Todo nuevo usuario registrado nace con rol `VIEWER` por defecto; la elevación a `ADMIN` requiere acción explícita de un administrador autenticado.
- **Cifrado irreversible de credenciales:** Claves protegidas mediante algoritmo **bcrypt** con 10 rondas de salteo (salt rounds = 10). Exclusión estricta del hash en consultas de lectura.
- **Validación matemática de RUT Chileno (Módulo 11):** Validador personalizado declarativo `@IsRut()` que comprueba longitud, cuerpo numérico y cálculo del dígito verificador (`0`-`9`, `K`).
- **Dominio corporativo estricto:** Cuentas administrativas restringidas exclusivamente a correos bajo el dominio institucional `@ventasfix.cl`.
- **Cálculo automático de IVA (19%):** Sincronización matemática del `precioVenta = Math.round(precioNeto * 1.19)` en el ciclo de vida del producto.
- **Clasificación semántica de Stock:** Computación dinámica del estado de inventario en 4 niveles: `CRITICAL`, `LOW`, `NORMAL` y `HIGH` según umbrales de bodega.
- **Fail-Fast Environment Validation:** Validación rigurosa de variables de entorno al inicializar la aplicación con esquema **Joi** (`env.validation.ts`).
- **Documentación OpenAPI 3.0 / Swagger:** Montada interactivamente en `/api/docs` con botón Authorize para JWT y exportación automática a `spec/oas.yaml` en cada arranque.
- **Persistencia tipada con Prisma ORM 6:** Sobre base de datos relacional **MySQL 8** contenerizada con Docker Compose.
- **Batería de Pruebas Unitarias:** 5 suites con 16 tests automatizados al 100% de aprobación en **Jest**.

---

## Tecnologías

| Tecnología | Propósito |
| :--- | :--- |
| **NestJS 11** | Framework modular de Node.js (Controller → Guard/Pipe → Service → ORM) |
| **Prisma ORM 6** | Mapeo objeto-relacional tipado y migraciones de base de datos |
| **MySQL 8.0** | Motor de base de datos relacional sobre contenedor Docker |
| **Passport + JWT** | Estrategia perimetral de autenticación y autorización |
| **Bcrypt** | Cifrado seguro de contraseñas |
| **class-validator / class-transformer** | Validación declarativa de Data Transfer Objects (DTOs) |
| **Joi** | Validación estricta del archivo `.env` en tiempo de arranque |
| **@nestjs/swagger** | Generación interactiva y exportación automática de OpenAPI 3.0 |
| **Jest** | Framework de pruebas unitarias automatizadas |

---

## Requisitos

- **Node.js 20+** o **Node.js 22+**
- **Docker Desktop** (para el servicio de MySQL 8)

---

## Puesta en marcha

### 1. Levantar el contenedor de Base de Datos

```bash
docker compose up -d
```

### 2. Instalar dependencias del proyecto

```bash
npm install
```

### 3. Configurar variables de entorno

Crear el archivo `.env` en la raíz del backend (puedes tomar como base `.env.example`):

```env
PORT=3000
DATABASE_URL="mysql://root:rootpassword@localhost:3306/ventasfix_db"
JWT_SECRET="ventasfix_super_secret_jwt_key_examen_2026"
JWT_EXPIRES_IN="8h"
```

### 4. Sincronizar esquema y generar cliente Prisma

```bash
npx prisma generate
npx prisma db push
```

### 5. Sembrar datos de prueba (Seed Idempotente)

```bash
npm run prisma:seed
```

> **Datos precargados por el Seed:**
> - **4 Usuarios:** 2 Administradores (`admin@ventasfix.cl`, `supervisor@ventasfix.cl`) y 2 Visualizadores (`viewer@ventasfix.cl`, `auditor@ventasfix.cl`).
> - **6 Productos:** Artículos de ferretería/taller cubriendo los 4 estados de stock (`CRITICAL`, `LOW`, `NORMAL`, `HIGH`) con imágenes verificadas.
> - **4 Clientes Empresa:** Empresas B2B de diversos rubros con RUTs chilenos válidos.

### 6. Ejecutar en desarrollo

```bash
npm run start:dev
```

* **API REST disponible en:** `http://localhost:3000/api`
* **Swagger UI interactivo:** `http://localhost:3000/api/docs`
* **Archivo OpenAPI autogenerado:** `spec/oas.yaml`

---

## Comandos útiles

| Comando | Descripción |
| :--- | :--- |
| `npm run start:dev` | Inicia el servidor con recarga en vivo (Watch mode) |
| `npm run build` | Compila el proyecto a JavaScript optimizado en `/dist` |
| `npm run start:prod` | Ejecuta la versión de producción compilada |
| `npm test` | Ejecuta las 16 pruebas unitarias con Jest |
| `npm run prisma:seed` | Ejecuta el script de siembra de datos de prueba |
| `npx prisma studio` | Abre el visualizador web de la base de datos de Prisma |

---

## Variables de entorno

| Variable | Tipo | Requerido | Descripción |
| :--- | :---: | :---: | :--- |
| `PORT` | Número | Opcional | Puerto de escucha del microservicio (por defecto: `3000`) |
| `DATABASE_URL` | String | **Sí** | Cadena de conexión JDBC a MySQL 8 (`mysql://...`) |
| `JWT_SECRET` | String | **Sí** | Clave secreta para la firma y verificación de tokens JWT |
| `JWT_EXPIRES_IN` | String | Opcional | Tiempo de validez del token (por defecto: `8h`) |

---

## Arquitectura

El proyecto sigue una arquitectura modular en capas con Inversión de Control (IoC) y Principio de Responsabilidad Única (SoC):

```
src/
├── auth/                         # Módulo de Autenticación y JWT
│   ├── auth.controller.ts        #   Endpoint POST /api/auth/login
│   ├── auth.service.ts           #   Lógica de validación de clave y firma JWT
│   ├── jwt.strategy.ts           #   Estrategia Passport JWT
│   ├── guards/                   #   JwtAuthGuard y RolesGuard
│   ├── decorators/               #   @Public(), @Roles(), @CurrentUser()
│   └── dto/                      #   LoginDto
├── users/                        # Módulo de Usuarios y Administradores
│   ├── users.controller.ts       #   CRUD /api/users (Protegido con @Roles('ADMIN'))
│   ├── users.service.ts          #   Lógica de negocio, hash bcrypt y omisión de password
│   └── dto/                      #   CreateUserDto, UpdateUserDto
├── products/                     # Módulo de Catálogo de Productos
│   ├── products.controller.ts    #   CRUD /api/products (Escritura requiere ADMIN)
│   ├── products.service.ts       #   Cálculo automático de IVA (19%) y clasificación de stock
│   └── dto/                      #   CreateProductDto, UpdateProductDto
├── clients/                      # Módulo de Clientes Empresa (B2B)
│   ├── clients.controller.ts     #   CRUD /api/clients (Escritura requiere ADMIN)
│   ├── clients.service.ts        #   Validación de unicidad de RUT de empresa
│   └── dto/                      #   CreateClientDto, UpdateClientDto
├── dashboard/                    # Módulo de Métricas Generales
│   ├── dashboard.controller.ts   #   Endpoint GET /api/dashboard/stats
│   └── dashboard.service.ts      #   Agregación de conteos totales en tiempo real
├── common/                       # Componentes transversales
│   ├── filters/                  #   HttpExceptionFilter (Errores normalizados)
│   ├── interceptors/             #   TransformInterceptor (Formato IApiResponse<T>)
│   ├── validators/               #   IsRutConstraint y validador de RUT Módulo 11
│   └── interfaces/               #   Contratos de tipado TypeScript
├── config/                       # Configuración y validación fail-fast
│   └── env.validation.ts         #   Esquema Joi de variables de entorno
├── prisma/                       # Capa de persistencia
│   └── prisma.service.ts         #   Cliente Prisma inyectable
├── app.module.ts                 # Módulo raíz y registro de guards globales
└── main.ts                       # Bootstrap, prefijo global /api, Swagger y Pipes
```

---

## Justificación de tecnologías

- **NestJS 11:** Proporciona una arquitectura robusta inspirada en Angular, con inyección de dependencias nativa, controladores limpios y separación modular estricta que facilita las pruebas unitarias y el desacoplamiento.
- **Prisma ORM 6:** Ofrece seguridad de tipos en tiempo de compilación generada directamente desde `schema.prisma`, eliminando errores de sintaxis en consultas SQL y facilitando transacciones seguras.
- **MySQL 8 en Docker:** Garantiza un entorno de persistencia relacional idéntico e independiente del sistema operativo del evaluador o servidor de despliegue.
- **Passport + JWT:** Estándar perimetral de la industria para autenticación sin estado (stateless). El uso de `JwtAuthGuard` global protege todos los endpoints por defecto, admitiendo excepciones declarativas con `@Public()`.
- **Bcrypt:** Algoritmo estándar para almacenamiento unidireccional de contraseñas, resistente a ataques de diccionario y tablas arcoíris mediante salteo automático.
- **Joi Fail-Fast:** Evita arrancar el microservicio en estados inconsistentes si faltan variables de configuración críticas como `JWT_SECRET` o `DATABASE_URL`.

---

## Control de Acceso Basado en Roles (RBAC)

El microservicio implementa seguridad perimetral en dos niveles:

1. **Autenticación (Quién es el usuario):** Gestionada por `JwtAuthGuard`. Valida que el token JWT sea legítimo, no haya expirado y pertenezca a un usuario válido en base de datos.
2. **Autorización (Qué puede hacer):** Gestionada por `RolesGuard` (`APP_GUARD`) y el decorador `@Roles('ADMIN')`:
   - **`ADMIN`:** Puede listar, consultar, crear, modificar y eliminar usuarios, productos y clientes.
   - **`VIEWER`:** Puede consultar y listar información en modo de solo lectura. Cualquier intento de ejecutar un método `POST`, `PUT` o `DELETE` es interceptado automáticamente y rechazado con código HTTP `403 Forbidden`.

---

## Documentación interactiva (Swagger)

La API autogenera su documentación interactiva mediante `@nestjs/swagger` en:

```
http://localhost:3000/api/docs
```

- Los esquemas, tipos y restricciones de negocio se derivan de los DTOs y decoradores de `class-validator`.
- Cuenta con botón **Authorize** para ingresar el Bearer Token JWT y probar endpoints directamente desde el navegador.
- En cada arranque del servidor, se exporta y sincroniza automáticamente la especificación completa a formato YAML en: `spec/oas.yaml`.

---

## Catálogo de Endpoints

Todos los endpoints (salvo `/api/auth/login`) requieren el encabezado:  
`Authorization: Bearer <token_jwt>`

| Módulo | Método | Ruta | Código Éxito | Códigos de Error | Rol Requerido | Descripción |
| :--- | :---: | :--- | :---: | :---: | :---: | :--- |
| **Auth** | `POST` | `/api/auth/login` | `200 OK` | `400, 401` | Público | Autentica usuario y retorna JWT + datos de sesión. |
| **Usuarios** | `GET` | `/api/users` | `200 OK` | `401` | Autenticado | Lista todos los usuarios registrados (sin password). |
| **Usuarios** | `GET` | `/api/users/:id` | `200 OK` | `401, 404` | Autenticado | Obtiene el detalle de un usuario por su ID. |
| **Usuarios** | `POST` | `/api/users` | `201 Created` | `400, 401, 403, 409` | `ADMIN` | Registra un usuario (rol VIEWER por defecto). |
| **Usuarios** | `PUT` | `/api/users/:id` | `200 OK` | `400, 401, 403, 404, 409`| `ADMIN` | Actualiza datos o eleva el rol de un usuario. |
| **Usuarios** | `DELETE` | `/api/users/:id` | `200 OK` | `401, 403, 404` | `ADMIN` | Elimina un usuario por su ID. |
| **Productos** | `GET` | `/api/products` | `200 OK` | `401` | Autenticado | Lista catálogo con cálculo de IVA y estado de stock. |
| **Productos** | `GET` | `/api/products/:id` | `200 OK` | `401, 404` | Autenticado | Obtiene el detalle de un producto por ID. |
| **Productos** | `POST` | `/api/products` | `201 Created` | `400, 401, 403, 409` | `ADMIN` | Agrega un producto con validación de SKU e IVA 19%. |
| **Productos** | `PUT` | `/api/products/:id` | `200 OK` | `400, 401, 403, 404, 409`| `ADMIN` | Actualiza producto, recalcula IVA y stockStatus. |
| **Productos** | `DELETE` | `/api/products/:id` | `200 OK` | `401, 403, 404` | `ADMIN` | Elimina un producto por su ID. |
| **Clientes** | `GET` | `/api/clients` | `200 OK` | `401` | Autenticado | Lista todas las empresas clientes registradas. |
| **Clientes** | `GET` | `/api/clients/:id` | `200 OK` | `401, 404` | Autenticado | Obtiene datos de una empresa cliente por ID. |
| **Clientes** | `POST` | `/api/clients` | `201 Created` | `400, 401, 403, 409` | `ADMIN` | Registra empresa cliente con validación de RUT. |
| **Clientes** | `PUT` | `/api/clients/:id` | `200 OK` | `400, 401, 403, 404, 409`| `ADMIN` | Actualiza información de una empresa cliente por ID. |
| **Clientes** | `DELETE` | `/api/clients/:id` | `200 OK` | `401, 403, 404` | `ADMIN` | Elimina una empresa cliente por su ID. |
| **Dashboard** | `GET` | `/api/dashboard/stats` | `200 OK` | `401` | Autenticado | Retorna contadores totales de usuarios, productos y clientes. |

---

## Cuentas de Acceso Preconfiguradas (Seed)

Para probar la plataforma y la reactividad del sistema RBAC, el seed precarga 4 cuentas:

| Nombre | Correo Electrónico | Contraseña | Rol | Permisos |
| :--- | :--- | :---: | :---: | :--- |
| **Administrador Principal** | `admin@ventasfix.cl` | `Admin1234!` | `ADMIN` | Acceso Total (Lectura y Escritura) |
| **Supervisor Operativo** | `supervisor@ventasfix.cl` | `Admin1234!` | `ADMIN` | Acceso Total (Lectura y Escritura) |
| **Visualizador Invitado** | `viewer@ventasfix.cl` | `Viewer1234!` | `VIEWER` | Solo Lectura (Auditoría) |
| **Auditor Contable** | `auditor@ventasfix.cl` | `Viewer1234!` | `VIEWER` | Solo Lectura (Auditoría) |

---

## Pruebas automatizadas (Jest)

Las pruebas unitarias se ejecutan mediante:

```bash
npm test
```

### Cobertura de las Suites de Prueba:
- `is-rut.validator.spec.ts`: Algoritmo Módulo 11 de RUT chileno (formatos válidos, dígitos verificadores erróneos, entradas inválidas).
- `auth.service.spec.ts`: Flujos de autenticación correcta, rechazo por usuario inexistente y rechazo por clave errónea.
- `users.service.spec.ts`: CRUD de usuarios, encriptación bcrypt, omisión estricta de password y detección de RUT/Email duplicado.
- `products.service.spec.ts`: Cálculo matemático de IVA 19%, clasificación semántica de stock (`CRITICAL`, `LOW`, `NORMAL`, `HIGH`) y control de SKU único.
- `clients.service.spec.ts`: Control de unicidad de RUT de empresa, CRUD y manejo de excepciones no encontradas.

**Resultado:** 5 suites ejecutadas, 16 tests aprobados al 100%.

---

## Nota sobre el proceso de desarrollo

Este proyecto fue desarrollado con el apoyo de herramientas avanzadas de inteligencia artificial (el agente de programación `Antigravity` / modelo `Gemini 3.8 Flash` de Google DeepMind) para agilizar tareas repetitivas de codificación, refactorización modular, automatización de pruebas y estructuración de la documentación técnica.

El uso de estas herramientas se fundamenta en un modelo de **pair programming orientado a la productividad**, donde la **arquitectura general del microservicio, las decisiones técnicas y de seguridad, la definición del modelo de datos, la implementación del sistema RBAC y la dirección técnica del proyecto fueron diseñadas, evaluadas y supervisadas en todo momento por la desarrolladora Gina Norambuena Sánchez**, quien actuó como **arquitecta principal de software**, validando y aprobando cada componente antes de su integración definitiva en el repositorio.