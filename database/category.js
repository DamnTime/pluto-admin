const { transformLine } = require('../app/utils/share');
const Sequelize = require('sequelize');
module.exports = () => {
  const { INTEGER, STRING } = Sequelize;
  return transformLine({
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    name: STRING,
    status: {
      // 文章状态 0：禁用 1：正常
      type: INTEGER,
      defaultValue: 0,
    },
  });
};
