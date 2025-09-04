module.exports = (sequelize, DataTypes) => {
  const Category = sequelize.define('Category', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    raised_from: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'ucp'
    }
  }, {
    tableName: 'categories',
    timestamps: true,
    underscored: true
  });

  Category.associate = (models) => {
    Category.hasMany(models.SubCategory, {
      foreignKey: 'category_id',
      as: 'sub_categories'
    });
  };

  return Category;
};