'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('products', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },

      name: {
        type: Sequelize.STRING(150),
        allowNull: false
      },

      barcode: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },

      price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },

      description: {
        type: Sequelize.STRING(500),
        allowNull: true
      },

      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addIndex('products', ['name'], {
      name: 'idx_products_name'
    });

    await queryInterface.addIndex('products', ['barcode'], {
      name: 'idx_products_barcode',
      unique: true
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('products');
  }
};