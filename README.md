# Enterprise POS

Prueba técnica desarrollada utilizando **Node.js**, **Express.js**, **Sequelize**, **Vue.js 2**, **Vuetify** y **MySQL**.

La aplicación permite administrar productos y registrar ventas mediante un flujo básico de Punto de Venta (POS), cumpliendo con los requerimientos solicitados en la prueba técnica.

---

# Tecnologías utilizadas

## Backend

- Node.js
- Express.js
- Sequelize ORM
- MySQL

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
- Buscar productos por nombre
- Buscar productos por código de barras
- Imagen del producto
- Estado activo/inactivo

Cada producto contiene:

- Nombre
- Precio
- Código de barras

---

## Punto de Venta

- Agregar productos a la venta
- Modificar cantidad
- Editar precio antes de registrar la venta
- Eliminar productos de la venta
- Cálculo automático del subtotal
- Cálculo automático del total
- Registro de la venta

---

## Historial de ventas

- Listado de ventas registradas
- Consulta del detalle de cada venta
- Búsqueda en tiempo real por número de venta
- Filtro por rango de fechas
- Filtro por estado
- Paginación

---

# Base de datos

La solución almacena la información utilizando las siguientes tablas:

- products
- sales
- sale_details

La relación entre las tablas permite mantener correctamente la información de cada venta y los productos asociados.

---

# Arquitectura

## Backend

```
Controllers
      │
      ▼
Services
      │
      ▼
Repositories
      │
      ▼
Sequelize ORM
      │
      ▼
MySQL
```

## Frontend

```
Views
   │
   ▼
Components
   │
   ▼
Services
   │
   ▼
API REST
```

---

# Instalación

## Clonar el repositorio

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

Crear el archivo `.env`

```env
PORT=3000

DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=enterprise_pos
DB_USER=root
DB_PASSWORD=TU_PASSWORD
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

La API quedará disponible en:

```
http://localhost:3000
```

---

# Frontend

Ingresar al proyecto

```bash
cd enterprise-pos/frontend
```

Instalar dependencias

```bash
npm install
```

Iniciar aplicación

```bash
npm run serve
```

La aplicación quedará disponible en:

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
│   │   ├── controllers
│   │   ├── middlewares
│   │   ├── models
│   │   ├── repositories
│   │   ├── routes
│   │   ├── services
│   │   ├── utils
│   │   └── validations
│   │
│   ├── package.json
│   └── .env
│
└── frontend
    ├── public
    ├── src
    │   ├── components
    │   ├── router
    │   ├── services
    │   ├── styles
    │   └── views
    │
    └── package.json
```

---

# Control de versiones

El desarrollo fue realizado utilizando ramas independientes para separar los entregables.

```
main
│
├── feature/productos
│
├── feature/ventas
│
└── ProductionEnv
```

### feature/productos

Incluye:

- Administración de productos
- CRUD de productos
- Búsqueda de productos
- Componentes relacionados con productos

### feature/ventas

Incluye:

- Registro de ventas
- Historial de ventas
- Detalle de ventas
- Filtros
- Paginación
- Componentes relacionados con ventas

### ProductionEnv

Rama final que integra todos los entregables solicitados en la prueba técnica.



# Notas

Este proyecto fue desarrollado como solución para la prueba técnica solicitada, utilizando la arquitectura propuesta por el desarrollador y respetando los requerimientos funcionales indicados en el documento de evaluación.

El desarrollo incluye:

- Separación por capas en el backend.
- Persistencia mediante Sequelize.
- Migraciones para la creación de la base de datos.
- Separación de entregables mediante ramas de Git.
- Integración final en la rama **ProductionEnv**.
