'use strict';

const userModel = require('../user');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('user', userModel());
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('user');
  },
};
