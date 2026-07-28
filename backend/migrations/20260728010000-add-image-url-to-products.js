"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("products", "image_url", {
      type: Sequelize.STRING(1000),
      allowNull: true,
      defaultValue: null,
      after: "description"
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn("products", "image_url");
  }
};