'use strict';
require('module-alias/register');
const articleTagModel = require('@database/article_tag');

module.exports = (app) => {
  const ArticleTag = app.model.define('articleTags', articleTagModel(), {
    tableName: 'article_tag',
  });

  return ArticleTag;
};
