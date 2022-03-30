"use strict";

/**
 * Module dependencies.
 */

const { getService } = require("../utils");

module.exports = ({ strapi }) => {
  /**
   * Send SMS via third-party provider.
   *
   *
   * @param {String}    provider
   * @param {String}    body
   *
   * @return  {*}
   */

  const send = async (providers, provider, body) => {
    try {
      return await getService(provider).send(providers, provider, body);
    } catch (err) {
      throw err;
    }
  };

  const otpVerify = async (providers, provider, body) => {
    try {
      return await getService(provider).otpVerify(providers, provider, body);
    } catch (err) {
      throw err;
    }
  };

  const otpValidate = async (providers, provider, otpId, body) => {
    try {
      return await getService(provider).otpValidate(
        providers,
        provider,
        otpId,
        body
      );
    } catch (err) {
      throw err;
    }
  };

  return {
    send,
    otpVerify,
    otpValidate,
  };
};
