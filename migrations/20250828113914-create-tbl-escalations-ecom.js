'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_escalations_ecom', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      order_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false
        // references: { model: 'tbl_exp_orders', key: 'id' }, // optional
        // onUpdate: 'CASCADE',
        // onDelete: 'CASCADE'
      },
      reason: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      remarks: {
        type: Sequelize.TEXT,
        allowNull: false
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tbl_escalations_ecom');
  }
};
