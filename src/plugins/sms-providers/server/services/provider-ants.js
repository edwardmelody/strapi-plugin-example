"use strict";

/**
 * Provider-ants.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

const _ = require("lodash");
const dayjs = require("dayjs");
const axios = require("axios");
const PhoneNumber = require("awesome-phonenumber");
const { getService } = require("../utils");

module.exports = ({ strapi }) => ({
  async send(providers, provider, body) {
    if (body.destinations.length > 500) {
      new Error("maximum limit 500 got " + body.destinations.length);
    }

    const token = Buffer.from(providers[provider].apiKey).toString("base64");
    const data = {
      from: providers[provider].sourceName,
      destinations: body.destinations,
      text: body.text,
    };

    try {
      const res = await axios.post(
        "https://api-service.ants.co.th/sms/send",
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Basic " + token,
          },
        }
      );
      if (res.status === 200 || res.status === 201) {
        let out = _.map(res.data.detail, (d) => {
          return {
            destination: d.to,
            mid: d.messageId,
            price: d.credit,
          };
        });
        return out;
      } else {
        throw new Error(res.data);
      }
    } catch (error) {
      throw new Error(error);
    }
  },
  async otpVerify(providers, provider, body) {
    const locale = PhoneNumber(body.destination).getRegionCode();
    if (!locale) {
      throw new Error("can not get locale from number " + body.destination);
    }

    const token = Buffer.from(providers[provider].apiKey).toString("base64");
    const data = {
      otcId: providers[provider].accountId,
      mobile: body.destination.replace(/\+/g, ""),
    };

    try {
      const res = await axios.post(
        "https://api-service.ants.co.th/otp/requestOTP",
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Basic " + token,
          },
        }
      );
      if (res.status === 200) {
        let out = {
          destination: body.destination.replace(/\+/g, ""),
          afterAt: dayjs().add(1, "minute").toDate(),
          expiresAt: dayjs().add(5, "minute").toDate(),
          uid: res.data.otpId,
          attempt: 1,
          price: 0,
        };
        return out;
      } else {
        throw new Error(res.data);
      }
    } catch (error) {
      throw new Error(error);
    }
  },
  async otpValidate(providers, provider, otpId, body) {
    const otp = await getService("otp").fetch({ id: otpId });
    if (!otp) {
      throw new Error("No verify data found.");
    }

    const token = Buffer.from(providers[provider].apiKey).toString("base64");
    const data = {
      otcId: otp.uid,
      otpCode: body.code,
    };

    try {
      const res = await axios.post(
        "https://api-service.ants.co.th/otp/verifyOTP",
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: "Basic " + token,
          },
        }
      );
      if (res.status === 200) {
        return res.data;
      } else {
        throw new Error(res.data);
      }
    } catch (error) {
      throw new Error(error);
    }
  },
});
