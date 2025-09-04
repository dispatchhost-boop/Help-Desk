module.exports = (sequelize, DataTypes) => {
  const SubCategoryMandatoryField = sequelize.define('SubCategoryMandatoryField', {
    field_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    sub_category_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'sub_category_mandatory_fields',
    timestamps: true,
    underscored: true
  });

  SubCategoryMandatoryField.associate = (models) => {
    SubCategoryMandatoryField.belongsTo(models.SubCategory, {
      foreignKey: 'sub_category_id',
      as: 'sub_category'
    });
  };

  return SubCategoryMandatoryField;
};