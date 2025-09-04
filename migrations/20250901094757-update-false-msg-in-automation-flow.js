"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const message = `Dear {{customerName}},

Sorry for the Inconvenience. Your Order {{orderNo}} will be
delivered to you very soon

also

Thanks to share your feedback with us your feed is
very valuable for us to improve our service labile

Thanks ,

Team {{brandName}}`;

    await queryInterface.sequelize.query(`
      UPDATE tbl_automation_flows
      SET false_msg = :message
      WHERE flow_name = 'customer_not_available'
    `, { replacements: { message } });
  },

  async down(queryInterface, Sequelize) {
    // Rollback: clear or reset to previous message
    await queryInterface.sequelize.query(`
      UPDATE tbl_automation_flows
      SET false_msg = NULL
      WHERE flow_name = 'customer_not_available'
    `);
  }
};
