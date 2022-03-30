"use strict";

/**
 * An asynchronous bootstrap function that runs before
 * your application gets started.
 *
 * This gives you an opportunity to set up your data model,
 * run jobs, or perform some special logic.
 */
const _ = require("lodash");

const smsProvidersActions = require("./sms-providers-actions");

module.exports = async ({ strapi }) => {
  const pluginStore = strapi.store({ type: "plugin", name: "sms-providers" });

  await initGrant(pluginStore);
  // await initAdvancedOptions(pluginStore);

  await strapi.admin.services.permission.actionProvider.registerMany(
    smsProvidersActions.actions
  );
};

const initGrant = async (pluginStore) => {
  const grantConfig = {
    movider: {
      enabled: false,
      icon: "sms",
    },
    ants: {
      enabled: false,
      icon: "sms",
    },
    thaibulksms: {
      enabled: false,
      icon: "sms",
    },
  };

  const prevGrantConfig = (await pluginStore.get({ key: "grant" })) || {};
  // store grant auth config to db
  // when plugin_users-permissions_grant is not existed in db
  // or we have added/deleted provider here.
  if (
    !prevGrantConfig ||
    !_.isEqual(_.keys(prevGrantConfig), _.keys(grantConfig))
  ) {
    // merge with the previous provider config.
    _.keys(grantConfig).forEach((key) => {
      if (key in prevGrantConfig) {
        grantConfig[key] = _.merge(grantConfig[key], prevGrantConfig[key]);
      }
    });
    await pluginStore.set({ key: "grant", value: grantConfig });
  }
};
