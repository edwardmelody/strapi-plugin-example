"use strict";

/**
 * Provider-thaibulksms.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

const _ = require("lodash");
const dayjs = require("dayjs");
const axios = require("axios");
const querystring = require("querystring");
const PhoneNumber = require("awesome-phonenumber");
const { getService } = require("../utils");

module.exports = ({ strapi }) => ({
  async send(providers, provider, body) {
    if (body.destinations.length > 500) {
      new Error("maximum limit 500 got " + body.destinations.length);
    }

    const token = Buffer.from(
      providers[provider].apiKey + ":" + providers[provider].accountId
    ).toString("base64");

    const data = {
      sender: providers[provider].sourceName,
      msisdn: body.destinations.join(","),
      message: body.text,
    };

    try {
      const res = await axios.post(
        "https://api-v2.thaibulksms.com/sms",
        querystring.stringify(data),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Basic " + token,
          },
        }
      );
      if (res.status === 200 || res.status === 201) {
        out = _.map(res.data.phone_number_list, (d) => {
          return {
            destination: d.number,
            mid: d.message_id,
            price: d.used_credit,
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

    const data = {
      key: providers[provider].apiKey,
      secret: providers[provider].accountId,
      msisdn: body.destination.replace(/\+/g, ""),
    };

    try {
      const res = await axios.post(
        "https://otp.thaibulksms.com/v2/otp/request",
        querystring.stringify(data),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      if (res.status === 200) {
        let out = {
          destination: body.destination.replace(/\+/g, ""),
          afterAt: dayjs().add(1, "minute").toDate(),
          expiresAt: dayjs().add(5, "minute").toDate(),
          uid: res.data.token,
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

    const data = {
      key: providers[provider].apiKey,
      secret: providers[provider].accountId,
      token: otp.uid,
      pin: body.code,
    };

    try {
      const res = await axios.post(
        "https://otp.thaibulksms.com/v2/otp/verify",
        querystring.stringify(data),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
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
