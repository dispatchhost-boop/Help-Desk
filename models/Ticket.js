// models/Ticket.js
module.exports = (sequelize, DataTypes) => {
  const Ticket = sequelize.define('Ticket', {
    ticket_id: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    awb_or_lr_no: DataTypes.STRING,
    category: DataTypes.STRING,
    sub_category: DataTypes.STRING,
    description: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM('Open', 'In Progress', 'Resolved', 'Closed'),
      defaultValue: 'Open'
    },
    additional_fields: DataTypes.JSON
  }, {
    tableName: 'tbl_support_tickets',
    timestamps: true,
    underscored: true
  });

  return Ticket;
};