'use strict';

const userModel = require('../user_compose_tag');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('user_compose_tag', userModel());
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('user_compose_tag');
  },
};
