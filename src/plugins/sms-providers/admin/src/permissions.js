const pluginPermissions = {
  // Providers
  readProviders: [
    { action: "plugin::sms-providers.providers.read", subject: null },
  ],
  updateProviders: [
    { action: "plugin::sms-providers.providers.update", subject: null },
  ],
};

export default pluginPermissions;
