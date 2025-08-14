'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('tbl_support_tickets', {
      ticket_id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false
      },
      awb_or_lr_no: {
        type: Sequelize.STRING,
        allowNull: true
      },
      category: {
        type: Sequelize.STRING,
        allowNull: true
      },
      sub_category: {
        type: Sequelize.STRING,
        allowNull: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      status: {
        type: Sequelize.ENUM('Open', 'In Progress', 'Resolved', 'Closed'),
        defaultValue: 'Open',
        allowNull: false
      },  
      additional_fields: {
        type: Sequelize.JSON,
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

    // Add indexes
    await queryInterface.addIndex('tbl_support_tickets', ['awb_or_lr_no']);
    await queryInterface.addIndex('tbl_support_tickets', ['status']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('tbl_support_tickets');
  }
};