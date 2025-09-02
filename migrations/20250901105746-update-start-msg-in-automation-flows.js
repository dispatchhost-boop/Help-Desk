"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      UPDATE tbl_automation_flows
      SET start_msg = 'Dear {{customerName}}.
Your order (Order ID: {{orderId}}) from {{brandName}} with {{courierName}} AWB#{{awbNo}} is undelivered since you weren’t available.
If it is not true please click on "False".
Else True.'
      WHERE flow_name = 'customer_not_available';
    `);
  },

  async down(queryInterface, Sequelize) {
    // Rollback: reset to the old static message
    await queryInterface.sequelize.query(`
      UPDATE tbl_automation_flows
      SET start_msg = 'Dear XXXX.
Your order from (XXX) with <Courier> AWB#59745099396 is undelivered since you weren’t available.
If it is not true please click on "False".
else True.'
      WHERE flow_name = 'customer_not_available';
    `);
  },
};
