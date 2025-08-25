'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1) Copy order_id into exp_orders.orderid where empty
    // Only update if orderid is NULL or blank
    await queryInterface.sequelize.query(`
      UPDATE tbl_exp_orders eo
      INNER JOIN tbl_unprocessed_order uo
        ON eo.client_id = uo.client_id
       AND (eo.orderid IS NULL OR eo.orderid = '')
      SET eo.orderid = uo.order_id
      WHERE uo.order_id IS NOT NULL;
    `);

    // Optional: Add index for faster join in future
    await queryInterface.addIndex('tbl_exp_orders', ['orderid'], {
      name: 'idx_exp_orders_orderid'
    });
  },

  async down(queryInterface, Sequelize) {
    // Rollback: clear orderid values we filled
    await queryInterface.sequelize.query(`
      UPDATE tbl_exp_orders
      SET orderid = NULL
      WHERE orderid LIKE 'ORD-%';
    `);

    await queryInterface.removeIndex('tbl_exp_orders', 'idx_exp_orders_orderid');
  }
};
