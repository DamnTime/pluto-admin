'use strict';
require('module-alias/register');
const ArticleComposeTags = require('@database/article_compose_tag');

module.exports = (app) => {
  const ArticleComposeTag = app.model.define(
    'articleComposeTags',
    ArticleComposeTags(),
    {
      tableName: 'article_compose_tag',
    }
  );

  return ArticleComposeTag;
};
