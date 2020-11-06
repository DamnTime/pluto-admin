require('module-alias/register');
const _ = require('lodash');
const { Op } = require('sequelize');
const { RESPONSE_CODE } = require('@core/enums');
const { pagenation } = require('@core/config');
const { toInt } = require('@utils/share');
const { resBaseModel } = require('@utils/helper');

module.exports = {
  // 响应成功
  successRes(msg, content) {
    this.ctx.body = resBaseModel(RESPONSE_CODE.S00, msg || 'SUCCESS', content);
    this.ctx.status = 200;
  },
  // 业务异常
  generalExceptionRes(msg) {
    this.ctx.body = resBaseModel(RESPONSE_CODE.E00, msg || 'ERROR');
    this.ctx.status = 200;
  },
  // 参数校验异常
  paramsExceptionRes(msg) {
    this.ctx.body = resBaseModel(RESPONSE_CODE.E01, msg);
    this.ctx.status = 400;
  },
  // 登录失效
  loginExceptionRes(msg = '登录失效') {
    this.ctx.body = resBaseModel(RESPONSE_CODE.E02, msg);
    this.ctx.status = 401;
  },
  // 404
  notFoundExceptionRes() {
    this.ctx.body = resBaseModel(RESPONSE_CODE.E03, '资源未找到');
    this.ctx.status = 404;
  },
  // 500
  systemError(ctx = this.ctx) {
    ctx.body = resBaseModel(RESPONSE_CODE.E04, '系统异常, 请稍后重试~');
    ctx.status = 500;
  },
  /**
   * 从body中获取model参数
   * @param {model} 数据模型
   * @param {excute} 需要排除的参数
   */
  getBodyParams(model = {}, excute = []) {
    const { body } = this.ctx.request;
    const payload = {};
    Object.keys(model).forEach((item) => {
      if (!excute.includes(item)) {
        payload[item] = body[item];
      }
    });
    return payload;
  },
  // 分页接受参数处理
  handlePageQuery() {
    const {
      query = {},
      request: { body = {} },
    } = this.ctx;
    const offset = toInt(query.page) || toInt(body.page) || pagenation.page;
    const limit =
      toInt(query.pageSize) || toInt(body.pageSize) || pagenation.pageSize;
    return {
      limit:
        toInt(query.pageSize) || toInt(body.pageSize) || pagenation.pageSize,
      offset: (offset - 1) * limit,
      distinct: true,
    };
  },
  // 分页参数返回值
  handlePagenationRes(params) {
    const {
      query = {},
      request: { body = {} },
    } = this.ctx;
    const { count: total, rows: list } = params || {};
    const page = toInt(query.page) || toInt(body.page) || pagenation.page;
    const pageSize =
      toInt(query.pageSize) || toInt(body.pageSize) || pagenation.pageSize;
    const result = {
      total,
      list,
      page,
      pageSize,
      totalPage: _.ceil(total / pageSize),
    };
    return result;
  },
  // 条件搜索
  handleConditionSearch(conditions = []) {
    const condition = {};
    const { query = {} } = this.ctx;
    conditions.forEach((c) => {
      const isObject = typeof c === 'object';
      if (isObject && c.fuzzy && query[c.key]) {
        condition.where = {
          [c.key]: {
            [Op.like]: `%${query[c.key]}%`,
          },
        };
      }
      if (!isObject && query[c]) {
        condition.where = {
          [c]: isNaN(+query[c]) ? query[c] : +query[c],
        };
      }
    });
    return condition;
  },
};
