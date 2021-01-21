'use strict';
require('module-alias/register');
const commentModel = require('@database/comment');

module.exports = (app) => {
  const Comment = app.model.define('comments', commentModel(), {
    tableName: 'comment',
  });

  Comment.associate = () => {
    // 与文章一对一关系
    app.model.Comment.belongsTo(app.model.Article, {
      foreignKey: 'articleId',
      targetKey: 'id',
    });
  };

  return Comment;
};
