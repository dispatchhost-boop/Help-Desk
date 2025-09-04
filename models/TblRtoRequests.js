module.exports = (sequelize, DataTypes) => {
  const TblRtoRequests = sequelize.define("TblRtoRequests", {
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
    tableName: "tbl_rto_requests",
    timestamps: true,
    underscored: true
  });

  return TblRtoRequests;
};
