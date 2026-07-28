"use strict";

const {
  Model,
  DataTypes
} = require("sequelize");

class SaleDetail extends Model {
  static initModel(sequelize) {
    SaleDetail.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true
        },

        saleId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          field: "sale_id"
        },

        productId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          field: "product_id"
        },

        productName: {
          type: DataTypes.STRING(150),
          allowNull: false,
          field: "product_name"
        },

        barcode: {
          type: DataTypes.STRING(100),
          allowNull: false
        },

        quantity: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          validate: {
            min: 1
          }
        },

        unitPrice: {
          type: DataTypes.DECIMAL(12, 2),
          allowNull: false,
          field: "unit_price"
        },

        subtotal: {
          type: DataTypes.DECIMAL(12, 2),
          allowNull: false
        }
      },
      {
        sequelize,
        modelName: "SaleDetail",
        tableName: "sale_details",
        timestamps: true,
        underscored: true,
        freezeTableName: true
      }
    );

    return SaleDetail;
  }

  static associate(models) {
    SaleDetail.belongsTo(models.Sale, {
      foreignKey: "saleId",
      as: "sale"
    });

    SaleDetail.belongsTo(models.Product, {
      foreignKey: "productId",
      as: "product"
    });
  }
}

module.exports = SaleDetail;