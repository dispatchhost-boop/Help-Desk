// models/index.js
const sequelize = require('../config/sequelize');
const { DataTypes } = require('sequelize');

// Initialize all models
const Category = require('./Category')(sequelize, DataTypes);
const SubCategory = require('./SubCategory')(sequelize, DataTypes);
const SubCategoryAddField = require('./SubCategoryAddField')(sequelize, DataTypes);
const SubCategoryMandatoryField = require('./SubCategoryMandatoryField')(sequelize, DataTypes);
const Ticket = require('./Ticket')(sequelize, DataTypes);

// Set up associations
Category.associate({ SubCategory, SubCategoryAddField, SubCategoryMandatoryField });
SubCategory.associate({ Category, SubCategoryAddField, SubCategoryMandatoryField });
SubCategoryAddField.associate({ SubCategory });
SubCategoryMandatoryField.associate({ SubCategory });

module.exports = { sequelize, Category, SubCategory, SubCategoryAddField, SubCategoryMandatoryField, Ticket
};