"use strict";

const { yup, validateYupSchema } = require("@strapi/utils");

const sendSMSBodySchema = yup.object().shape({
  destinations: yup.array().required(),
  text: yup.string().min(1).required(),
});

module.exports = {
  validateSendSMSBody: validateYupSchema(sendSMSBodySchema),
};
