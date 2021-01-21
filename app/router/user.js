module.exports = (app) => {
  const { router, controller } = app;
  router.resources('user', '/admin/user', controller.user);
  router.post('user', '/admin/edit-password', controller.user.updatePassWord);
  router.post('user', '/web/register', controller.user.create);
};
