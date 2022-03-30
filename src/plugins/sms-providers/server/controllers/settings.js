"use strict";

const _ = require("lodash");
const { ValidationError } = require("@strapi/utils").errors;

module.exports = {
  async getProviders(ctx) {
    const providers = await strapi
      .store({ type: "plugin", name: "sms-providers", key: "grant" })
      .get();

    ctx.send(providers);
  },

  async getBalance(ctx) {
    const { provider } = ctx.request.query;

    if (!provider) {
      return ctx.badRequest("invalid_parameters", {
        message: "requires provider",
      });
    }

    ctx.send(0);
  },

  async updateProviders(ctx) {
    if (_.isEmpty(ctx.request.body)) {
      throw new ValidationError("Request body cannot be empty");
    }

    const providers = await strapi
      .store({ type: "plugin", name: "sms-providers", key: "grant" })
      .get();
    let usingProvider;
    for (let key in providers) {
      const provider = providers[key];
      if (provider.enabled) {
        usingProvider = key;
      }
    }

    if (usingProvider) {
      ctx.request.body.providers[usingProvider].enabled = false;
    }

    await strapi
      .store({ type: "plugin", name: "sms-providers", key: "grant" })
      .set({ value: ctx.request.body.providers });

    ctx.send({ ok: true });
  },
};
