"use strict";

module.exports = [
  {
    method: "GET",
    path: "/providers",
    handler: "settings.getProviders",
    config: {
      policies: [
        {
          name: "admin::hasPermissions",
          config: {
            actions: ["plugin::sms-providers.providers.read"],
          },
        },
      ],
    },
  },
  {
    method: "GET",
    path: "/providers",
    handler: "settings.getBalance",
    config: {
      policies: [
        {
          name: "admin::hasPermissions",
          config: {
            actions: ["plugin::sms-providers.providers.getbalance"],
          },
        },
      ],
    },
  },
  {
    method: "PUT",
    path: "/providers",
    handler: "settings.updateProviders",
    config: {
      policies: [
        {
          name: "admin::hasPermissions",
          config: {
            actions: ["plugin::sms-providers.providers.update"],
          },
        },
      ],
    },
  },
];
