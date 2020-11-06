'use strict';

const rule = {
  wordsNumber: [{ required: true, message: '文章字数 wordsNumber 不能为空' }],
  articleTags: [
    { required: true, message: '文章标签 articleTags 不能为空' },
    { type: 'array', message: '文章标签 articleTags 字段需要是数组' },
  ],
};

module.exports = rule;
