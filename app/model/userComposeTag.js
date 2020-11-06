'use strict';
require('module-alias/register');
const usersComposeTags = require('@database/user_compose_tag');

module.exports = (app) => {
  const UserComposeTags = app.model.define(
    'userComposeTags',
    usersComposeTags(),
    {
      tableName: 'user_compose_tag',
    }
  );

  return UserComposeTags;
};
