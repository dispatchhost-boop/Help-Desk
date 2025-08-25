'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Drop old FK if it exists
    await queryInterface.removeConstraint('tbl_exp_lr', 'fk_lr_order').catch(() => {});

    // Align column type exactly
    await queryInterface.changeColumn('tbl_exp_lr', 'order_id', {
      type: Sequelize.INTEGER.UNSIGNED,   // match parent type exactly
      allowNull: false,
    });

    // Add FK again
    await queryInterface.addConstraint('tbl_exp_lr', {
      fields: ['order_id'],
      type: 'foreign key',
      name: 'fk_lr_order',
      references: {
        table: 'tbl_exp_orders',
        field: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('tbl_exp_lr', 'fk_lr_order');
  }
};
