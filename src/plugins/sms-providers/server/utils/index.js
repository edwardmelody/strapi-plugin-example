"use strict";

const getService = (name) => {
  return strapi.plugin("sms-providers").service(name);
};

module.exports = {
  getService,
};
