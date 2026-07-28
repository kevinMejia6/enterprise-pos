"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("sales", {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },

      sale_number: {
        type: Sequelize.STRING(30),
        allowNull: false,
        unique: true
      },

      total_items: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        defaultValue: 0
      },

      subtotal: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0
      },

      total: {
        type: Sequelize.DECIMAL(12, 2),
        allowNull: false,
        defaultValue: 0
      },

      status: {
        type: Sequelize.ENUM(
          "COMPLETED",
          "CANCELLED"
        ),
        allowNull: false,
        defaultValue: "COMPLETED"
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
      "sales",
      ["sale_number"],
      {
        unique: true,
        name: "sales_sale_number_unique"
      }
    );

    await queryInterface.addIndex(
      "sales",
      ["created_at"],
      {
        name: "sales_created_at_index"
      }
    );
  },

  async down(queryInterface) {
    await queryInterface.dropTable("sales");
  }
};