"use strict";

const sms = require("./sms");
const otp = require("./otp");

module.exports = {
  sms: { schema: sms },
  otp: { schema: otp },
};
