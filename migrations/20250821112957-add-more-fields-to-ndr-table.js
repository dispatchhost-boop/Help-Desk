"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("tbl_ndr", "action", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("tbl_ndr", "reasonRemark", {
      type: Sequelize.TEXT,
      allowNull: true,
    });

    await queryInterface.addColumn("tbl_ndr", "actionTakenBy", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("tbl_ndr", "attempt", {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
    });

    await queryInterface.addColumn("tbl_ndr", "callRecording", {
      type: Sequelize.STRING, // store file path or URL
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("tbl_ndr", "action");
    await queryInterface.removeColumn("tbl_ndr", "reasonRemark");
    await queryInterface.removeColumn("tbl_ndr", "actionTakenBy");
    await queryInterface.removeColumn("tbl_ndr", "attempt");
    await queryInterface.removeColumn("tbl_ndr", "callRecording");
  },
};
