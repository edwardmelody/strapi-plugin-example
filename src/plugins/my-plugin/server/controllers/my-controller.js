'use strict';

module.exports = {
  index(ctx) {
    ctx.body = strapi
      .plugin('my-plugin')
      .service('myService')
      .getWelcomeMessage();
  },
};
