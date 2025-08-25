// models/TblExpOrders.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("tbl_exp_orders", {
    id: { 
      type: DataTypes.BIGINT, 
      primaryKey: true, 
      autoIncrement: true 
    },
    channel: { type: DataTypes.STRING },
    ref_number: { type: DataTypes.STRING },
    orderid: { type: DataTypes.STRING },    // careful: sometimes this is BIGINT in DB
    invoice_no: { type: DataTypes.STRING },
    client_id: { type: DataTypes.BIGINT },
    payment_mode: { type: DataTypes.STRING },
    collectable_amount: { type: DataTypes.DECIMAL(10,2) },
    warehouse_id: { type: DataTypes.BIGINT },
    total_weight: { type: DataTypes.DECIMAL(10,2) },
    weight_unit: { type: DataTypes.STRING },
    grand_total: { type: DataTypes.DECIMAL(10,2) },
    total_qty: { type: DataTypes.INTEGER },
    box_qty: { type: DataTypes.INTEGER },
    total_tax: { type: DataTypes.DECIMAL(10,2) },
    total_discount: { type: DataTypes.DECIMAL(10,2) },
    is_unprocessed: { type: DataTypes.TINYINT }, // 0 or 1
    created_at: { type: DataTypes.DATE }
  }, { 
    tableName: "tbl_exp_orders", 
    timestamps: false 
  });
};
