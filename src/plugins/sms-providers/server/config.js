"use strict";

module.exports = {
  default: ({ env }) => ({
    ratelimit: {
      interval: 60000,
      max: 10,
    },
  }),
  validator() {},
};
