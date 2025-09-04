'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // === Shipment (flat) ===
    await queryInterface.addColumn('tbl_support_tickets', 'lr_no', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('tbl_support_tickets', 'order_id', { type: Sequelize.INTEGER, allowNull: true });
    await queryInterface.addColumn('tbl_support_tickets', 'client_id', { type: Sequelize.INTEGER, allowNull: true });
    await queryInterface.addColumn('tbl_support_tickets', 'tagged_api', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('tbl_support_tickets', 'aggregator_id', { type: Sequelize.INTEGER, allowNull: true });
    await queryInterface.addColumn('tbl_support_tickets', 'forwarder_id', { type: Sequelize.INTEGER, allowNull: true });
    await queryInterface.addColumn('tbl_support_tickets', 'shipment_status', { type: Sequelize.INTEGER, allowNull: true }); // from shipment.status
    await queryInterface.addColumn('tbl_support_tickets', 'eta', { type: Sequelize.DATE, allowNull: true });
    await queryInterface.addColumn('tbl_support_tickets', 'pickup_zone', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('tbl_support_tickets', 'destination_zone', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('tbl_support_tickets', 'shipment_created_at', { type: Sequelize.DATE, allowNull: true });

    // === Financial ===
    await queryInterface.addColumn('tbl_support_tickets', 'insurance_type', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('tbl_support_tickets', 'volumetric_weight', { type: Sequelize.DECIMAL(10,3), allowNull: true });
    await queryInterface.addColumn('tbl_support_tickets', 'chargeable_weight', { type: Sequelize.DECIMAL(10,3), allowNull: true });
    await queryInterface.addColumn('tbl_support_tickets', 'base_rate', { type: Sequelize.DECIMAL(12,2), allowNull: true });
    await queryInterface.addColumn('tbl_support_tickets', 'total_additional', { type: Sequelize.DECIMAL(12,2), allowNull: true });
    await queryInterface.addColumn('tbl_support_tickets', 'total_gst', { type: Sequelize.DECIMAL(12,2), allowNull: true });
    await queryInterface.addColumn('tbl_support_tickets', 'total_lr_charges', { type: Sequelize.DECIMAL(12,2), allowNull: true });
    await queryInterface.addColumn('tbl_support_tickets', 'billing_status', { type: Sequelize.STRING, allowNull: true });

    // === Raw snapshots ===
    await queryInterface.addColumn('tbl_support_tickets', 'shipment_details_raw', { type: Sequelize.JSON, allowNull: true });
    await queryInterface.addColumn('tbl_support_tickets', 'weight_details_raw', { type: Sequelize.JSON, allowNull: true });

    // === Notification snapshot / flags ===
    await queryInterface.addColumn('tbl_support_tickets', 'notify_enabled', { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false });
    await queryInterface.addColumn('tbl_support_tickets', 'notify_email_from', { type: Sequelize.STRING, allowNull: true });
    await queryInterface.addColumn('tbl_support_tickets', 'notify_to', { type: Sequelize.JSON, allowNull: true }); // array of emails
    await queryInterface.addColumn('tbl_support_tickets', 'notify_cc', { type: Sequelize.JSON, allowNull: true }); // array of emails
    await queryInterface.addColumn('tbl_support_tickets', 'notify_sent', { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false });
    await queryInterface.addColumn('tbl_support_tickets', 'notify_error', { type: Sequelize.TEXT, allowNull: true });
    await queryInterface.addColumn('tbl_support_tickets', 'notification_raw', { type: Sequelize.JSON, allowNull: true });

    // === Helpful indexes ===
    await queryInterface.addIndex('tbl_support_tickets', ['lr_no']);
    await queryInterface.addIndex('tbl_support_tickets', ['client_id']);
    await queryInterface.addIndex('tbl_support_tickets', ['created_at']);
  },

  down: async (queryInterface, Sequelize) => {
    // Remove indexes first
    await queryInterface.removeIndex('tbl_support_tickets', ['created_at']);
    await queryInterface.removeIndex('tbl_support_tickets', ['client_id']);
    await queryInterface.removeIndex('tbl_support_tickets', ['lr_no']);

    // Notification
    await queryInterface.removeColumn('tbl_support_tickets', 'notification_raw');
    await queryInterface.removeColumn('tbl_support_tickets', 'notify_error');
    await queryInterface.removeColumn('tbl_support_tickets', 'notify_sent');
    await queryInterface.removeColumn('tbl_support_tickets', 'notify_cc');
    await queryInterface.removeColumn('tbl_support_tickets', 'notify_to');
    await queryInterface.removeColumn('tbl_support_tickets', 'notify_email_from');
    await queryInterface.removeColumn('tbl_support_tickets', 'notify_enabled');

    // Raw snapshots
    await queryInterface.removeColumn('tbl_support_tickets', 'weight_details_raw');
    await queryInterface.removeColumn('tbl_support_tickets', 'shipment_details_raw');

    // Financial
    await queryInterface.removeColumn('tbl_support_tickets', 'billing_status');
    await queryInterface.removeColumn('tbl_support_tickets', 'total_lr_charges');
    await queryInterface.removeColumn('tbl_support_tickets', 'total_gst');
    await queryInterface.removeColumn('tbl_support_tickets', 'total_additional');
    await queryInterface.removeColumn('tbl_support_tickets', 'base_rate');
    await queryInterface.removeColumn('tbl_support_tickets', 'chargeable_weight');
    await queryInterface.removeColumn('tbl_support_tickets', 'volumetric_weight');
    await queryInterface.removeColumn('tbl_support_tickets', 'insurance_type');

    // Shipment (flat)
    await queryInterface.removeColumn('tbl_support_tickets', 'shipment_created_at');
    await queryInterface.removeColumn('tbl_support_tickets', 'destination_zone');
    await queryInterface.removeColumn('tbl_support_tickets', 'pickup_zone');
    await queryInterface.removeColumn('tbl_support_tickets', 'eta');
    await queryInterface.removeColumn('tbl_support_tickets', 'shipment_status');
    await queryInterface.removeColumn('tbl_support_tickets', 'forwarder_id');
    await queryInterface.removeColumn('tbl_support_tickets', 'aggregator_id');
    await queryInterface.removeColumn('tbl_support_tickets', 'tagged_api');
    await queryInterface.removeColumn('tbl_support_tickets', 'client_id');
    await queryInterface.removeColumn('tbl_support_tickets', 'order_id');
    await queryInterface.removeColumn('tbl_support_tickets', 'lr_no');
  }
};
