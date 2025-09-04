"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const orders = [];

    // Let's create 50 dummy orders (IDs 26 → 75)
    for (let i = 32; i <= 75; i++) {
      orders.push({
        id: i,                 // 🔑 Must match order_id in tbl_exp_lr seeder
        client_id: 186,        // same as your lr seeder
        ref_number: `REF-${i}`, 
        payment_mode: i % 2 === 0 ? "cod" : "prepaid",
        created_at: now,
        updated_at: now
      });
    }

    await queryInterface.bulkInsert("tbl_exp_orders", orders, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tbl_exp_orders", {
      id: { [Sequelize.Op.between]: [26, 75] }
    }, {});
  }
};
