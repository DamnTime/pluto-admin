module.exports = (app) => {
  const { router, controller } = app;
  router.resources('category', '/admin/category', controller.category);
  router.get('/admin/category-search', controller.category.searchCategory);
};
