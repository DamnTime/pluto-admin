/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1600250565685_845';

  // add your middleware config here
  config.middleware = ['exception', 'token'];

  config.security = {
    csrf: false,
  };

  config.jwt = {
    secret: '386484304@qq.com',
  };

  config.validatePlus = {
    resolveError(ctx, errors) {
      if (errors.length) {
        const valiteMsg = errors.map((err) => err.message).join('、');
        ctx.helper.paramsExceptionRes(valiteMsg);
      }
    },
  };

  // add your user config here
  const userConfig = {
    userHighestScope: 999, // 用户最高权限
    token: {
      ignore: '/admin/login',
    },
  };

  return {
    ...config,
    ...userConfig,
  };
};
