const { transformLine } = require('../app/utils/share');
const Sequelize = require('sequelize');
module.exports = () => {
  const { INTEGER, STRING, TEXT, DATE } = Sequelize;
  return transformLine({
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    title: STRING, // 文章标题
    categoryId: INTEGER, // 分类id
    categoryName: STRING, // 分类名称
    authorId: INTEGER, // 作者id
    authorName: STRING, // 作者名称
    content: TEXT, // 文章内容
    contentHtml: TEXT, // 文章html内容
    publishTime: DATE, // 发布时间
    cover: STRING, // 封面图
    subMessage: STRING, // 简介
    pageView: {
      // 浏览量
      type: INTEGER,
      defaultValue: 100,
    },
    isEncrypt: {
      // 是否加密
      // 是否加密 0：否 1：是
      type: INTEGER,
      defaultValue: 0,
    },
    wordsNumber: INTEGER, // 文章字数
    status: {
      // 文章状态 0：禁用 1：已发布 2：待发布
      type: INTEGER,
      defaultValue: 2,
    },
  });
};
