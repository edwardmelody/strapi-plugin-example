"use strict";

module.exports = [
  {
    method: "GET",
    path: "/otp/count",
    handler: "otp.count",
    config: {
      prefix: "",
    },
  },
  {
    method: "GET",
    path: "/otp",
    handler: "otp.find",
    config: {
      auth: {},
      prefix: "",
    },
  },
  {
    method: "GET",
    path: "/otp/:id",
    handler: "otp.findOne",
    config: {
      prefix: "",
    },
  },
  {
    method: "POST",
    path: "/otp/verify",
    handler: "otp.verify",
    config: {
      prefix: "",
    },
  },
  {
    method: "PUT",
    path: "/otp/validate/:id",
    handler: "otp.validate",
    config: {
      prefix: "",
    },
  },
  {
    method: "DELETE",
    path: "/otp/:id",
    handler: "otp.destroy",
    config: {
      prefix: "",
    },
  },
];
