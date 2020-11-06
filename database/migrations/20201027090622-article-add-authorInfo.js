'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          'article',
          'author_id',
          {
            type: Sequelize.DataTypes.INTEGER,
          },
          { transaction: t }
        ),
        queryInterface.addColumn(
          'article',
          'author_name',
          {
            type: Sequelize.DataTypes.STRING,
          },
          { transaction: t }
        ),
      ]);
    });
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('article', 'author_id', {
          transaction: t,
        }),
        queryInterface.removeColumn('article', 'author_name', {
          transaction: t,
        }),
      ]);
    });
  },
};
