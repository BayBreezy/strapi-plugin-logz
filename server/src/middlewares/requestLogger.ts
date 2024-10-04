import config from "../config";

/**
 * Middleware used to log api requests
 */
const middleware = async (ctx, next) => {
  await next();
  // get api prefix from the config
  const apiPrefix = strapi.config.get("api.rest.prefix", "/api");
  if (ctx.request.url.startsWith(apiPrefix)) {
    // Log the request
    await strapi.plugin(config.pluginName).service(config.pluginName).create();
  }
};

export default middleware;
