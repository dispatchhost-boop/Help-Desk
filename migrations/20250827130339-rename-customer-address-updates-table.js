'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Rename old table to new table
    await queryInterface.renameTable('customer_address_updates', 'updated_customer_detail');
  },

  async down(queryInterface, Sequelize) {
    // Rollback: rename new table back to old table
    await queryInterface.renameTable('updated_customer_detail', 'customer_address_updates');
  }
};
