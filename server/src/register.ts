import type { Core } from "@strapi/strapi";
import middlewares from "./middlewares";

const register = ({ strapi }: { strapi: Core.Strapi }) => {
  // Register logger middleware.
  strapi.server.use(middlewares.requestLogged);
};

export default register;
