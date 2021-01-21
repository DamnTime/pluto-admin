module.exports = (app) => {
  app.router.post('/admin/common/uploadToken', app.controller.common.uploadToken);
  app.router.post('/web/common/upload', app.controller.common.uploadFile);
  app.router.get('/admin/common/weather', app.controller.common.getWeather);
};
