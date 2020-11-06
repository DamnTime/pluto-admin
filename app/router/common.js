module.exports = (app) => {
  app.router.post(
    '/admin/common/uploadToken',
    app.controller.common.uploadToken
  );
  app.router.get('/admin/common/weather', app.controller.common.getWeather);
};
