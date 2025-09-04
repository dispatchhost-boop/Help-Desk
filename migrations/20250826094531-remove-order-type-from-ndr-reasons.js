"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // ✅ Remove column order_type
    await queryInterface.removeColumn("tbl_ndr_reasons", "order_type");
  },

  async down(queryInterface, Sequelize) {
    // ✅ Re-add column if rolled back
    await queryInterface.addColumn("tbl_ndr_reasons", "order_type", {
      type: Sequelize.ENUM("exp", "ecom"),
      allowNull: false,
      defaultValue: "exp"
    });
  }
};
