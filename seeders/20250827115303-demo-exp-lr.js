"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const rows = [];
    const now = new Date();

    for (let i = 1; i <= 50; i++) {
      const orderId = 32 + i; // ensures unique order_id (26,27,28,...75)

      rows.push({
        order_id: orderId,
        client_id: 186,
        lr_no: Math.floor(1000000000 + Math.random() * 9000000000).toString(), // random 10-digit AWB
        tagged_api: i % 2 === 0 ? "DELHIVERY" : "XPRESSBEES", // alternate couriers
        aggrigator_id: i % 2 === 0 ? 21 : 78,   // match courier choice
        forwarder_id: i % 2 === 0 ? 61 : 263,   // match courier choice
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
  },
};
