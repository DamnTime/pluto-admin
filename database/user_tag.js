const { transformLine } = require('../app/utils/share');
const Sequelize = require('sequelize');
module.exports = () => {
  const { INTEGER, STRING } = Sequelize;
  return transformLine({
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    tagName: STRING,
    color: STRING,
  });
};
