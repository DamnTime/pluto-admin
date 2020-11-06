'use strict';

const userModel = require('../user_tag');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('user_tag', userModel());
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('user_tag');
  },
};
