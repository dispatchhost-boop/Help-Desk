"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tbl_ndr_reasons", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      order_type: {
        type: Sequelize.ENUM("exp", "ecom"),
        allowNull: false
      },
      reason: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW")
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("tbl_ndr_reasons");
  }
};
