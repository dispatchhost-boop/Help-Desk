// seeders\20250901103128-seed-ndr-reasons.js
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("tbl_ecom_ndr_reasons", [
      { order_id: 3, order_type: "ecom", reason: "Customer Not Available", created_at: new Date() },
      { order_id: 3, order_type: "ecom", reason: "Incorrect Address Provided", created_at: new Date() },
      { order_id: 3, order_type: "ecom", reason: "Payment Not Ready", created_at: new Date() },
      { order_id: 16, order_type: "ecom", reason: "Customer Not Available", created_at: new Date() },
      { order_id: 16, order_type: "ecom", reason: "Courier Delay", created_at: new Date() },
      { order_id: 16, order_type: "ecom", reason: "Weather Issue", created_at: new Date() },
      { order_id: 63, order_type: "ecom", reason: "Customer Not Available", created_at: new Date() },
      { order_id: 63, order_type: "ecom", reason: "Rescheduled by Customer", created_at: new Date() },
      { order_id: 63, order_type: "ecom", reason: "Customer Not Available", created_at: new Date() },
      { order_id: 63, order_type: "ecom", reason: "Address Not Accessible", created_at: new Date() },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("tbl_ecom_ndr_reasons", null, {});
  },
};
