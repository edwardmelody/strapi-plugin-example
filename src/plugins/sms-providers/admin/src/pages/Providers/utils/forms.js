import * as yup from "yup";
import { translatedErrors } from "@strapi/helper-plugin";

import { getTrad } from "../../../utils";

const enabledDescription = {
  id: getTrad("PopUpForm.Providers.enabled.description"),
  defaultMessage: "If disabled, users won't be able to use this provider.",
};
const enabledLabel = {
  id: getTrad("PopUpForm.Providers.enabled.label"),
  defaultMessage: "Enable",
};
const apiKeyLabel = {
  id: getTrad("PopUpForm.Providers.apiKey.label"),
  defaultMessage: "API Key",
};

const textPlaceholder = {
  id: getTrad("PopUpForm.Providers.apiKey.placeholder"),
  defaultMessage: "TEXT",
};

const accountIdLabel = {
  id: getTrad("PopUpForm.Providers.accountId.label"),
  defaultMessage: "Account ID",
};

const sourceNameLabel = {
  id: getTrad("PopUpForm.Providers.sourceName.label"),
  defaultMessage: "Source Name",
};

const otpCodeDigitsLabel = {
  id: getTrad("PopUpForm.Providers.otpCodeDigits.label"),
  defaultMessage: "OTP Code Length",
};

const numberPlaceholder = {
  id: getTrad("PopUpForm.Providers.otpCodeDigits.placeholder"),
  defaultMessage: "NUMBER",
};

const forms = {
  providers: {
    form: [
      [
        {
          intlLabel: enabledLabel,
          name: "enabled",
          type: "bool",
          description: enabledDescription,
          size: 6,
          validations: {
            required: true,
          },
        },
      ],
      [
        {
          intlLabel: apiKeyLabel,
          name: "apiKey",
          type: "text",
          placeholder: textPlaceholder,
          size: 12,
          validations: {
            required: true,
          },
        },
      ],
      [
        {
          intlLabel: accountIdLabel,
          name: "accountId",
          type: "text",
          placeholder: textPlaceholder,
          size: 12,
          validations: {
            required: true,
          },
        },
      ],
      [
        {
          intlLabel: sourceNameLabel,
          name: "sourceName",
          type: "text",
          placeholder: textPlaceholder,
          size: 12,
          validations: {
            required: true,
          },
        },
      ],
      [
        {
          intlLabel: otpCodeDigitsLabel,
          name: "otpCodeDigits",
          type: "number",
          placeholder: numberPlaceholder,
          size: 12,
          validations: {
            required: true,
          },
        },
      ],
    ],
    schema: yup.object().shape({
      enabled: yup.bool().required(translatedErrors.required),
      apiKey: yup.string().when("enabled", {
        is: true,
        then: yup.string().required(translatedErrors.required),
        otherwise: yup.string(),
      }),
      accountId: yup.string().when("enabled", {
        is: true,
        then: yup.string().required(translatedErrors.required),
        otherwise: yup.string(),
      }),
      sourceName: yup.string().when("enabled", {
        is: true,
        then: yup.string().required(translatedErrors.required),
        otherwise: yup.string(),
      }),
      otpCodeDigits: yup.string().when("enabled", {
        is: true,
        then: yup.string().required(translatedErrors.required),
        otherwise: yup.string(),
      }),
    }),
  },
};

export default forms;
