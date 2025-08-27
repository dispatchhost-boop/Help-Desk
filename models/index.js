// models/index.js
const sequelize = require('../config/sequelize');
const { DataTypes } = require('sequelize');

// ---- Import Models ----
const Category                  = require('./Category')(sequelize, DataTypes);
const SubCategory               = require('./SubCategory')(sequelize, DataTypes);
const SubCategoryAddField       = require('./SubCategoryAddField')(sequelize, DataTypes);
const SubCategoryMandatoryField = require('./SubCategoryMandatoryField')(sequelize, DataTypes);
const Ticket                    = require('./Ticket')(sequelize, DataTypes);

const ExpOrders                 = require('./TblExpOrders')(sequelize, DataTypes);
const ExpLR                     = require('./tbl_exp_lr')(sequelize, DataTypes);
const ExpProductDetails         = require('./TblExpProductDetails')(sequelize, DataTypes);
const ConsigneeDetails          = require('./ExpConsigneeDetails')(sequelize, DataTypes);

const EcomOrders                = require('./TblEcomOrders')(sequelize, DataTypes);
const EcomLR                    = require('./tbl_ecom_lr')(sequelize, DataTypes);
const EcomProductDetails        = require('./TblEcomProductDetails')(sequelize, DataTypes);
const EcomConsigneeDetails      = require('./TblEcomConsigneeDetails')(sequelize, DataTypes);

const Admin                     = require('./Admin')(sequelize, DataTypes);
const SupportTicket             = require('./SupportTicket')(sequelize, DataTypes);
const TblDeliveryReattempts   = require('./TblDeliveryReattempts')(sequelize, DataTypes);
const TblRtoRequests   = require('./TblRtoRequests')(sequelize, DataTypes);
const TblEscalation   = require('./TblEscalation')(sequelize, DataTypes);
const ExpNdrReason = require('./ExpNdrReason')(sequelize, DataTypes);
const EcomNdrReason = require('./EcomNdrReason')(sequelize, DataTypes);
const NdrReason = require('./ndrReason')(sequelize, DataTypes);
const CustomerAddressUpdate = require('./customer_address_update')(sequelize, DataTypes);

// ---- Associations ----
Category.associate?.({ SubCategory, SubCategoryAddField, SubCategoryMandatoryField });
SubCategory.associate?.({ Category, SubCategoryAddField, SubCategoryMandatoryField });
SubCategoryAddField.associate?.({ SubCategory });
SubCategoryMandatoryField.associate?.({ SubCategory });

/**
 * ======================
 * EXPRESS ORDER ECOSYSTEM
 * ======================
 */

// ExpOrders ↔ ExpLR
ExpOrders.hasMany(ExpLR, {
  foreignKey: 'order_id',   // tbl_exp_lr.order_id INT
  sourceKey: 'id',
  as: 'exp_lrs'
});
ExpLR.belongsTo(ExpOrders, {
  foreignKey: 'order_id',
  targetKey: 'id',
  as: 'exp_order'
});

// ExpOrders ↔ ExpProductDetails
ExpOrders.hasMany(ExpProductDetails, {
  foreignKey: 'order_id',   // tbl_exp_product_details.order_id INT
  sourceKey: 'id',
  as: 'products'
});
ExpProductDetails.belongsTo(ExpOrders, {
  foreignKey: 'order_id',
  targetKey: 'id',
  as: 'exp_order'
});

// ExpOrders ↔ ConsigneeDetails
ExpOrders.hasOne(ConsigneeDetails, {
  foreignKey: 'order_id',   // tbl_exp_consignee_details.order_id INT
  sourceKey: 'id',
  as: 'consignee'
});
ConsigneeDetails.belongsTo(ExpOrders, {
  foreignKey: 'order_id',
  targetKey: 'id',
  as: 'exp_order'
});

// ExpOrders ↔ Admin
ExpOrders.belongsTo(Admin, {
  foreignKey: 'client_id',
  targetKey: 'id',
  as: 'client'
});
Admin.hasMany(ExpOrders, {
  foreignKey: 'client_id',
  sourceKey: 'id',
  as: 'exp_orders'
});

/**
 * ======================
 * ECOM ORDER ECOSYSTEM
 * ======================
 */

// EcomOrders ↔ EcomLR
EcomOrders.hasMany(EcomLR, {
  foreignKey: 'order_id',   // tbl_ecom_lr.order_id INT
  sourceKey: 'id',
  as: 'ecom_lrs'
});
EcomLR.belongsTo(EcomOrders, {
  foreignKey: 'order_id',
  targetKey: 'id',
  as: 'ecom_order'
});

// EcomOrders ↔ EcomProductDetails
EcomOrders.hasMany(EcomProductDetails, {
  foreignKey: 'order_id',   // tbl_ecom_product_details.order_id INT
  sourceKey: 'id',
  as: 'products'
});
EcomProductDetails.belongsTo(EcomOrders, {
  foreignKey: 'order_id',
  targetKey: 'id',
  as: 'ecom_order'
});

// EcomOrders ↔ EcomConsigneeDetails
EcomOrders.hasOne(EcomConsigneeDetails, {
  foreignKey: 'order_id',   // tbl_ecom_consignee_details.order_id INT
  sourceKey: 'id',
  as: 'consignee'
});
EcomConsigneeDetails.belongsTo(EcomOrders, {
  foreignKey: 'order_id',
  targetKey: 'id',
  as: 'ecom_order'
});

// EcomOrders ↔ Admin
EcomOrders.belongsTo(Admin, {
  foreignKey: 'client_id',
  targetKey: 'id',
  as: 'client'
});
Admin.hasMany(EcomOrders, {
  foreignKey: 'client_id',
  sourceKey: 'id',
  as: 'ecom_orders'
});

/**
 * ======================
 * EXPORT MODELS
 * ======================
 */
module.exports = {
  sequelize,
  Category, SubCategory, SubCategoryAddField, SubCategoryMandatoryField,
  Ticket, SupportTicket,
  ExpOrders, ExpLR, ExpProductDetails, ConsigneeDetails,
  EcomOrders, EcomLR, EcomProductDetails, EcomConsigneeDetails,
  Admin,TblDeliveryReattempts,TblRtoRequests, TblEscalation, ExpNdrReason, EcomNdrReason, NdrReason, CustomerAddressUpdate
};
