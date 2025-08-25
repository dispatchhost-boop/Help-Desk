module.exports = (sequelize, DataTypes) => {
  const TblEscalation = sequelize.define("TblEscalation", {
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
    tableName: "tbl_escalations",
    timestamps: true,
    underscored: true
  });

  return TblEscalation;
};
