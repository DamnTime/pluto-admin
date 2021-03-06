/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = () => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  config.sequelize = {
    dialect: 'mysql',
    host: 'pluto_mysql',
    port: 3306,
    database: 'pluto',
    username: 'admin',
    password: 'yogurt328617',
    timezone: '+08:00',
    dialectOptions: {
      // 避免读取时间时，还是会返回UTC格式
      dateStrings: true,
      typeCast(field, next) {
        if (field.type === 'DATETIME') {
          return field.string();
        }
        return next();
      },
    },
    define: {
      timestamps: true,
      paranoid: true,
      underscored: true,
      freezeTableName: true,
    },
  };

  config.redis = {
    client: {
      port: 6379,
      host: 'pluto_redis',
      password: '123456',
      db: 0,
    },
  };

  return {
    ...config,
  };
};
