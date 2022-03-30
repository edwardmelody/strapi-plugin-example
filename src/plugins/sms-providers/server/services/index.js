"use strict";

const sms = require("./sms");
const otp = require("./otp");
const providers = require("./providers");
const ants = require("./provider-ants");
const movider = require("./provider-movider");
const thaibulksms = require("./provider-thaibulksms");

module.exports = {
  sms,
  otp,
  providers,
  ants,
  movider,
  thaibulksms
};
