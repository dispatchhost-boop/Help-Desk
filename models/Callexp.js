// models/Callexp.js
module.exports = (sequelize, DataTypes) => {
  const Callexp = sequelize.define(
    "Callexp",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      // 🔹 Store client details directly
      name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      phone_no: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      company_name: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      call_connected: {
        type: DataTypes.ENUM("yes", "no"),
        allowNull: false,
      },
      not_connected_reason: {
        type: DataTypes.ENUM("switch_off", "not_attending", "wrong_number"),
        allowNull: true,
      },
      customer_response: {
        type: DataTypes.ENUM("reattempt", "rto", "escalate"),
        allowNull: true,
      },
    },
    {
      tableName: "tbl_call_exp", // ✅ points to your new table
      underscored: true,
      timestamps: true, // created_at & updated_at handled automatically
    }
  );

  Callexp.associate = (models) => {
    // 🔹 Associate with ExpOrders only (since this is for express orders)
    Callexp.belongsTo(models.ExpOrders, {
      foreignKey: "order_id",
      as: "exp_order",
    });
  };

  return Callexp;
};
