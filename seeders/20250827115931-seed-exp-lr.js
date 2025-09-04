"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // 1. Insert orders first
    const orders = [];
    for (let i = 26; i <= 45; i++) {
      orders.push({
        id: i,
        client_id: 186,
        ref_number: `REF-${i}`,
        payment_mode: i % 2 === 0 ? "cod" : "prepaid",
        created_at: now,
      });
    }
    await queryInterface.bulkInsert("tbl_exp_orders", orders, {});

    // 2. Insert LR rows pointing to those orders
    const rows = [];
    for (let i = 1; i <= 20; i++) {
      rows.push({
        order_id: 25 + i, // matches the seeded orders above
        client_id: 186,
        lr_no: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
        tagged_api: i % 2 === 0 ? "DELHIVERY" : "XPRESSBEES",
        aggrigator_id: i % 2 === 0 ? 21 : 78,
        forwarder_id: i % 2 === 0 ? 61 : 263,
        insurance_type: null,
        volumetric_weight: 1.33,
        chargable_weight: 1.33,
        base_rate: i % 2 === 0 ? 81.0 : 109.0,
        total_additional: 65.0,
        total_gst: i % 2 === 0 ? 26.28 : 26.82,
        total_lr_charges: i % 2 === 0 ? 211.0 : 239.0,
        status: 9,
        eta: null,
        billing_status: 0,
        created_at: now,
        pickup_zone: "NORTH",
        destination_zone: "NORTH",
      });
    }
    await queryInterface.bulkInsert("tbl_exp_lr", rows, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tbl_exp_lr", { status: 9 }, {});
    await queryInterface.bulkDelete("tbl_exp_orders", {
      id: { [Sequelize.Op.between]: [26, 45] },
    }, {});
  },
};
