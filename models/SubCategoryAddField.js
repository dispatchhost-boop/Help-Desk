module.exports = (sequelize, DataTypes) => {
  const SubCategoryAddField = sequelize.define('SubCategoryAddField', {
    field_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sub_category_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'sub_category_add_fields',
    timestamps: true,
    underscored: true
  });

  SubCategoryAddField.associate = (models) => {
    SubCategoryAddField.belongsTo(models.SubCategory, {
      foreignKey: 'sub_category_id',
      as: 'sub_category'
    });
  };

  return SubCategoryAddField;
};