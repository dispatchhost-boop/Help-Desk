"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tbl_automation_flows", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      flow_name: {
        type: Sequelize.STRING(100),
        unique: true,
        allowNull: false,
      },
      start_msg: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      true_msg: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      false_msg: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      confirm_msg: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      time_options: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("tbl_automation_flows");
  },
};
