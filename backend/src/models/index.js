


// Este archivo se encarga de inicializar la conexión a la base de datos y cargar los modelos definidos en la aplicación. 
// Se utiliza Sequelize como ORM para interactuar con la base de datos.

const { Sequelize } = require('sequelize');
const databaseConfig = require('../config/database');
const ProductModel = require('./product.model');

const environment = process.env.NODE_ENV || 'development';
const config = databaseConfig[environment];

if (!config) {
  throw new Error(
    `No existe configuración de base de datos para el entorno: ${environment}`
  );
}

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

const Product = ProductModel.initModel(sequelize);

const db = {
  sequelize,
  Sequelize,
  Product
};

module.exports = db;