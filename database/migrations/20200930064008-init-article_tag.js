'use strict';

const articleTagModel = require('../article_tag');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable('article_tag', articleTagModel());
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('article_tag');
  },
};
