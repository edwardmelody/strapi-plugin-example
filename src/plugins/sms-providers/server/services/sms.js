"use strict";

const utils = require("@strapi/utils");
const { getService } = require("../utils");
const { ApplicationError, ValidationError } = utils.errors;

/**
 * User.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

module.exports = ({ strapi }) => ({
  /**
   * Promise to count users
   *
   * @return {Promise}
   */

  count(params, userType) {
    let ut = {
      userType: {
        $eq: userType
      } 
    }
    if (params["$and"]) {
      params["$and"].push(ut)
    } else {
      params["$and"] = [ut]
    }  
    return strapi.query("plugin::sms-providers.sms").count({ where: params });
  },

  /**
   * Promise to fetch a/an user.
   * @return {Promise}
   */
  fetch(params, populate) {
    return strapi
      .query("plugin::sms-providers.sms")
      .findOne({ where: params, populate });
  },

  /**
   * Promise to fetch all users.
   * @return {Promise}
   */
  fetchAll(params, populate, userType) {
    let ut = {
      userType: {
        $eq: userType
      } 
    }
    if (params["$and"]) {
      params["$and"].push(ut)
    } else {
      params["$and"] = [ut]
    }  
    return strapi
      .query("plugin::sms-providers.sms")
      .findMany({ where: params, populate });
  },

  /**
   * Promise to remove a/an user.
   * @return {Promise}
   */
  async remove(params) {
    return strapi.query("plugin::sms-providers.sms").delete({ where: params });
  },

  /**
   * Send SMS.
   * @return {Object}
   */
  async send(body, user, ip, userType) {
    const providers = await strapi
      .store({ type: "plugin", name: "sms-providers", key: "grant" })
      .get();

    let provider;
    for (let key in providers) {
      const pv = providers[key];
      if (pv.enabled) {
        provider = key;
        break;
      }
    }
    if (!provider) {
      throw new ApplicationError("No provider found");
    }

    try {
      // send sms
      const res = await getService("providers").send(providers, provider, body);

      const data = [];
      for (let r of res) {
        data.push({
          destination: r.destination,
          mid: r.mid,
          price: r.price,
          text: body.text,
          provider: provider,
          ipAddress: ip,
          userType: userType,
          [userType]: user ? user._id : null,
        });
      }
      await strapi.query("plugin::sms-providers.sms").createMany({
        data: data,
      });
      return data;
    } catch (error) {
      throw new ApplicationError(error.message);
    }
  },
});
