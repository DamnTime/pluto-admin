module.exports = (app) => {
  const { router, controller } = app;
  router.resources('article', '/admin/article', controller.article);
};
