// models/TblEcomConsigneeDetails.js
module.exports = (sequelize, DataTypes) => {
  const EcomConsigneeDetails = sequelize.define("EcomConsigneeDetails", {
    id: { 
      type: DataTypes.BIGINT, 
      primaryKey: true, 
      autoIncrement: true 
    },
    order_id: { type: DataTypes.BIGINT },
    first_name: { type: DataTypes.STRING },
    last_name: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING },
    alternate_phone: { type: DataTypes.STRING },
    address_line1: { type: DataTypes.STRING },
    address_line2: { type: DataTypes.STRING },
    landmark: { type: DataTypes.STRING },
    country: { type: DataTypes.STRING },
    state: { type: DataTypes.STRING },
    city: { type: DataTypes.STRING },
    pincode: { type: DataTypes.STRING },

    billing_same_as_shipping: { type: DataTypes.BOOLEAN },
    billing_first_name: { type: DataTypes.STRING },
    billing_last_name: { type: DataTypes.STRING },
    billing_email: { type: DataTypes.STRING },
    billing_phone: { type: DataTypes.STRING },
    billing_alternate_phone: { type: DataTypes.STRING },
    billing_address_line1: { type: DataTypes.STRING },
    billing_address_line2: { type: DataTypes.STRING },
    billing_landmark: { type: DataTypes.STRING },
    billing_country: { type: DataTypes.STRING },
    billing_state: { type: DataTypes.STRING },
    billing_city: { type: DataTypes.STRING },
    billing_pincode: { type: DataTypes.STRING }
  }, {
    tableName: "tbl_ecom_consignee_details",
    timestamps: false
  });

  return EcomConsigneeDetails;
};
 