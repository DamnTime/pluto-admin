'use strict';

const articleComposeTagModel = require('../article_compose_tag');

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.createTable(
      'article_compose_tag',
      articleComposeTagModel()
    );
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('article_compose_tag');
  },
};
