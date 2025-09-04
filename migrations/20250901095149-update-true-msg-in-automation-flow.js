"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const message = `Dear {{customerName}}
Thank You for shopping with {{brandName}}
Your order {{orderNo}} of Rs {{orderValue}} will be
Reattempt for Delivery to your address
please confirm the suitable date and time.

Thanks

DISPATCH SOLUTION`;

    await queryInterface.sequelize.query(`
      UPDATE tbl_automation_flows
      SET true_msg = :message
      WHERE flow_name = 'customer_not_available'
    `, { replacements: { message } });
  },

  async down(queryInterface, Sequelize) {
    // Rollback: restore the old message
    const oldMessage = `Thank you for shopping with {{brandName}}.
Your order {{orderNo}} of Rs {{orderValue}} will be reattempted.
Please confirm a suitable date/time.
Options: 1. 24 Hrs 2. 48 Hrs 3. 72 Hrs`;

    await queryInterface.sequelize.query(`
      UPDATE tbl_automation_flows
      SET true_msg = :message
      WHERE flow_name = 'customer_not_available'
    `, { replacements: { message: oldMessage } });
  }
};
