"use strict";

const schemaConfig = require("./schema-config");

module.exports = {
  collectionName: "sms_providers_otp",
  info: {
    name: "otp",
    description: "",
    singularName: "otp",
    pluralName: "otps",
    displayName: "Otp",
  },
  options: {
    draftAndPublish: false,
    timestamps: true,
  },
  attributes: {
    status: {
      type: "enumeration",
      enum: ["WAITING", "VERIFIED"],
      configurable: false,
      default: "WAITING",
    },
    destination: {
      type: "string",
      configurable: false,
      required: true,
    },
    uid: {
      type: "string",
      configurable: false,
      required: true,
    },
    afterAt: {
      type: "datetime",
      configurable: false,
    },
    expiredAt: {
      type: "datetime",
      configurable: false,
    },
    attempt: {
      type: "integer",
      default: 0,
      min: 0,
      configurable: false,
    },
    ipAddress: {
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
    provider: {
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
