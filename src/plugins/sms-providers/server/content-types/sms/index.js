"use strict";

const schemaConfig = require("./schema-config");

module.exports = {
  collectionName: "sms_providers_sms",
  info: {
    name: "sms",
    description: "",
    singularName: "sms",
    pluralName: "smses",
    displayName: "Sms",
  },
  options: {
    draftAndPublish: false,
    timestamps: true,
  },
  attributes: {
    destination: {
      type: "string",
      configurable: false,
      required: true,
    },
    text: {
      type: "string",
      configurable: false,
      required: true,
    },
    mid: {
      type: "string",
      configurable: false,
      required: true,
    },
    provider: {
      type: "string",
      configurable: false,
      required: true,
    },
    price: {
      type: "decimal",
      default: 0,
      min: 0,
      configurable: false,
    },
    ipAddress: {
      type: "string",
      configurable: false,
      required: true,
    },
    user: {
      type: "relation",
      relation: "oneToOne",
      target: "plugin::users-permissions.user",
      configurable: false,
    },
  },

  config: schemaConfig, // TODO: to move to content-manager options
};
