require('module-alias/register');
const bcrypt = require('bcryptjs');
const Controller = require('egg').Controller;
const { tokenExpiresIn } = require('@core/config');

class LoginController extends Controller {
  async index() {
    const { ctx, app } = this;
    const { account, passWord } = ctx.request.body;
    const user = await ctx.model.User.findOne({
      raw: true,
      where: {
        account,
      },
    });
    if (!user) {
      return ctx.helper.generalExceptionRes('暂无此用户');
    }
    const correct = bcrypt.compareSync(passWord, user.passWord);
    if (!correct) {
      return ctx.helper.generalExceptionRes('账号或密码不正确');
    }
    const token = await ctx.helper.createToken(account);
    user.token = token;
    delete user.passWord;
    await app.redis.set('userInfo', JSON.stringify(user));
    // 设置token
    await ctx.helper.writeTokenInCookie(token);
    ctx.helper.successRes('登录成功', user);
  }
  // client端登录
  async loginForWeb() {
    const { ctx, app } = this;
    const { account, passWord } = ctx.request.body;
    const user = await ctx.model.User.findOne({
      raw: true,
      where: {
        account,
      },
    });
    if (!user) {
      return ctx.helper.generalExceptionRes('暂无此用户');
    }
    const correct = bcrypt.compareSync(passWord, user.passWord);
    if (!correct) {
      return ctx.helper.generalExceptionRes('账号或密码不正确');
    }
    delete user.passWord;
    await app.redis.set('clientUserInfo', JSON.stringify(user));
    ctx.helper.successRes('登录成功', user);
  }
  // 退出登录
  async loginOut() {
    const { ctx, app } = this;
    await app.redis.set('userInfo', null);
    ctx.helper.successRes('退出登录成功', null);
  }
}

module.exports = LoginController;
