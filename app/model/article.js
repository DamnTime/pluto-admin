'use strict';
require('module-alias/register');
const articleModel = require('@database/article');

module.exports = (app) => {
  const Article = app.model.define('article', articleModel());

  Article.associate = () => {
    // 与文章标签多对多关系
    app.model.Article.belongsToMany(app.model.ArticleTag, {
      through: app.model.ArticleComposeTag,
      foreignKey: 'articleId',
      otherKey: 'articleTagId',
    });

    // 与文章分类多对一关系
    app.model.Article.belongsTo(app.model.Category, {
      foreignKey: 'id',
      targetKey: 'id',
    });
  };

  return Article;
};
