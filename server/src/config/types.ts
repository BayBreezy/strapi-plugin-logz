/**
 * Configuration for the Logz Strapi plugin
 */
export interface LogzConfig {
  /**
   * Enter the list of collections to skip creating logs for
   *
   * @default []
   *
   * @example
   * ```ts
   * // config/plugins.ts
   *export default ({ env }) => ({
   *  // ...
   *  logz: {
   *    enabled: true,
   *    config: {
   *      // This will skip creating logs for the collection "car"
   *      // All requests sent to /api/cars will not be logged
   *      skipList: ["car"],
   *    },
   *  },
   *  // ...
   *});
   */
  skipList: Array<string>;
}
