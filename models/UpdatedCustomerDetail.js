'use strict';
module.exports = (sequelize, DataTypes) => {
  const UpdatedCustomerDetail = sequelize.define('UpdatedCustomerDetail', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    order_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
    updated_address: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    updated_pincode: {
      type: DataTypes.STRING(10),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'rejected'),
      defaultValue: 'pending'
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    tableName: 'updated_customer_detail',
    timestamps: false // since you already manage created_at, updated_at
  });

  return UpdatedCustomerDetail;
};
