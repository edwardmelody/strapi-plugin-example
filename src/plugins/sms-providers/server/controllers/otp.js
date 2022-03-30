"use strict";

/**
 * User.js controller
 *
 * @description: A set of functions called "actions" for managing `User`.
 */

const _ = require("lodash");
const utils = require("@strapi/utils");
const { getService } = require("../utils");
const {
  validateVerifySMSBody,
  validateValidateSMSBody,
} = require("./validation/otp");

const { sanitize } = utils;

const sanitizeOutput = (user, ctx) => {
  const schema = strapi.getModel("plugin::sms-providers.otp");
  const { auth } = ctx.state;

  return sanitize.contentAPI.output(user, schema, { auth });
};

module.exports = {
  /**
   * Verify otp.
   * @return {Object}
   */
  async verify(ctx) {
    await validateVerifySMSBody(ctx.request.body);

    const data = await getService("otp").verify(
      ctx.request.body,
      ctx.state.user,
      ctx.ip,
      ctx.userType
    );
    const sanitizedData = await sanitizeOutput(data, ctx);
    ctx.send(sanitizedData);
  },

  /**
   * Validate otp.
   * @return {Object}
   */
  async validate(ctx) {
    await validateValidateSMSBody(ctx.request.body);

    const { id } = ctx.params;

    const data = await getService("otp").validate(id, ctx.request.body, ctx.userType);
    const sanitizedData = await sanitizeOutput(data, ctx);
    ctx.send(sanitizedData);
  },

  /**
   * Retrieve otp records.
   * @return {Object|Array}
   */
  async find(ctx, next, { populate } = {}) {
    const data = await getService("otp").fetchAll(ctx.query.filters, populate, ctx.userType);

    ctx.body = await Promise.all(
      data.map((d) => sanitizeOutput(d, ctx))
    );
  },

  /**
   * Retrieve a otp record.
   * @return {Object}
   */
  async findOne(ctx) {
    const { id } = ctx.params;
    let data = await getService("otp").fetch({ id });

    if (data) {
      data = await sanitizeOutput(data, ctx);
    }

    ctx.body = data;
  },

  /**
   * Retrieve otp count.
   * @return {Number}
   */
  async count(ctx) {
    ctx.body = await getService("otp").count(ctx.query, ctx.userType);
  },

  /**
   * Destroy a/an otp record.
   * @return {Object}
   */
  async destroy(ctx) {
    const { id } = ctx.params;

    const data = await getService("otp").remove({ id });
    const sanitizedUser = await sanitizeOutput(data, ctx);

    ctx.send(sanitizedUser);
  },
};
