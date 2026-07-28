"use strict";

const {
  Model,
  DataTypes
} = require("sequelize");

class Sale extends Model {
  static initModel(sequelize) {
    Sale.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true
        },

        saleNumber: {
          type: DataTypes.STRING(30),
          allowNull: false,
          unique: true,
          field: "sale_number"
        },

        totalItems: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: false,
          defaultValue: 0,
          field: "total_items"
        },

        subtotal: {
          type: DataTypes.DECIMAL(12, 2),
          allowNull: false,
          defaultValue: 0
        },

        total: {
          type: DataTypes.DECIMAL(12, 2),
          allowNull: false,
          defaultValue: 0
        },

        status: {
          type: DataTypes.ENUM(
            "COMPLETED",
            "CANCELLED"
          ),
          allowNull: false,
          defaultValue: "COMPLETED"
        }
      },
      {
        sequelize,
        modelName: "Sale",
        tableName: "sales",
        timestamps: true,
        underscored: true,
        freezeTableName: true
      }
    );

    return Sale;
  }

  static associate(models) {
    Sale.hasMany(models.SaleDetail, {
      foreignKey: "saleId",
      as: "details"
    });
  }
}

module.exports = Sale;