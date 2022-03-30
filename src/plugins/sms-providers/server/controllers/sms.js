"use strict";

/**
 * User.js controller
 *
 * @description: A set of functions called "actions" for managing `User`.
 */

const _ = require("lodash");
const utils = require("@strapi/utils");
const { getService } = require("../utils");
const { validateSendSMSBody } = require("./validation/sms");

const { sanitize } = utils;

const sanitizeOutput = (user, ctx) => {
  const schema = strapi.getModel("plugin::sms-providers.sms");
  const { auth } = ctx.state;

  return sanitize.contentAPI.output(user, schema, { auth });
};

module.exports = {
  /**
   * Send SMS.
   * @return {Object}
   */
  async send(ctx) {
    await validateSendSMSBody(ctx.request.body);

    const data = await getService("sms").send(
      ctx.request.body,
      ctx.state.user,
      ctx.ip,
      ctx.userType
    );
    let sanitizedData = [];
    for (let d of data) {
      sanitizedData.push(await sanitizeOutput(d, ctx));
    }
    ctx.send(sanitizedData);
  },

  /**
   * Retrieve sms records.
   * @return {Object|Array}
   */
  async find(ctx, next, { populate } = {}) {
    const data = await getService("sms").fetchAll(ctx.query.filters, populate, ctx.userType);

    ctx.body = await Promise.all(
      data.map((d) => sanitizeOutput(d, ctx))
    );
  },

  /**
   * Retrieve a user record.
   * @return {Object}
   */
  async findOne(ctx) {
    const { id } = ctx.params;
    let data = await getService("sms").fetch({ id });

    if (data) {
      data = await sanitizeOutput(data, ctx);
    }

    ctx.body = data;
  },

  /**
   * Retrieve user count.
   * @return {Number}
   */
  async count(ctx) {
    ctx.body = await getService("sms").count(ctx.query, ctx.userType);
  },

  /**
   * Destroy a/an user record.
   * @return {Object}
   */
  async destroy(ctx) {
    const { id } = ctx.params;

    const data = await getService("sms").remove({ id });
    const sanitizedUser = await sanitizeOutput(data, ctx);

    ctx.send(sanitizedUser);
  },
};
