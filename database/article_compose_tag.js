const { transformLine } = require('../app/utils/share');
const Sequelize = require('sequelize');
module.exports = () => {
  const { INTEGER } = Sequelize;
  return transformLine({
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    articleId: INTEGER,
    articleTagId: INTEGER,
  });
};
