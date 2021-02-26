require('module-alias/register');
const { tokenExpiresIn } = require('@core/config');
module.exports = (options, app) => {
  return async function auth(ctx, next) {
    const _url = ctx.url;
    const currentUrl = _url.startsWith('/') ? _url : `/${_url}`;
    const ignorePath = app.config.tokenIgnore.map((path) => {
      return path.indexOf('*') >= 0 ? path.replace('*', '') : path;
    });
    const isIgnore = ignorePath.some((path) => currentUrl.startsWith(path));
    if (isIgnore) {
      await next();
    } else {
      const userToken = ctx.cookies.get('_token', {
        signed: false,
      });
      const userInfo = await app.redis.get('userInfo');
      let errMsg = '请尝试重新登录';
      if (!userToken || !userInfo) {
        return ctx.helper.loginExceptionRes(errMsg);
      }
      try {
        const tokenResult = app.jwt.verify(userToken, app.config.jwt.secret);
        const current = Math.floor(Date.now() / 1000);
        // 如果token超过一半时间，重新续命
        if (current > tokenResult.exp - 60 * 30) {
          const refreshToken = await ctx.helper.createToken(userInfo.account);
          await ctx.helper.writeTokenInCookie(refreshToken);
        }
        await next();
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          errMsg = 'token已过期';
        }
        return ctx.helper.loginExceptionRes(errMsg);
      }
    }
  };
};
