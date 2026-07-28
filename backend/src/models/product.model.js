"use strict";

const {
  Model,
  DataTypes
} = require("sequelize");

class Product extends Model {
  static initModel(sequelize) {
    Product.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true
        },

        name: {
          type: DataTypes.STRING(150),
          allowNull: false
        },

        barcode: {
          type: DataTypes.STRING(100),
          allowNull: false,
          unique: true
        },

        price: {
          type: DataTypes.DECIMAL(12, 2),
          allowNull: false,
          validate: {
            min: 0.01
          }
        },

        description: {
          type: DataTypes.STRING(500),
          allowNull: true
        },

        imageUrl: {
          type: DataTypes.STRING(1000),
          allowNull: true,
          defaultValue: null,
          field: "image_url"
        },

        active: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true
        }
      },
      {
        sequelize,
        modelName: "Product",
        tableName: "products",
        timestamps: true,
        underscored: true,
        freezeTableName: true
      }
    );

    return Product;
  }

  static associate(models) {
    Product.hasMany(models.SaleDetail, {
      foreignKey: "productId",
      as: "saleDetails"
    });
  }
  
}

module.exports = Product;