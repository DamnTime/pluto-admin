module.exports = (app) => {
  const { router, controller } = app;
  router.resources('userTag', '/admin/userTag', controller.userTag);
  router.get('/admin/userTag-search', controller.userTag.searchUserTag);
  router.get('/web/userTag', controller.userTag.fetchAllTagsByWeb);
};
