"use strict";

module.exports = [
  {
    method: "GET",
    path: "/sms/count",
    handler: "sms.count",
    config: {
      prefix: "",
    },
  },
  {
    method: "GET",
    path: "/sms",
    handler: "sms.find",
    config: {
      auth: {},
      prefix: "",
    },
  },
  {
    method: "GET",
    path: "/sms/:id",
    handler: "sms.findOne",
    config: {
      prefix: "",
    },
  },
  {
    method: "POST",
    path: "/sms",
    handler: "sms.send",
    config: {
      prefix: "",
    },
  },
  {
    method: "DELETE",
    path: "/sms/:id",
    handler: "sms.destroy",
    config: {
      prefix: "",
    },
  },
];
