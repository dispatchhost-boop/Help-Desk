// models/ExpNdrReason.js
module.exports = (sequelize, DataTypes) => {
  const ExpNdrReason = sequelize.define("ExpNdrReason", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    order_id: { type: DataTypes.INTEGER, allowNull: false },
    reason: { type: DataTypes.TEXT, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: "tbl_exp_ndr_reasons",
    timestamps: false
  });

  ExpNdrReason.associate = (models) => {
    ExpNdrReason.belongsTo(models.ExpOrder, { foreignKey: "order_id", as: "order" });
  };

  return ExpNdrReason;
};
