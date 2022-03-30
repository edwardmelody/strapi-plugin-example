"use strict";

/**
 * Provider-movider.js service
 *
 * @description: A set of functions similar to controller's actions to avoid code duplication.
 */

// Public node modules.
const _ = require("lodash");
const dayjs = require("dayjs");
const https = require("https");
const querystring = require("querystring");
const PhoneNumber = require("awesome-phonenumber");
const { getService } = require("../utils");

module.exports = ({ strapi }) => ({
  async send(providers, provider, body) {
    const doFunc = function () {
      return new Promise((resolve, reject) => {
        if (body.destinations.length > 1000) {
          reject(
            new Error("maximum limit 1000 got " + body.destinations.length)
          );
          return;
        }
        const data = {
          api_key: providers[provider].apiKey,
          api_secret: providers[provider].accountId,
          from: providers[provider].sourceName,
          to: body.destinations.join(","),
          text: body.text,
        };

        const options = {
          hostname: "api.movider.co",
          port: 443,
          path: "/v1/sms",
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        };

        const req = https.request(options, (res) => {
          res.on("data", (chunk) => {
            let data;
            try {
              data = JSON.parse(chunk);
            } catch (err) {
              reject(err);
              return;
            }
            if (data.status && data.status !== 200) {
              reject(
                new Error(
                  `[${data.data.error.code}] ${data.data.error.name}: ${data.data.error.description}`
                )
              );
              return;
            }
            const out = _.map(data.phone_number_list, (d) => {
              return {
                destination: d.number,
                mid: d.message_id,
                price: d.price,
              };
            });
            resolve(out);
          });
        });

        req.on("error", (error) => {
          reject(error);
        });

        req.write(querystring.stringify(data));
        req.end();
      });
    };
    return await doFunc();
  },
  async otpVerify(providers, provider, body) {
    const locale = PhoneNumber(body.destination).getRegionCode();
    if (!locale) {
      throw new Error("can not get locale from number " + body.destination);
    }
    let language;
    switch (locale) {
      case "TH":
        language = "th-th";
        break;
      case "VN":
        language = "vi-vn";
        break;
      default:
        language = "en-us";
    }
    const doFunc = function () {
      return new Promise((resolve, reject) => {
        const data = {
          api_key: providers[provider].apiKey,
          api_secret: providers[provider].accountId,
          to: body.destination.replace(/\+/g, ""),
          code_length: providers[provider].otpCodeDigits,
          use_voice: "Y",
          language,
          next_event_wait: 150,
          from: providers[provider].sourceName,
        };

        const options = {
          hostname: "api.movider.co",
          port: 443,
          path: "/v1/verify",
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        };

        const req = https.request(options, (res) => {
          res.on("data", (chunk) => {
            try {
              const data = JSON.parse(chunk);
              if (data.status && data.status !== 200) {
                reject(
                  new Error(
                    `[${data.data.error.code}] ${data.data.error.name}: ${data.data.error.description}`
                  )
                );
                return;
              }
              resolve({
                destination: body.destination.replace(/\+/g, ""),
                afterAt: dayjs().add(1, "minute").toDate(),
                expiresAt: dayjs().add(5, "minute").toDate(),
                uid: data.request_id,
                attempt: 1,
                price: 0,
              });
            } catch (err) {
              reject(err);
            }
          });
        });

        req.on("error", (error) => {
          reject(error);
        });

        req.write(querystring.stringify(data));
        req.end();
      });
    };
    return await doFunc();
  },
  async otpValidate(providers, provider, otpId, body) {
    const otp = await getService("otp").fetch({ id: otpId });
    if (!otp) {
      throw new Error("No verify data found.");
    }
    const doFunc = function () {
      return new Promise((resolve, reject) => {
        const data = {
          api_key: providers[provider].apiKey,
          api_secret: providers[provider].accountId,
          request_id: otp.uid,
          code: body.code,
        };

        const options = {
          hostname: "api.movider.co",
          port: 443,
          path: "/v1/verify/acknowledge",
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        };

        const req = https.request(options, (res) => {
          res.on("data", (chunk) => {
            try {
              const data = JSON.parse(chunk);
              if (data.error) {
                reject(
                  new Error(
                    `[${data.error.code}] ${data.error.name}: ${data.error.description}`
                  )
                );
                return;
              }
              resolve(data);
            } catch (err) {
              reject(err);
            }
          });
        });

        req.on("error", (error) => {
          reject(error);
        });

        req.write(querystring.stringify(data));
        req.end();
      });
    };
    return await doFunc();
  },
});
