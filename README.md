# Enterprise POS

Prueba técnica desarrollada para la gestión de productos y ventas utilizando Node.js, Express, Sequelize, MariaDB, Vue.js y Vuetify.

---

# Tecnologías utilizadas

## Backend

- Node.js
- Express.js
- Sequelize ORM
- MariaDB / MySQL
- express-validator

## Frontend

- Vue.js 2
- Vuetify
- Vue Router
- Axios
- SCSS

---

# Arquitectura

Backend

```
Controller
    ↓
Service
    ↓
Repository
    ↓
Sequelize
    ↓
MariaDB
```

Frontend

```
Views
    ↓
Components
    ↓
Services
    ↓
API REST
```

---

# Funcionalidades implementadas

## Productos

- Crear producto
- Editar producto
- Buscar por nombre o código de barras
- Listado de productos
- Estado activo/inactivo
- Imagen del producto

## Punto de Venta

- Agregar productos al carrito
- Modificar cantidad
- Modificar precio antes de registrar la venta
- Eliminar productos del carrito
- Cálculo automático del subtotal y total
- Registro de venta

## Historial de ventas

- Listado de ventas
- Detalle de venta
- Búsqueda en tiempo real
- Filtro por rango de fechas
- Filtro por estado
- Paginación

---

# Base de datos

## Tablas

- products
- sales
- sale_details

---

# Instalación

## 1. Clonar repositorio

```bash
git clone https://github.com/kevinMejia6/enterprise-pos.git
```

---

# Backend

Entrar a la carpeta

```bash
cd backend
```

Instalar dependencias

```bash
npm install
```

Crear archivo

```
.env
```

Ejemplo

```env
PORT=3000

DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=enterprise_pos
DB_USER=root
DB_PASSWORD=tu_password
DB_DIALECT=mysql
```

Ejecutar migraciones

```bash
npx sequelize-cli db:migrate
```

Iniciar servidor

```bash
npm run dev
```

Servidor

```
http://localhost:3000
```

---

# Frontend

Entrar

```bash
cd frontend
```

Instalar dependencias

```bash
npm install
```

Iniciar

```bash
npm run serve
```

Aplicación

```
http://localhost:8080
```

---

# API

## Productos

```
GET     /api/products
GET     /api/products/:id
POST    /api/products
PUT     /api/products/:id
```

## Ventas

```
GET     /api/sales
GET     /api/sales/:id
POST    /api/sales
```

---

# Estructura del proyecto

```
enterprise-pos
│
├── backend
│   ├── migrations
│   ├── src
│   │   ├── controllers
│   │   ├── middlewares
│   │   ├── models
│   │   ├── repositories
│   │   ├── routes
│   │   ├── services
│   │   ├── utils
│   │   └── validations
│
└── frontend
    ├── src
    │   ├── components
    │   ├── router
    │   ├── services
    │   ├── styles
    │   └── views
```

---

# Flujo de Git

El desarrollo se realizó utilizando ramas para cada funcionalidad.

```
main
│
├── feature/productos
│
├── feature/ventas
│
└── ProductionEnv
```

---

# Autor

Kevin Mejía

GitHub

https://github.com/kevinMejia6

---

# Notas

La aplicación fue desarrollada como parte de una prueba técnica, implementando buenas prácticas de arquitectura por capas, separación de responsabilidades y control de versiones mediante Git.
