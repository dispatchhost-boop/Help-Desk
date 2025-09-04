"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("tbl_ndr", "phoneNumber", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("tbl_ndr", "reAttemptDate", {
      type: Sequelize.DATE,
      allowNull: true,
    });

    await queryInterface.addColumn("tbl_ndr", "address1", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("tbl_ndr", "address2", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.addColumn("tbl_ndr", "remark", {
      type: Sequelize.TEXT,
      allowNull: true,
    });
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("tbl_ndr", "phoneNumber");
    await queryInterface.removeColumn("tbl_ndr", "reAttemptDate");
    await queryInterface.removeColumn("tbl_ndr", "address1");
    await queryInterface.removeColumn("tbl_ndr", "address2");
    await queryInterface.removeColumn("tbl_ndr", "remark");
  },
};
