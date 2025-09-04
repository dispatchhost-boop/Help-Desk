// models/UnprocessedOrder.js
module.exports = (sequelize, DataTypes) => {
  const UnprocessedOrder = sequelize.define("UnprocessedOrder", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    order_type: DataTypes.STRING,
    order_id: DataTypes.INTEGER,
    po_no: DataTypes.STRING,
    Invoice_amount: DataTypes.DECIMAL,
    invoice_no: DataTypes.STRING,
    consignee_name: DataTypes.STRING,
    quantity: DataTypes.INTEGER,
    category: DataTypes.STRING,
    order_value: DataTypes.DECIMAL,
    hsn_id: DataTypes.STRING,
    origin: DataTypes.STRING,
    destination_state: DataTypes.STRING,
    destination_city: DataTypes.STRING,
    total_boxes: DataTypes.INTEGER,
    consignee_address: DataTypes.STRING,
    order_date: DataTypes.DATE,
    payment_type: DataTypes.STRING,
    total_weight: DataTypes.FLOAT,
    weight_unit: DataTypes.STRING,
    destination_pincode: DataTypes.STRING,
    origin_state: DataTypes.STRING,
    origin_city: DataTypes.STRING,
    origin_pincode: DataTypes.STRING,
    Amount: DataTypes.DECIMAL,
    Check_Favour_Of: DataTypes.STRING,
    Check_Amount: DataTypes.DECIMAL,
    is_unprocessesd: DataTypes.BOOLEAN,
    warehouse_address: DataTypes.STRING,
    warehouse_name: DataTypes.STRING,
    warehouse_contact_person: DataTypes.STRING,
    consignee_phone: DataTypes.STRING,
    consignee_alternate_mobile: DataTypes.STRING,
    client_id: DataTypes.INTEGER,
    consignee_email: DataTypes.STRING,
    warehouse_email: DataTypes.STRING,
  }, {
    tableName: "tbl_unprocessed_order",
    timestamps: false
  });

  return UnprocessedOrder;
};
