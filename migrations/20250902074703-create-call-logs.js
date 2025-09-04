"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("call_logs", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      order_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      // 🔹 Store client details directly
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      phone_no: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      company_name: {
        type: Sequelize.STRING(150),
        allowNull: true,
      },
      call_connected: {
        type: Sequelize.ENUM("yes", "no"),
        allowNull: false,
      },
      not_connected_reason: {
        type: Sequelize.ENUM("switch_off", "not_attending", "wrong_number"),
        allowNull: true,
      },
      customer_response: {
        type: Sequelize.ENUM("reattempt", "rto", "escalate"),
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("call_logs");
  },
};
