// models/ExpConsigneeDetails.js
module.exports = (sequelize, DataTypes) => {
  const ExpConsigneeDetails = sequelize.define("ExpConsigneeDetails", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    order_id: DataTypes.INTEGER,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    alternate_phone: DataTypes.STRING,
    address_line1: DataTypes.STRING,
    address_line2: DataTypes.STRING,
    landmark: DataTypes.STRING,
    country: DataTypes.STRING,
    state: DataTypes.STRING,
    city: DataTypes.STRING,
    pincode: DataTypes.STRING,
    billing_same_as_shipping: DataTypes.BOOLEAN,
    billing_first_name: DataTypes.STRING,
    billing_last_name: DataTypes.STRING,
    billing_email: DataTypes.STRING,
    billing_phone: DataTypes.STRING,
    billing_alternate_phone: DataTypes.STRING,
    billing_address_line1: DataTypes.STRING,
    billing_address_line2: DataTypes.STRING,
    billing_landmark: DataTypes.STRING,
    billing_country: DataTypes.STRING,
    billing_state: DataTypes.STRING,
    billing_city: DataTypes.STRING,
    billing_pincode: DataTypes.STRING,
  }, {
    tableName: "tbl_exp_consignee_details",
    timestamps: false
  });

  return ExpConsigneeDetails;
};
