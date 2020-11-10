'use strict';

class AppBootHook {
  constructor(app) {
    this.app = app;
  }
  configWillLoad() {
    require('module-alias/register');
  }
  // async beforeStart() {
  //   const isProd = process.env.NODE_ENV === 'production';
  //   if (isProd) {
  //     await this.app.model.sync({ force: true });
  //   }
  // }
}

module.exports = AppBootHook;
