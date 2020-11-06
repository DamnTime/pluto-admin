'use strict';
require('module-alias/register');
const userModel = require('@database/user');

// const helper = require('@app/extend/helper');

module.exports = (app) => {
  const User = app.model.define('user', userModel());

  User.associate = () => {
    // app.model.User.hasMany(app.model.UserComposeTag, { foreignKey: 'userId' });
    app.model.User.belongsToMany(app.model.UserTag, {
      through: app.model.UserComposeTag,
      foreignKey: 'userId',
      otherKey: 'userTagId',
    });
  };

  return User;
};
