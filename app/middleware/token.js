// const basicAuth = require('basic-auth');

module.exports = (options, app) => {
  return async function auth(ctx, next) {
    // const userToken = basicAuth(ctx.req);
    const userToken = ctx.header.token;
    const userInfo = await app.redis.get('userInfo');

    let errMsg = '请尝试重新登录';
    if (!userToken || !userInfo) {
      return ctx.helper.loginExceptionRes(errMsg);
    }
    try {
      app.jwt.verify(userToken, app.config.jwt.secret);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        errMsg = 'token已过期';
      }
      return ctx.helper.loginExceptionRes(errMsg);
    }
    await next();
  };
};
