import { Params } from "@strapi/database/dist/entity-manager";
import type { Core } from "@strapi/strapi";
import defu from "defu";
import { omit, replace, startCase } from "lodash";
import config from "../config";
import { getPaginationInfo, isPagedPagination, shouldCount, transformPaginationResponse } from "./pagination";

function getFetchParams(params = {}): any {
  return {
    status: "published",
    ...params,
  };
}
const pluginUID = `plugin::${config.pluginName}.${config.pluginName}`;

const isLoginRoute = (ctx: any) => {
  return ctx.state.route.path === "/auth/local";
};
const isRegisterRoute = (ctx: any) => {
  return ctx.state.route.path === "/auth/local/register";
};
const service = ({ strapi }: { strapi: Core.Strapi }) => ({
  /**
   * Create a new log
   */
  async create() {
    // get the current request context
    const ctx = strapi.requestContext.get();
    // get configuration
    const configData: { skipList: Array<string>; skipEndpoints: Array<string> } = strapi.config.get(
      `plugin::${config.pluginName}`
    );
    // check if skipList is present in config
    // if it is, don't log the request
    if (
      configData.skipList &&
      configData.skipList.includes(ctx.state.route.info.apiName || ctx.state.route.info.pluginName)
    ) {
      return;
    }
    // check if skipEndpoints is present in config
    // if it is, don't log the request. Also check if the path has query params
    if (configData.skipEndpoints && configData.skipEndpoints.includes(ctx.state.route.path)) {
      return;
    }
    // get the method, url, status from the context
    const { method, url, status } = ctx;
    // get the user if it exists
    const user = ctx.state.user ? ctx.state.user.id : null;
    // get the api name from the route info
    const apiName = startCase(
      replace(ctx.state?.route.info?.apiName || ctx.state?.route.info?.pluginName, "-", " ")
    );
    // set the action based on the method and api name
    let action = apiName ? `${startCase(method)} ${apiName}` : "Unknown";

    switch (method) {
      case "GET":
        action = `Fetch ${apiName}(s)`;
        break;
      case "POST":
        action = `Created a new ${apiName}`;
        break;
      case "PUT":
      case "PATCH":
        action = `Updated a ${apiName}`;
        break;
      case "DELETE":
        action = `Deleted a ${apiName}`;
        break;

      default:
        action = `Unknown action on ${apiName}`;
        break;
    }
    // Check if we are dealing with the sign up or login routes
    if (isLoginRoute(ctx)) {
      action = "Logged in";
    } else if (isRegisterRoute(ctx)) {
      action = "Account created";
    }
    // check if the route has params
    // if not, it's a find all request. We do not want to store the data in the log as it could get really large
    const hasParams = ctx.state.route.path.includes(":");

    // set the data based on if a get request was made
    let data =
      method.toLowerCase() == "get" && !hasParams
        ? {
            // @ts-expect-error
            data: `${ctx.response?.body?.data?.length || 0} record(s) fetched`,
            query: ctx.request.query,
          }
        : omit(ctx.response?.body as any, ["jwt", "refreshToken", "token"]);

    // If the status is bad(400 and up), we want to log the error message
    if (status >= 400) {
      data = ctx.response.body;
    }

    try {
      await strapi.db.query(`plugin::${config.pluginName}.${config.pluginName}`).create({
        data: {
          method,
          url,
          statusCode: status,
          user,
          data,
          action,
        },
      });
    } catch (error) {
      strapi.log.error(error);
    }
  },
  /**
   * Find all logz
   */
  async find(query: Params) {
    const fetchParams = getFetchParams(query);

    const paginationInfo = getPaginationInfo(fetchParams);
    const isPaged = isPagedPagination(fetchParams.pagination);
    const results = await strapi.documents(pluginUID as any).findMany({
      ...fetchParams,
      ...paginationInfo,
    });

    if (shouldCount(fetchParams)) {
      const count = await strapi.documents(pluginUID as any).count({ ...fetchParams, ...paginationInfo });

      if (typeof count !== "number") {
        throw new Error("Count should be a number");
      }

      return {
        results,
        pagination: transformPaginationResponse(paginationInfo, count, isPaged),
      };
    }

    return {
      results,
      pagination: transformPaginationResponse(paginationInfo, undefined, isPaged),
    };
  },
  /**
   * Find one logz by the id
   */
  async findOne(id: string, query: Params = {}) {
    return await strapi.db.query(pluginUID).findOne({
      ...defu({ where: { $or: [{ id }, { documentId: id }] } }, omit(getFetchParams(query), ["where"])),
    });
  },
  /**
   * Count the number of logs
   */
  async count(query: Params["where"] = {}) {
    const fetchParams = getFetchParams(query);
    return await strapi.db.query(pluginUID).count(query);
  },
});

export default service;
