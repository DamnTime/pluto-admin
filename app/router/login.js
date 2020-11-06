module.exports = (app) => {
  app.router.post('/admin/login', app.controller.login.index);
  app.router.post('/admin/loginOut', app.controller.login.loginOut);
};
