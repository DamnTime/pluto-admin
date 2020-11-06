'use strict';

const categoryModel = require('../category');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('category', categoryModel());
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('category');
  },
};
