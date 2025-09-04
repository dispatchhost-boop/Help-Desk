'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tbl_helpdesk_chat', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      sender_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      receiver_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      is_read: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add indexes
    await queryInterface.addIndex('tbl_helpdesk_chat', ['sender_id', 'receiver_id']);
    await queryInterface.addIndex('tbl_helpdesk_chat', ['created_at']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tbl_helpdesk_chat');
  }
};