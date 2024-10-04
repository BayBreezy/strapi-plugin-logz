export default {
  // The admin only routes
  admin: {
    type: "admin",
    routes: [
      {
        method: "GET",
        path: "/download",
        handler: "logz.download",
        config: { auth: false },
      },
      {
        method: "GET",
        path: "/dashboard-totals",
        handler: "logz.dashboardTotals",
        config: { auth: false },
      },
      {
        method: "GET",
        path: "/requests-over-time",
        handler: "logz.requestOverTime",
        config: { auth: false },
      },
      {
        method: "GET",
        path: "/login-vs-register",
        handler: "logz.loginVsRegister",
        config: { auth: false },
      },
      {
        method: "GET",
        path: "/most-accessed",
        handler: "logz.mostAccessed",
        config: { auth: false },
      },
    ],
  },
  // The content api routes
  "content-api": {
    type: "content-api",
    routes: [
      {
        method: "GET",
        path: "/download",
        handler: "logz.download",
      },
      {
        method: "GET",
        path: "/",
        handler: "logz.find",
      },
      {
        method: "GET",
        path: "/dashboard-totals",
        handler: "logz.dashboardTotals",
      },
      {
        method: "GET",
        path: "/requests-over-time",
        handler: "logz.requestOverTime",
      },
      {
        method: "GET",
        path: "/login-vs-register",
        handler: "logz.loginVsRegister",
      },
      {
        method: "GET",
        path: "/most-accessed",
        handler: "logz.mostAccessed",
      },
      {
        method: "GET",
        path: "/:id",
        handler: "logz.findOne",
      },
    ],
  },
};
