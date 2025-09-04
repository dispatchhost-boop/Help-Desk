'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('customer_address_updates', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },

      order_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      name: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      phone: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      updated_address: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      updated_pincode: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },

      status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending',
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Optional: add index for quick lookups by order
    await queryInterface.addIndex('customer_address_updates', ['order_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('customer_address_updates');
  }
};
