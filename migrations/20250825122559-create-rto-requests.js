'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_rto_requests', {
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

      product: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Product name from order'
      },

      payment_mode: {
        type: Sequelize.STRING(20),
        allowNull: true,
        comment: 'COD / Prepaid'
      },

      pending_since: {
        type: Sequelize.STRING(50),
        allowNull: true,
        comment: 'Pending duration like "2 days"'
      },

      remarks: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: 'Remarks entered by user'
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
    await queryInterface.dropTable('tbl_rto_requests');
  }
};
