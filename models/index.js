// models/index.js
const sequelize = require('../config/sequelize'); // <-- important (was ./sequelize)
const { DataTypes } = require('sequelize');

const CategoryFactory = require('./Category');
const SubCategoryFactory = require('./SubCategory');
const SubCategoryAddFieldFactory = require('./SubCategoryAddField');
const SubCategoryMandatoryFieldFactory = require('./SubCategoryMandatoryField');

const Category = CategoryFactory(sequelize, DataTypes);
const SubCategory = SubCategoryFactory(sequelize, DataTypes);
const SubCategoryAddField = SubCategoryAddFieldFactory(sequelize, DataTypes);
const SubCategoryMandatoryField = SubCategoryMandatoryFieldFactory(sequelize, DataTypes);

// Associations
Category.associate({ SubCategory, SubCategoryAddField, SubCategoryMandatoryField });
SubCategory.associate({ Category, SubCategoryAddField, SubCategoryMandatoryField });
SubCategoryAddField.associate({ SubCategory });
SubCategoryMandatoryField.associate({ SubCategory });

module.exports = { sequelize, Category, SubCategory, SubCategoryAddField, SubCategoryMandatoryField };
