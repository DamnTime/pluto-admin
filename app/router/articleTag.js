module.exports = (app) => {
  const { router, controller } = app;
  router.resources('articleTag', '/admin/articleTag', controller.articleTag);
  router.get(
    '/admin/article-tag-search',
    controller.articleTag.searchArticleTag
  );
};
