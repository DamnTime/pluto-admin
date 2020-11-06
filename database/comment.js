const { transformLine } = require('../app/utils/share');
const Sequelize = require('sequelize');
module.exports = () => {
  const { INTEGER, STRING, TEXT } = Sequelize;
  return transformLine({
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    articleId: INTEGER, // 文章id
    pId: INTEGER, // 父级id
    sourceContent: TEXT, // 父级内容
    content: TEXT, // 评价内容
    commentUserId: INTEGER, // 评价人id
    nickName: STRING, // 评价人昵称
    headImg: STRING, // 评价人头像
    isAuthor: {
      // 是否是作者 0:否 1:是
      type: INTEGER,
      defaultValue: 0,
    },
    status: {
      // 0:删除 1:正常
      type: INTEGER,
      defaultValue: 1,
    },
  });
};
