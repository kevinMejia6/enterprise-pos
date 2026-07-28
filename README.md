# Enterprise POS

Prueba técnica desarrollada utilizando **Node.js, Express.js, Sequelize, Vue.js 2, Vuetify y MySQL**.

La aplicación implementa un sistema de Punto de Venta (POS) que permite administrar productos y registrar ventas, siguiendo una arquitectura por capas y buenas prácticas de desarrollo.

---

# Tecnologías utilizadas

## Backend

- Node.js
- Express.js
- Sequelize ORM
- MySQL
- Express Validator

## Frontend

- Vue.js 2
- Vuetify
- Axios
- Vue Router

---

# Funcionalidades implementadas

## Administración de productos

- Crear productos
- Editar productos
- Buscar por nombre
- Buscar por código de barras
- Actualizar información
- Estado activo/inactivo

Cada producto contiene:

- Nombre
- Precio
- Código de barras
- Imagen

---

## Punto de Venta (POS)

- Agregar productos a la venta
- Modificar cantidades
- Modificar precio unitario
- Eliminar productos del carrito
- Cálculo automático del subtotal
- Cálculo automático del total
- Registro de ventas

---

## Historial de ventas

- Listado de ventas
- Búsqueda en tiempo real por número de venta
- Filtro por rango de fechas
- Visualización del detalle de venta
- Paginación
- Resumen estadístico

---

# Base de datos

La estructura de la base de datos es administrada mediante **migraciones de Sequelize**.

Las siguientes tablas son creadas automáticamente:

- products
- sales
- sale_details
- SequelizeMeta

---

# Arquitectura

## Backend

```
Controllers
        │
Services
        │
Repositories
        │
Sequelize ORM
        │
MySQL
```

## Frontend

```
Views
     │
Components
     │
Services
     │
API REST
```

---

# Instalación

## 1. Clonar repositorio

```bash
git clone https://github.com/kevinMejia6/enterprise-pos.git
```

---

# Backend

Ingresar al proyecto

```bash
cd enterprise-pos/backend
```

Instalar dependencias

```bash
npm install
```

---

## Crear la base de datos

Antes de ejecutar las migraciones, crear una base de datos vacía en MySQL:

```sql
CREATE DATABASE enterprise_pos
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

---

## Configurar variables de entorno

Copiar el archivo de ejemplo:

```bash
cp .env.example .env
```

o en Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Configurar el archivo `.env`:

```env
NODE_ENV=development

PORT=3000

DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=enterprise_pos
DB_USER=root
DB_PASSWORD=
DB_DIALECT=mysql

FRONTEND_URL=http://localhost:8080
```

---

## Ejecutar migraciones

```bash
npx sequelize-cli db:migrate
```

Las migraciones crearán automáticamente todas las tablas necesarias del sistema.

---

## Iniciar backend

```bash
npm run dev
```

La API estará disponible en:

```
http://localhost:3000
```

---

# Frontend

Ingresar al proyecto

```bash
cd ../frontend
```

Instalar dependencias

```bash
npm install
```

Iniciar aplicación

```bash
npm run serve
```

Disponible en:

```
http://localhost:8080
```

---

# Endpoints principales

## Productos

| Método | Endpoint |
|---------|----------|
| GET | /api/products |
| GET | /api/products/:id |
| POST | /api/products |
| PUT | /api/products/:id |

---

## Ventas

| Método | Endpoint |
|---------|----------|
| GET | /api/sales |
| GET | /api/sales/:id |
| POST | /api/sales |

---

# Estructura del proyecto

```
enterprise-pos
│
├── backend
│   ├── migrations
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── middlewares
│   │   ├── models
│   │   ├── repositories
│   │   ├── routes
│   │   ├── services
│   │   ├── utils
│   │   └── validations
│   └── package.json
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── components
│   │   ├── router
│   │   ├── services
│   │   ├── styles
│   │   └── views
│   └── package.json
│
└── README.md
```

---

# Flujo de Git

Durante el desarrollo se trabajó utilizando ramas para separar funcionalidades:

| Rama | Descripción |
|------|-------------|
| main | Rama principal del repositorio |
| feature/productos | Desarrollo del módulo de productos |
| feature/ventas | Desarrollo del módulo de ventas e historial |
| ProductionEnv | Rama de integración con la solución final |

Cada funcionalidad fue desarrollada de forma independiente y posteriormente integrada mediante Git.

---

# Características destacadas

- Arquitectura por capas
- Separación de responsabilidades
- Validaciones Backend
- API REST
- Sequelize ORM
- Migraciones para base de datos
- Componentes reutilizables
- Diseño responsivo
- Sidebar reutilizable
- Búsqueda en tiempo real
- Filtros por fecha
- Paginación
- Historial de ventas
- Detalle de venta
- Actualización dinámica de precios en el POS

---

