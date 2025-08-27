module.exports = (sequelize, DataTypes) => {
  const CustomerAddressUpdate = sequelize.define('CustomerAddressUpdate', {
    order_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    updated_address: DataTypes.TEXT,
    updated_pincode: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending'
    }
  }, {
    tableName: 'customer_address_updates',
    timestamps: true,
    underscored: true
  });

  CustomerAddressUpdate.associate = (models) => {
    // 🔗 link with ExpOrders (if that’s the order table you use)
    CustomerAddressUpdate.belongsTo(models.ExpOrders, {
      foreignKey: 'order_id',
      targetKey: 'id',
      as: 'order'
    });
  };

  return CustomerAddressUpdate;
};
