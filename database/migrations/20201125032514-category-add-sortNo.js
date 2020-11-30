'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          'category',
          'sort_no',
          { type: Sequelize.DataTypes.INTEGER, defaultValue: 1 },
          { transaction: t }
        ),
      ]);
    });
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('category', 'sort_no', {
          transaction: t,
        }),
      ]);
    });
  },
};
