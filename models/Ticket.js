// models/Ticket.js
module.exports = (sequelize, DataTypes) => {
  const Ticket = sequelize.define(
    'Ticket',
    {
      ticket_id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },

      // Core
      awb_or_lr_no: DataTypes.STRING,
      category: DataTypes.STRING,
      sub_category: DataTypes.STRING,
      description: DataTypes.TEXT,
      status: {
        type: DataTypes.ENUM('Open', 'In Progress', 'Resolved', 'Closed'),
        allowNull: false,
        defaultValue: 'Open',
      },
      additional_fields: DataTypes.JSON,

      // ---- Shipment (flattened to match your DB) ----
      lr_no: DataTypes.STRING,
      order_id: DataTypes.INTEGER,
      client_id: DataTypes.INTEGER,
      tagged_api: DataTypes.STRING,
      aggregator_id: DataTypes.INTEGER,  // note: source field is "aggrigator_id"
      forwarder_id: DataTypes.INTEGER,
      shipment_status: DataTypes.INTEGER,
      eta: DataTypes.DATE,
      pickup_zone: DataTypes.STRING,
      destination_zone: DataTypes.STRING,
      shipment_created_at: DataTypes.DATE,

      // Financials
      insurance_type: DataTypes.STRING,
      volumetric_weight: DataTypes.STRING,  // keep as string to avoid precision mismatches
      chargeable_weight: DataTypes.STRING,
      base_rate: DataTypes.STRING,
      total_additional: DataTypes.STRING,
      total_gst: DataTypes.STRING,
      total_lr_charges: DataTypes.STRING,
      billing_status: DataTypes.STRING,

      // Raw JSON snapshots (present in your table)
      shipment_details_raw: DataTypes.JSON,
      weight_details_raw: DataTypes.JSON,

      // ---- Notification columns ----
      notify_enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      notify_email_from: DataTypes.STRING,
      notify_to: DataTypes.JSON,   // array of emails
      notify_cc: DataTypes.JSON,   // array of emails
      notify_sent: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      notify_error: DataTypes.TEXT,

      // optional: if you also created notification_raw
      notification_raw: DataTypes.JSON,
    },
    {
      tableName: 'tbl_support_tickets',
      timestamps: true,
      underscored: true, // created_at / updated_at columns
    }
  );

  Ticket.prototype.toApiResponse = function () {
    const createdAt = this.get('created_at') || this.get('createdAt') || null;

    const shipment_details = {
      lr_info: {
        lr_no: this.get('lr_no'),
        order_id: this.get('order_id'),
        client_id: this.get('client_id'),
        tagged_api: this.get('tagged_api'),
        aggregator_id: this.get('aggregator_id'),
        forwarder_id: this.get('forwarder_id'),
        status: this.get('shipment_status'),
        eta: this.get('eta'),
        pickup_zone: this.get('pickup_zone'),
        destination_zone: this.get('destination_zone'),
        created_at: this.get('shipment_created_at'),
      },
      financial_details: {
        insurance_type: this.get('insurance_type'),
        volumetric_weight: this.get('volumetric_weight'),
        chargeable_weight: this.get('chargeable_weight'),
        base_rate: this.get('base_rate'),
        total_additional: this.get('total_additional'),
        total_gst: this.get('total_gst'),
        total_lr_charges: this.get('total_lr_charges'),
        billing_status: this.get('billing_status'),
      },
      weight_details: this.get('weight_details_raw') || null,
    };

    const issue_details = {
      category: this.get('category'),
      sub_category: this.get('sub_category'),
      description: this.get('description'),
      additional_fields: this.get('additional_fields') || null,
    };

    const notification = {
      enabled: !!this.get('notify_enabled'),
      email_from: this.get('notify_email_from') || null,
      to: Array.isArray(this.get('notify_to')) ? this.get('notify_to') : [],
      cc: Array.isArray(this.get('notify_cc')) ? this.get('notify_cc') : [],
      sent: !!this.get('notify_sent'),
      error: this.get('notify_error') || null,
    };

    return {
      success: true,
      ticket_id: this.get('ticket_id'),
      created_at: createdAt ? new Date(createdAt).toISOString() : null,
      shipment_details,
      issue_details,
      notification,
    };
  };

  return Ticket;
};
