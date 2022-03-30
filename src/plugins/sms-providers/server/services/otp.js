'use strict';

const utils = require('@strapi/utils');
const { getService } = require('../utils');
const { ApplicationError, ValidationError } = utils.errors;

/**
 * otp.js service
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
    return strapi.query('plugin::sms-providers.otp').count({ where: params });
  },

  /**
   * Promise to fetch a/an user.
   * @return {Promise}
   */
  fetch(params, populate) {
    return strapi
      .query('plugin::sms-providers.otp')
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
      .query('plugin::sms-providers.otp')
      .findMany({ where: params, populate });
  },

  /**
   * Promise to remove a/an user.
   * @return {Promise}
   */
  async remove(params) {
    return strapi.query('plugin::sms-providers.otp').delete({ where: params });
  },

  /**
   * Promise to verify SMS.
   * @return {Promise}
   */
  async verify(body, user, ip, userType) {
    const providers = await strapi
      .store({ type: 'plugin', name: 'sms-providers', key: 'grant' })
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
      throw new ApplicationError('No provider found');
    }

    try {
      // verify sms
      const res = await getService('providers').otpVerify(
        providers,
        provider,
        body
      );
      const data = {
        ...res,
        status: 'WAITING',
        provider: provider,
        ipAddress: ip,
        userType: userType,
        [userType]: user ? user.id : null,
      };
      return await strapi.query('plugin::sms-providers.otp').create({
        data: data,
      });
    } catch (error) {
      throw new ApplicationError(error.message);
    }
  },

  /**
   * Promise to validate SMS.
   * @return {Promise}
   */
  async validate(id, body, userType) {
    const providers = await strapi
      .store({ type: 'plugin', name: 'sms-providers', key: 'grant' })
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
      throw new ApplicationError('No provider found');
    }

    try {
      // validate sms
      const res = await getService('providers').otpValidate(
        providers,
        provider,
        id,
        body
      );
      const data = await strapi.query('plugin::sms-providers.otp').update({
        where: {
          id: id,
        },
        data: {
          status: 'VERIFIED',
        },
        populate: [userType],
      });
      if (data[userType]) {
        await strapi.query("plugin::users-permissions." + userType).update({
          where: {
            id: data[userType].id,
          },
          data: {
            phoneVerified: true,
          },
        });
      }
      return data;
    } catch (error) {
      throw new ApplicationError(error.message);
    }
  },
});
