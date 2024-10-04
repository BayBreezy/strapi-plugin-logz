export default {
  default: () => ({
    // The default configuration for the plugin
    skipList: [],
  }),
  validator(config) {
    // Validate the config object ensure that `skipList` is an array
    if (config.skipList && !Array.isArray(config.skipList)) {
      throw new Error("skipList must be an array");
    }
  },
  /** The name of the plugin @default "logz" */
  pluginName: "logz",
};
