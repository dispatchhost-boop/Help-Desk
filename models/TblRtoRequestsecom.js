module.exports = (sequelize, DataTypes) => {
  const TblRtoRequestsecom = sequelize.define("TblRtoRequestsecom", {
    id: { 
      type: DataTypes.BIGINT, 
      primaryKey: true, 
      autoIncrement: true 
    },
    order_id: { type: DataTypes.INTEGER, allowNull: false },
    product: { type: DataTypes.STRING },
    payment_mode: { type: DataTypes.STRING },
    pending_since: { type: DataTypes.STRING },
    remarks: { type: DataTypes.TEXT }
  }, {
    tableName: "tbl_rto_requests_ecom",
    timestamps: true,
    underscored: true
  });

  return TblRtoRequestsecom;
};
