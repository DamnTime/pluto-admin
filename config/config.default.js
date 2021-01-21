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
  config.jwt = {
    secret: '386484304@qq.com',
  };

  config.multipart = {
    mode: 'file',
  };

  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true,
    },
    domainWhiteList: ['*'],
  };

  config.cors = {
    origin: '*', // 匹配规则  域名+端口  *则为全匹配
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  exports.alinode = {
    appid: '86742',
    secret: 'b48e2e4e70b64caf1859c9d7f57f02222b4d2063',
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
    tokenIgnore: ['/admin/login', '/web/*'],
  };

  return {
    ...config,
    ...userConfig,
  };
};
