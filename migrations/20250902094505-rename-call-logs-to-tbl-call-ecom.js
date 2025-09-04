'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Rename table from call_logs → tbl_call_ecom
    await queryInterface.renameTable('call_logs', 'tbl_call_ecom');
  },

  async down(queryInterface, Sequelize) {
    // Revert back (in case of rollback)
    await queryInterface.renameTable('tbl_call_ecom', 'call_logs');
  }
};
