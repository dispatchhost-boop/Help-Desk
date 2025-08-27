module.exports = (sequelize, DataTypes) => {
  const NdrReason = sequelize.define("NdrReason", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: "tbl_ndr_reasons",
    timestamps: false // since we only have created_at
  });

  return NdrReason;
};
