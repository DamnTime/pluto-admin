module.exports = (app) => {
  const { router, controller } = app;
  router.resources('category', '/admin/category', controller.category);
  router.post('/admin/category-update-sorts', controller.category.updateSort);
  router.get('/admin/category-search', controller.category.searchCategory);
  router.get('/web/category-list', controller.category.getAllCatesForWeb);
};
