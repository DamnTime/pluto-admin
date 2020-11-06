'use strict';
require('module-alias/register');
const categoryModel = require('@database/category');

module.exports = (app) => {
  const Category = app.model.define('categories', categoryModel(), {
    tableName: 'category',
  });

  Category.associate = () => {
    app.model.Category.hasMany(app.model.Article, {
      foreignKey: 'categoryId',
      targetKey: 'id',
    });
  };

  return Category;
};
