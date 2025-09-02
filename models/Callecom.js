// models/CallLog.js
module.exports = (sequelize, DataTypes) => {
  const Callecom = sequelize.define(
    "Callecom",
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
        allowNull: false,
      },
      phone_no: {
        type: DataTypes.STRING(20),
        allowNull: false,
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
      tableName: "tbl_call_ecom",
      underscored: true,
      timestamps: true, // manages created_at & updated_at
    }
  );

  Callecom.associate = (models) => {
    // CallLog can belong to either ExpOrders or EcomOrders
    // Callecom.belongsTo(models.ExpOrders, {
    //   foreignKey: "order_id",
    //   constraints: false,
    //   as: "exp_order",
    // });

    Callecom.belongsTo(models.EcomOrders, {
      foreignKey: "order_id",
      constraints: false,
      as: "ecom_order",
    });
  };

  return Callecom;
};
