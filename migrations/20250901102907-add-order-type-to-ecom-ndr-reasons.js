"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("tbl_ecom_ndr_reasons", "order_type", {
      type: Sequelize.STRING(50),
      allowNull: true,
      after: "order_id", // MySQL only, places after order_id
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("tbl_ecom_ndr_reasons", "order_type");
  },
};
