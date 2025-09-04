// migrations/xxxx-create-exp-ndr-reasons.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("tbl_exp_ndr_reasons", {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      order_id: { type: Sequelize.INTEGER, allowNull: false },
      reason: { type: Sequelize.TEXT, allowNull: false },
      created_at: { type: Sequelize.DATE, defaultValue: Sequelize.NOW }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("tbl_exp_ndr_reasons");
  }
};
