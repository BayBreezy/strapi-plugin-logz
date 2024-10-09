export default {
  default: () => ({
    // The default configuration for the plugin
    skipList: [],
    skipEndpoints: [],
  }),
  validator(config) {
    // Validate the config object ensure that `skipList` is an array
    if (config.skipList && !Array.isArray(config.skipList)) {
      throw new Error("skipList must be an array");
    }
    if (config.skipEndpoints && !Array.isArray(config.skipEndpoints)) {
      throw new Error("skipEndpoints must be an array");
    }
  },
  /** The name of the plugin @default "logz" */
  pluginName: "logz",
};
