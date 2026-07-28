"use strict";

const { Sequelize } = require("sequelize");

const databaseConfig = require("../config/database");

const ProductModel = require("./product.model");
const SaleModel = require("./sale.model");
const SaleDetailModel = require("./sale-detail.model");


const environment =
  process.env.NODE_ENV || "development";

const config = databaseConfig[environment];

if (!config) {
  throw new Error(
    `No existe configuración de base de datos para el ambiente: ${environment}`
  );
}

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: Number(config.port),
    dialect: config.dialect,
    logging: config.logging,
    define: config.define
  }
);

const Product = ProductModel.initModel(sequelize);
const Sale = SaleModel.initModel(sequelize);
const SaleDetail = SaleDetailModel.initModel(sequelize);

const models = {
  Product,
  Sale,
  SaleDetail
};

Object.values(models).forEach((model) => {
  if (typeof model.associate === "function") {
    model.associate(models);
  }
});

module.exports = {
  sequelize,
  Product,
  Sale,
  SaleDetail
};