const Controller = require('egg').Controller;
const bcrypt = require('bcryptjs');
const userModel = require('@database/user');
const { toInt } = require('@utils/share');
const { defaultPwd } = require('@core/config');

class UserController extends Controller {
  async index() {
    // 分页查询
    const { ctx, app } = this;
    const query = {
      ...ctx.helper.handlePageQuery(),
      ...ctx.helper.handleConditionSearch([
        { key: 'nickName', fuzzy: true },
        'sex',
      ]),
      include: {
        model: app.model.UserTag,
      },
      attributes: { exclude: ['passWord'] },
    };
    const users = await ctx.model.User.findAndCountAll(query);
    ctx.helper.successRes(
      '获取用户列表成功',
      ctx.helper.handlePagenationRes(users)
    );
  }

  async show() {
    const { ctx, app } = this;
    const result = await ctx.model.User.findOne({
      where: {
        id: toInt(ctx.params.id),
      },
      include: {
        model: app.model.UserTag,
      },
      attributes: { exclude: ['passWord'] },
    });
    ctx.helper.successRes('', result);
  }

  // 创建用户
  async create() {
    const ctx = this.ctx;

    const params = ctx.helper.getBodyParams(userModel());

    const hasUser = await ctx.model.User.findOne({
      where: { account: params.account },
    });
    if (hasUser) {
      return ctx.helper.generalExceptionRes('用户已存在');
    }

    // 用户创建时默认密码
    params.passWord = defaultPwd;

    // 创建事务
    let transaction = null;
    try {
      transaction = await this.ctx.model.transaction();
      // TODO 不能接受role字段

      const user = await ctx.model.User.create(params, { transaction });
      const { userTags = [] } = ctx.request.body;
      // 批量创建 users_compose_tags中间表
      await ctx.model.UserComposeTag.bulkCreate(
        userTags.map((item) => ({ userId: user.id, userTagId: item.id })),
        { transaction }
      );
      await transaction.commit();
      ctx.helper.successRes('新建用户成功', null);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // 编辑用户
  async update() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const user = await ctx.model.User.findByPk(id);
    if (!user) {
      return ctx.helper.generalExceptionRes('用户不存在');
    }

    const params = ctx.helper.getBodyParams(userModel());

    // 创建事务
    let transaction = null;
    try {
      transaction = await this.ctx.model.transaction();
      // TODO 不能接受role字段
      await user.update(params, { transaction });
      // 先删除对应userId的行
      await this.deleteUserComposeUserTagRows(user.id, transaction);
      const { userTags = [] } = ctx.request.body;
      const values = userTags.map((item) => ({
        userId: user.id,
        userTagId: item.id,
      }));
      await ctx.model.UserComposeTag.bulkCreate(values, {
        transaction,
      });
      await transaction.commit();
      ctx.helper.successRes('编辑用户成功', null);
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // 删除 user_compose_user-tag表对应的user行
  async deleteUserComposeUserTagRows(id, transaction) {
    return this.ctx.model.UserComposeTag.destroy({
      where: {
        userId: id,
      },
      force: true,
      transaction,
    });
  }

  // 删除用户
  async destroy() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const user = await ctx.model.User.findByPk(id);
    if (!user) {
      return ctx.helper.generalExceptionRes('用户不存在');
    }
    // 创建事务
    let transaction = null;
    try {
      transaction = await this.ctx.model.transaction();
      await this.deleteUserComposeUserTagRows(user.id, transaction);
      await user.destroy();
      await transaction.commit();
      ctx.helper.successRes('删除用户成功');
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  // 修改密码
  async updatePassWord() {
    const { ctx, app } = this;
    const params = ctx.request.body;
    const validateResult = await ctx.validate('editPwd', {
      oldPassWord: params.oldPassWord,
      passWord: params.passWord,
      comfirmPassWord: params.comfirmPassWord,
    });
    if (!validateResult) return;

    if (params.passWord !== params.comfirmPassWord) {
      return ctx.helper.generalExceptionRes('两次输入密码不一致');
    }

    const userInfo = JSON.parse(await app.redis.get('userInfo'));
    const id = toInt(userInfo.id);
    const user = await ctx.model.User.findOne({
      raw: true,
      where: {
        id,
      },
    });
    if (!user) {
      return ctx.helper.generalExceptionRes('暂无此用户');
    }
    const correct = bcrypt.compareSync(params.oldPassWord, user.passWord);
    if (!correct) {
      return ctx.helper.generalExceptionRes('账号或密码不正确');
    }

    await ctx.model.User.update(params, {
      where: {
        id,
      },
    });
    // 清空redis
    await app.redis.set('userInfo', null);
    ctx.helper.successRes('修改密码成功', null);
  }
}

module.exports = UserController;
