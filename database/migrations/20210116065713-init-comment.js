'use strict';

const commentModel = require('../comment');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('comment', commentModel());
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('comment');
  },
};
