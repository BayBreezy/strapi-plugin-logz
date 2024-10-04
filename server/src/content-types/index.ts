export default {
  logz: {
    // Configuration for the table that will store the logs
    schema: {
      kind: "collectionType",
      collectionName: "logz",
      info: {
        displayName: "Logz",
        singularName: "logz",
        pluralName: "logz",
        description: "The logz collection",
      },
      options: { draftAndPublish: false, timestamps: true },
      pluginOptions: {
        "content-manager": { visible: true },
        "content-type-builder": { visible: false },
      },
      attributes: {
        action: {
          configurable: false,
          type: "string",
          required: false,
        },
        method: {
          type: "string",
          required: true,
          configurable: false,
        },
        url: {
          type: "string",
          configurable: false,
        },
        statusCode: {
          configurable: false,
          type: "integer",
        },
        user: {
          configurable: false,
          type: "relation",
          relation: "oneToOne",
          target: "plugin::users-permissions.user",
        },
        data: {
          configurable: false,
          type: "json",
        },
      },
    },
  },
};
