// models/tbl_ecom_lr.js
module.exports = (sequelize, DataTypes) => {
  const EcomLR = sequelize.define('EcomLR', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    // order_id: DataTypes.STRING,
      order_id: DataTypes.BIGINT, 

    client_id: DataTypes.INTEGER,
    lr_no: DataTypes.STRING,
    tagged_api: DataTypes.STRING,
    aggrigator_id: DataTypes.INTEGER,
    forwarder_id: DataTypes.INTEGER,
    insurance_type: DataTypes.STRING,
    volumetric_weight: DataTypes.DECIMAL,
    chargable_weight: DataTypes.DECIMAL,
    base_rate: DataTypes.DECIMAL,
    total_additional: DataTypes.DECIMAL,
    total_gst: DataTypes.DECIMAL,
    total_lr_charges: DataTypes.DECIMAL,
    status: DataTypes.INTEGER,
    eta: DataTypes.STRING,
    billing_status: DataTypes.STRING,
    created_at: DataTypes.DATE,
    pickup_zone: DataTypes.STRING,
    destination_zone: DataTypes.STRING
  }, {
    tableName: 'tbl_ecom_lr',
    timestamps: false,
    freezeTableName: true,
  });

  return EcomLR;
};
