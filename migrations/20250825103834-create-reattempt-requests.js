'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_delivery_reattempts', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },

      order_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        comment: 'Link to tbl_exp_orders or tbl_ecom_orders'
      },

      reason: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Reason for delivery failure (from courier/NDR)'
      },

      is_reason_incorrect: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
        comment: 'If customer marked "Above reason is incorrect"'
      },

      request_for_reattempt: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
        comment: 'Whether customer requested a reattempt'
      },

      reattempted_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
        comment: 'Reattempt delivery date chosen'
      },

      phone: {
        type: Sequelize.STRING(20),
        allowNull: true
      },

      landmark: {
        type: Sequelize.STRING(255),
        allowNull: true
      },

      address_line1: {
        type: Sequelize.STRING(255),
        allowNull: true
      },

      address_line2: {
        type: Sequelize.STRING(255),
        allowNull: true
      },

      city: {
        type: Sequelize.STRING(100),
        allowNull: true
      },

      state: {
        type: Sequelize.STRING(100),
        allowNull: true
      },

      pincode: {
        type: Sequelize.STRING(20),
        allowNull: true
      },

      remarks: {
        type: Sequelize.TEXT,
        allowNull: true
      },

      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },

      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tbl_delivery_reattempts');
  }
};
