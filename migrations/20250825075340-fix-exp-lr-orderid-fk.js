'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1) Remove old foreign key constraint (if exists)
    await queryInterface.removeConstraint('tbl_exp_lr', 'fk_lr_order').catch(() => {});

    // 2) Change order_id column to BIGINT to match tbl_exp_orders.id
    await queryInterface.changeColumn('tbl_exp_lr', 'order_id', {
      type: Sequelize.BIGINT,
      allowNull: false,
    });

    // 3) Add proper foreign key linking tbl_exp_lr.order_id -> tbl_exp_orders.id
    await queryInterface.addConstraint('tbl_exp_lr', {
      fields: ['order_id'],
      type: 'foreign key',
      name: 'fk_lr_order',
      references: {
        table: 'tbl_exp_orders',
        field: 'id', // numeric PK
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert back
    await queryInterface.removeConstraint('tbl_exp_lr', 'fk_lr_order').catch(() => {});
    await queryInterface.changeColumn('tbl_exp_lr', 'order_id', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
