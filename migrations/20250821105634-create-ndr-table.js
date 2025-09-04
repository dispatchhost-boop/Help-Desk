"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tbl_ndr", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      ndrRaisedDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      orderId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      pendingSince: {
        type: Sequelize.INTEGER, // number of days pending
        allowNull: true,
      },
      escalationStatus: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      nonDeliveryInfo: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("tbl_ndr");
  },
};
