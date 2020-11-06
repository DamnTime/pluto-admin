module.exports = () => {
  return async function httpException(ctx, next) {
    try {
      await next();
    } catch (error) {
      const isDev = process.env.NODE_ENV !== 'dev';
      if (isDev) {
        throw error;
      }
      ctx.helper.systemError(ctx);
    }
  };
};
