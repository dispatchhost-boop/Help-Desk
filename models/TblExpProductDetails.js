// models/TblEcomProductDetails.js
module.exports = (sequelize, DataTypes) => {
  return sequelize.define("tbl_ecom_product_details", {
    id: { 
      type: DataTypes.BIGINT, 
      primaryKey: true, 
      autoIncrement: true 
    },
    order_id: { 
      type: DataTypes.BIGINT, 
      allowNull: false 
    },
    category: { 
      type: DataTypes.STRING(255), 
      allowNull: true 
    },
    name: { 
      type: DataTypes.STRING(255), 
      allowNull: false 
    },
    price: { 
      type: DataTypes.DECIMAL(10,2), 
      allowNull: false 
    },
    sku: { 
      type: DataTypes.STRING(100), 
      allowNull: true 
    },
    quantity: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    discount_value: { 
      type: DataTypes.DECIMAL(10,2), 
      allowNull: true 
    },
    discount_type: { 
      type: DataTypes.STRING(50), 
      allowNull: true 
    },
    tax_type: { 
      type: DataTypes.STRING(50), 
      allowNull: true 
    }
  }, { 
    tableName: "tbl_ecom_product_details", 
    timestamps: false 
  });
};
