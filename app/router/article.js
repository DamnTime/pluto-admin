module.exports = (app) => {
  const { router, controller } = app;
  router.resources('article', '/admin/article', controller.article);
  router.get('/web/getArticleByCate', controller.article.getArticleByCateForWeb);
  router.get('/web/getArticleLatest', controller.article.getArticlesLatesForWeb);
  router.get('/web/getArticleDetail', controller.article.fetchArticleDetailForWeb);
  router.get('/web/searchArticle', controller.article.fetchSearchArticleForWeb);
  router.post('/web/updateArticlePageNum', controller.article.updataArticlePreviewNumber);
};
