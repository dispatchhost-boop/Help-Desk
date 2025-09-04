"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const rows = [];
    const now = new Date();

    for (let i = 1; i <= 10; i++) {
      rows.push({
        order_id: 3,                      // sample order_id
        client_id: 186,
        lr_no: Math.floor(1000000000 + Math.random() * 9000000000).toString(), // random AWB
        tagged_api: "XPRESSBEES",
        aggrigator_id: 243,
        forwarder_id: 335,
        insurance_type: null,
        volumetric_weight: 0.22,
        chargable_weight: 0.40,
        base_rate: 152.50,
        total_additional: 20.00,
        total_gst: 31.05,
        total_lr_charges: 192.50,
        status: 9,                        // 🔥 required status
        eta: null,
        billing_status: 0,
        created_at: now,
        pickup_zone: "NORTH",
        destination_zone: "NORTH",
      });
    }

    await queryInterface.bulkInsert("tbl_ecom_lr", rows, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tbl_ecom_lr", { status: 9 }, {});
  },
};
