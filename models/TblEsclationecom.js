module.exports = (sequelize, DataTypes) => {
  const TblEscalationEcom = sequelize.define("TblEscalationEcom", {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      primaryKey: true,
      autoIncrement: true
    },
    order_id: { 
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false 
    },
    reason: { 
      type: DataTypes.STRING(255), 
      allowNull: false 
    },
    remarks: { 
      type: DataTypes.TEXT, 
      allowNull: false 
    }
  }, {
    tableName: "tbl_escalations_ecom",
    timestamps: true,
    underscored: true
  });

  return TblEscalationEcom;
};
