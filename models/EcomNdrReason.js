// models/EcomNdrReason.js
module.exports = (sequelize, DataTypes) => {
  const EcomNdrReason = sequelize.define("EcomNdrReason", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    order_id: { type: DataTypes.INTEGER, allowNull: false },
    reason: { type: DataTypes.TEXT, allowNull: false },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, {
    tableName: "tbl_ecom_ndr_reasons",
    timestamps: false
  });

  EcomNdrReason.associate = (models) => {
    EcomNdrReason.belongsTo(models.EcomOrder, { foreignKey: "order_id", as: "order" });
  };

  return EcomNdrReason;
};
