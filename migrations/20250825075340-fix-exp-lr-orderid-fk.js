// migrations/20250825075340-fix-exp-lr-orderid-fk.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // First, make sure tbl_exp_lr.order_id is INT and not VARCHAR
    await queryInterface.changeColumn('tbl_exp_lr', 'order_id', {
      type: Sequelize.INTEGER,
      allowNull: false
    });

    // Then add FK to tbl_exp_orders.id
    await queryInterface.addConstraint('tbl_exp_lr', {
      fields: ['order_id'],
      type: 'foreign key',
      name: 'fk_tbl_exp_lr_order_id',
      references: {
        table: 'tbl_exp_orders',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('tbl_exp_lr', 'fk_tbl_exp_lr_order_id');
    await queryInterface.changeColumn('tbl_exp_lr', 'order_id', {
      type: Sequelize.STRING, // fallback if it was string before
      allowNull: false
    });
  }
};
