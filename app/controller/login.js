require('module-alias/register');
const bcrypt = require('bcryptjs');
const Controller = require('egg').Controller;

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

    // 下发token
    const token = app.jwt.sign(
      {
        account,
      },
      app.config.jwt.secret,
      {
        expiresIn: '60m',
      }
    );
    user.token = token;
    delete user.passWord;
    await app.redis.set('userInfo', JSON.stringify(user));
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
