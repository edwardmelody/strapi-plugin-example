"use strict";

const smsRoutes = require("./sms");
const otpRoutes = require("./otp");

module.exports = {
  type: "content-api",
  routes: [...smsRoutes, ...otpRoutes],
};
