import type { Core } from "@strapi/strapi";
import dayjs from "dayjs";
import defu from "defu";
import { json2csv } from "json-2-csv";
import config from "../config";

const pluginUID = `plugin::${config.pluginName}.${config.pluginName}`;
const sanitizeOutput = async (data, ctx) => {
  const schema = strapi.getModel(`plugin::${config.pluginName}.${config.pluginName}`);
  const { auth } = ctx.state;
  return strapi.contentAPI.sanitize.output(data, schema, { auth });
};

const validateQuery = async (query, ctx) => {
  const schema = strapi.getModel(`plugin::${config.pluginName}.${config.pluginName}`);
  const { auth } = ctx.state;
  return strapi.contentAPI.validate.query(query, schema, { auth });
};

const sanitizeQuery = async (query, ctx) => {
  const schema = strapi.getModel(`plugin::${config.pluginName}.${config.pluginName}`);
  const { auth } = ctx.state;
  return strapi.contentAPI.sanitize.query(query, schema, { auth });
};

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  /**
   * Download the logs as a CSV file
   *
   * Accepts a `start` and `end` query parameter to filter the logs by date
   */
  async download(ctx) {
    let { start, end } = ctx.query;
    if (start) start = dayjs(start).startOf("day").toISOString();
    if (end) end = dayjs(end).endOf("day").toISOString();

    let data: any[] = await strapi.documents(pluginUID as any).findMany({
      populate: ["user"],
      orderBy: { createdAt: "desc" },
      where: start &&
        end && {
          createdAt: {
            $gte: start,
            $lt: end,
          },
        },
    });
    data = await Promise.all(data.map((d) => sanitizeOutput(d, ctx)));
    const csv = json2csv(data, {
      keys: [
        { field: "id", title: "ID" },
        { field: "documentId", title: "Document ID" },
        { field: "action", title: "Action" },
        { field: "method", title: "Method" },
        { field: "url", title: "URL" },
        { field: "statusCode", title: "Status Code" },
        { field: "user.email", title: "User" },
        { field: "data", title: "Data" },
        { field: "createdAt", title: "Created At" },
        { field: "updatedAt", title: "Updated At" },
      ],
      trimHeaderFields: true,
      excelBOM: true,
      emptyFieldValue: "N/A",
    });
    const fileName = `logs-${dayjs().format("YYYY-MM-DD")}.csv`;
    ctx.set("Content-Type", "text/csv");
    ctx.set("Content-Disposition", `attachment;filename="${fileName}"`);
    ctx.body = csv;
  },
  /**
   * Find all logs
   */
  async find(ctx) {
    await validateQuery(ctx.query, ctx);
    const sanitizedQuery = await sanitizeQuery(ctx.query, ctx);
    const query: any = defu({}, sanitizedQuery, { orderBy: { createdAt: "desc" } });
    let { results, pagination } = await strapi.plugin(config.pluginName).service("logz").find(query);
    results = await Promise.all(results.map((d) => sanitizeOutput(d, ctx)));
    ctx.body = { data: results, pagination };
  },
  /**
   * Find one log
   */
  async findOne(ctx) {
    await validateQuery(ctx.query, ctx);
    const sanitizedQuery = await sanitizeQuery(ctx.query, ctx);
    let data = await strapi
      .plugin(config.pluginName)
      .service("logz")
      .findOne(ctx.request.params.id, sanitizedQuery);

    if (data) {
      data = await sanitizeOutput(data, ctx);
    }
    return { data };
  },
  /**
   * Get the total number of requests, login requests, register requests, and error requests for the dashboard
   */
  async dashboardTotals(ctx) {
    // get total api requests
    const totalRequests = await strapi.plugin(config.pluginName).service("logz").count();
    // total login requests
    const totalLoginRequests = await strapi
      .plugin(config.pluginName)
      .service("logz")
      .count({ where: { action: { $containsi: "Logged" } } });
    // total register requests
    const totalRegisterRequests = await strapi
      .plugin(config.pluginName)
      .service("logz")
      .count({ where: { action: { $containsi: "Account created" } } });
    // Total error requests
    const totalErrorRequests = await strapi
      .plugin(config.pluginName)
      .service("logz")
      .count({ where: { statusCode: { $gte: 400 } } });
    ctx.body = {
      data: {
        totalRequests,
        totalLoginRequests,
        totalRegisterRequests,
        totalErrorRequests,
      },
    };
  },
  /**
   * Get the total number of requests over time based on the filterBy query parameter
   *
   * filterBy: `week` | `month`
   */
  async requestOverTime(ctx) {
    const { filterBy = "week" } = ctx.query;
    const now = dayjs();
    const data = [];
    // if filterBy is week, get data for the last 7 days
    if (filterBy === "week") {
      for (let i = 0; i < 7; i++) {
        const startOfDay = now.subtract(i, "day").startOf("day").toISOString();
        const endOfDay = now.subtract(i, "day").endOf("day").toISOString();
        const day = now.subtract(i, "day").format("dddd");
        let total = await strapi.db.query(pluginUID).count({
          where: {
            createdAt: {
              $gte: startOfDay,
              $lt: endOfDay,
            },
          },
        });
        data.push({ name: day, total });
      }
    } else if (filterBy === "month") {
      // if filterBy is month, get the data for the last 7 months
      for (let i = 0; i < 7; i++) {
        const startOfMonth = now.subtract(i, "month").startOf("month").toISOString();
        const endOfMonth = now.subtract(i, "month").endOf("month").toISOString();
        const month = now.subtract(i, "month").format("MMMM");
        let total = await strapi.db.query(pluginUID).count({
          where: {
            createdAt: {
              $gte: startOfMonth,
              $lt: endOfMonth,
            },
          },
        });
        data.push({ name: month, total });
      }
    }

    ctx.body = { data };
  },
  /**
   * Get the total number of logins vs register requests over time based on the filterBy query parameter
   *
   * filterBy: `week` | `month`
   */
  async loginVsRegister(ctx) {
    const { filterBy = "week" } = ctx.query;
    const now = dayjs();
    const data = [];
    // if filterBy is week, get data for the last 7 days
    if (filterBy === "week") {
      for (let i = 0; i < 7; i++) {
        const startOfDay = now.subtract(i, "day").startOf("day").toISOString();
        const endOfDay = now.subtract(i, "day").endOf("day").toISOString();
        const day = now.subtract(i, "day").format("dddd");
        let login = await strapi.db.query(pluginUID).count({
          where: {
            createdAt: {
              $gte: startOfDay,
              $lt: endOfDay,
            },
            action: { $containsi: "Logged" },
          },
        });
        let register = await strapi.db.query(pluginUID).count({
          where: {
            createdAt: {
              $gte: startOfDay,
              $lt: endOfDay,
            },
            action: { $containsi: "Account created" },
          },
        });
        data.push({ name: day, login, register });
      }
    } else if (filterBy === "month") {
      // if filterBy is month, get the data for the last 7 months
      for (let i = 0; i < 7; i++) {
        const startOfMonth = now.subtract(i, "month").startOf("month").toISOString();
        const endOfMonth = now.subtract(i, "month").endOf("month").toISOString();
        const month = now.subtract(i, "month").format("MMMM");
        let login = await strapi.db.query(pluginUID).count({
          where: {
            createdAt: {
              $gte: startOfMonth,
              $lt: endOfMonth,
            },
            action: { $containsi: "Logged" },
          },
        });
        let register = await strapi.db.query(pluginUID).count({
          where: {
            createdAt: {
              $gte: startOfMonth,
              $lt: endOfMonth,
            },
            action: { $containsi: "Account created" },
          },
        });
        data.push({ name: month, login, register });
      }
    }

    ctx.body = { data };
  },
  /**
   * Get the total number of GET, POST, PUT, DELETE, PATCH, "Logged in" & "Account created" requests over time based on the filterBy query parameter
   *
   * filterBy: `week` | `month`
   */
  async mostAccessed(ctx) {
    const { filterBy = "week" } = ctx.query;
    const now = dayjs();
    const data = [];
    // Get the total number of GET, POST, PUT, DELETE, PATCH, "Logged in" & "Account created" requests
    // if filterBy is week, get the requests for the last 7 days
    if (filterBy === "week") {
      const start = now.endOf("day").toISOString();
      const end = now.subtract(7, "day").startOf("day").toISOString();
      const createdFilter = { createdAt: { $gte: end, $lt: start } };
      let get = await strapi.db.query(pluginUID).count({
        where: { ...createdFilter, method: "GET" },
      });
      let post = await strapi.db.query(pluginUID).count({
        where: {
          ...createdFilter,
          method: "POST",
          $and: [{ action: { $notContains: "Logged" } }, { action: { $notContains: "Account created" } }],
        },
      });
      let put = await strapi.db.query(pluginUID).count({
        where: { ...createdFilter, method: "PUT" },
      });
      let patch = await strapi.db.query(pluginUID).count({
        where: { ...createdFilter, method: "PATCH" },
      });
      let del = await strapi.db.query(pluginUID).count({
        where: { ...createdFilter, method: "DELETE" },
      });
      let login = await strapi.db.query(pluginUID).count({
        where: { ...createdFilter, action: { $containsi: "Logged" } },
      });
      let register = await strapi.db.query(pluginUID).count({
        where: { ...createdFilter, action: { $containsi: "Account created" } },
      });

      data.push(
        { name: "GET", total: get },
        { name: "POST", total: post },
        { name: "PUT", total: put },
        { name: "PATCH", total: patch },
        { name: "DELETE", total: del },
        { name: "Logged in", total: login },
        { name: "Account created", total: register }
      );
    } else if (filterBy === "month") {
      const start = now.endOf("month").toISOString();
      const end = now.subtract(7, "month").startOf("month").toISOString();
      const createdFilter = { createdAt: { $gte: end, $lt: start } };
      let get = await strapi.db.query(pluginUID).count({
        where: { ...createdFilter, method: "GET" },
      });
      let post = await strapi.db.query(pluginUID).count({
        where: {
          ...createdFilter,
          method: "POST",
          $and: [{ action: { $notContains: "Logged" } }, { action: { $notContains: "Account created" } }],
        },
      });
      let put = await strapi.db.query(pluginUID).count({
        where: { ...createdFilter, method: "PUT" },
      });
      let patch = await strapi.db.query(pluginUID).count({
        where: { ...createdFilter, method: "PATCH" },
      });
      let del = await strapi.db.query(pluginUID).count({
        where: { ...createdFilter, method: "DELETE" },
      });
      let login = await strapi.db.query(pluginUID).count({
        where: { ...createdFilter, action: { $containsi: "Logged" } },
      });
      let register = await strapi.db.query(pluginUID).count({
        where: { ...createdFilter, action: { $containsi: "Account created" } },
      });

      data.push(
        { name: "GET", total: get },
        { name: "POST", total: post },
        { name: "PUT", total: put },
        { name: "PATCH", total: patch },
        { name: "DELETE", total: del },
        { name: "Logged in", total: login },
        { name: "Account created", total: register }
      );
    }

    ctx.body = { data };
  },
});

export default controller;
