'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = (app) => {
  require('./router/user')(app);
  require('./router/login')(app);
  require('./router/userTag')(app);
  require('./router/articleTag')(app);
  require('./router/category')(app);
  require('./router/article')(app);
  require('./router/common')(app);
};
