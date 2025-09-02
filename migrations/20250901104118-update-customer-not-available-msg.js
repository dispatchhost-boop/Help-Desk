"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      UPDATE tbl_automation_flows
      SET start_msg = 'Dear XXXX.\\nYour order from (XXX) with <Courier> AWB#59745099396 is undelivered since you weren’t available.\\nIf it is not true please click on "False".\\n\\nelse True.\\nOption\\nFalse\\n\\nTrue'
      WHERE flow_name = 'customer_not_available'
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      UPDATE tbl_automation_flows
      SET start_msg = 'Dear {{customerName}}, Your order from {{brandName}} with {{courierName}} AWB {{awbNo}} is undelivered since you weren’t available. If true, click "True", else click "False".'
      WHERE flow_name = 'customer_not_available'
    `);
  },
};
