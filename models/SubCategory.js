module.exports = (sequelize, DataTypes) => {
  const SubCategory = sequelize.define('SubCategory', {
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    self_help: {
      type: DataTypes.STRING,
      allowNull: true
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'sub_categories',
    timestamps: true,
    underscored: true
  });

  SubCategory.associate = (models) => {
    SubCategory.belongsTo(models.Category, {
      foreignKey: 'category_id',
      as: 'category'
    });
    SubCategory.hasMany(models.SubCategoryAddField, {
      foreignKey: 'sub_category_id',
      as: 'add_fields'
    });
    SubCategory.hasMany(models.SubCategoryMandatoryField, {
      foreignKey: 'sub_category_id',
      as: 'mandatory_fields'
    });
  };

  return SubCategory;
};