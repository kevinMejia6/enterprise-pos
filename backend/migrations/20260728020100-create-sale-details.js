"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("sale_details", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },

      sale_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: "sales",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },

      product_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: "products",
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "RESTRICT"
      },

      product_name: {
        type: Sequelize.STRING(150),
        allowNull: false
      },

      barcode: {
        type: Sequelize.STRING(100),
        allowNull: false
      },

      quantity: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
      },

      unit_price: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false
      },

      subtotal: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP"
        )
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP"
        )
      }
    });

    await queryInterface.addIndex(
      "sale_details",
      ["sale_id"],
      {
        name: "sale_details_sale_id_index"
      }
    );

    await queryInterface.addIndex(
      "sale_details",
      ["product_id"],
      {
        name: "sale_details_product_id_index"
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("sale_details");
  }
};