"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add new fields
    await queryInterface.addColumn("call_logs", "name", {
      type: Sequelize.STRING(100),
      allowNull: false,
      defaultValue: "Unknown"
    });
    await queryInterface.addColumn("call_logs", "phone_no", {
      type: Sequelize.STRING(20),
      allowNull: false,
      defaultValue: "0000000000"
    });
    await queryInterface.addColumn("call_logs", "company_name", {
      type: Sequelize.STRING(150),
      allowNull: true,
    });

    // Drop unused fields
    await queryInterface.removeColumn("call_logs", "client_id");
    await queryInterface.removeColumn("call_logs", "notes");
  },

  async down(queryInterface, Sequelize) {
    // Rollback
    await queryInterface.removeColumn("call_logs", "name");
    await queryInterface.removeColumn("call_logs", "phone_no");
    await queryInterface.removeColumn("call_logs", "company_name");

    await queryInterface.addColumn("call_logs", "client_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
    await queryInterface.addColumn("call_logs", "notes", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  }
};
