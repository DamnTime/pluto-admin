'use strict';

const articleModel = require('../article');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('article', articleModel());
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('article');
  },
};
