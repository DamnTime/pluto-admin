const Controller = require('egg').Controller;
const userTagsModel = require('@database/user_tag');
const { toInt } = require('@utils/share');

class UserTagController extends Controller {
  async index() {
    // 分页查询
    const { ctx } = this;
    const query = {
      ...ctx.helper.handlePageQuery(),
      ...ctx.helper.handleConditionSearch([{ key: 'tagName', fuzzy: true }]),
    };
    const userTags = await ctx.model.UserTag.findAndCountAll(query);
    ctx.helper.successRes('获取用户标签列表成功', ctx.helper.handlePagenationRes(userTags));
  }

  // client端获取所有标签
  async fetchAllTagsByWeb() {
    const { ctx } = this;
    ctx.helper.successRes('用户标签列表', await ctx.model.UserTag.findAll());
  }

  // 搜索用户标签 不需要分页
  async searchUserTag() {
    const { ctx } = this;
    const query = {
      ...ctx.helper.handleConditionSearch([{ key: 'tagName', fuzzy: true }]),
    };
    ctx.helper.successRes('用户标签列表', await ctx.model.UserTag.findAll(query));
  }

  async show() {
    const ctx = this.ctx;
    ctx.helper.successRes('获取用户标签详情', await ctx.model.UserTag.findByPk(toInt(ctx.params.id)));
  }

  async create() {
    const ctx = this.ctx;

    const params = ctx.helper.getBodyParams(userTagsModel());

    const hasUserTag = await ctx.model.UserTag.findOne({
      where: { tagName: params.tagName },
    });

    if (hasUserTag) {
      return ctx.helper.generalExceptionRes('用户标签已存在');
    }
    const userTags = await ctx.model.UserTag.create(params);

    ctx.helper.successRes('新增用户标签成功', userTags);
  }

  async update() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const user = await ctx.model.UserTag.findByPk(id);
    if (!user) {
      return ctx.helper.generalExceptionRes('用户标签不存在');
    }
    await user.update(ctx.helper.getBodyParams(userTagsModel()));
    ctx.helper.successRes();
  }

  // 删除标签的之前 检查user_compose_user_tag表是否有关联数据 有则提示并阻断 否则直接删除
  async destroy() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const userTag = await ctx.model.UserTag.findByPk(id);
    if (!userTag) {
      return ctx.helper.generalExceptionRes('用户标签不存在');
    }
    const hasTagInUserComposeUserTag = await ctx.model.UserComposeTag.findAll({
      where: {
        userTagId: id,
      },
    });
    if ((hasTagInUserComposeUserTag || []).length > 0) {
      const ids = hasTagInUserComposeUserTag.map((i) => i.userId);
      return ctx.helper.generalExceptionRes(`该用户标签正在被id为 ${ids.join('、')} 的用户使用, 不能删除`);
    }
    await userTag.destroy();
    ctx.helper.successRes('删除用户标签成功');
  }
}

module.exports = UserTagController;
