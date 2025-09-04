// models/TblDeliveryReattempts.js
module.exports = (sequelize, DataTypes) => {
  const TblDeliveryReattempts = sequelize.define("TblDeliveryReattempts", {
    id: { 
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    order_id: { 
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      comment: 'Link to tbl_exp_orders or tbl_ecom_orders'
    },
    reason: { 
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Reason for delivery failure (from courier/NDR)'
    },
    is_reason_incorrect: { 
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
      comment: 'If customer marked "Above reason is incorrect"'
    },
    request_for_reattempt: { 
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
      comment: 'Whether customer requested a reattempt'
    },
    reattempted_date: { 
      type: DataTypes.DATEONLY,
      allowNull: true,
      comment: 'Reattempt delivery date chosen'
    },
    phone: { type: DataTypes.STRING(20), allowNull: true },
    landmark: { type: DataTypes.STRING(255), allowNull: true },
    address_line1: { type: DataTypes.STRING(255), allowNull: true },
    address_line2: { type: DataTypes.STRING(255), allowNull: true },
    city: { type: DataTypes.STRING(100), allowNull: true },
    state: { type: DataTypes.STRING(100), allowNull: true },
    pincode: { type: DataTypes.STRING(20), allowNull: true },
    remarks: { type: DataTypes.TEXT, allowNull: true }
  }, {
    tableName: "tbl_delivery_reattempts",
    timestamps: true,     // adds created_at, updated_at
    underscored: true     // ensures snake_case mapping
  });

  return TblDeliveryReattempts;
};
