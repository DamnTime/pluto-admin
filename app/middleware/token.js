
module.exports = (options, app) => {
  return async function auth(ctx, next) {
    const _url = ctx.url;
    const currentUrl = _url.startsWith('/') ? _url : `/${_url}`;
    const ignorePath = app.config.tokenIgnore.map(path => {
      return path.indexOf('*') >= 0 ? path.replace('*', '') : path;
    });
    const isIgnore = ignorePath.some(path => currentUrl.startsWith(path));
    if (isIgnore) {
      await next();
    } else {
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
    }
  };
};
