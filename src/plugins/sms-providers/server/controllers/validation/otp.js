"use strict";

const { yup, validateYupSchema } = require("@strapi/utils");

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const verifyBodySchema = yup.object().shape({
  destination: yup
    .string()
    // .matches(phoneRegExp, "Phone number is not valid")
    .required(),
});

const validateBodySchema = yup.object().shape({
  code: yup.string().required(),
});

module.exports = {
  validateVerifySMSBody: validateYupSchema(verifyBodySchema),
  validateValidateSMSBody: validateYupSchema(validateBodySchema),
};
