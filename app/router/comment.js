module.exports = (app) => {
  const { router, controller } = app;
  router.resources('comment', '/admin/comment', controller.comment);
  router.post('/web/comment', controller.comment.create);
  router.get('/web/comment-by-article', controller.comment.getCommentsByArticleId);
};
