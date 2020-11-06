'use strict';
require('module-alias/register');
const userTagModel = require('@database/user_tag');

// const helper = require('@app/extend/helper');

module.exports = (app) => {
  const UserTags = app.model.define('userTags', userTagModel(), {
    tableName: 'user_tag',
  });

  UserTags.associate = () => {
    // app.model.UserTag.belongsToMany(app.model.User, {
    //   through: app.model.UserComposeTag,
    //   foreignKey: 'userId',
    //   otherKey: 'userTagId',
    // });
    // app.model.UserTag.belongsTo(app.model.User, {
    //   foreignKey: 'id',
    //   targetKey: 'id',
    // });
  };

  return UserTags;
};
