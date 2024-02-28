const swaggerJSDoc = require("swagger-jsdoc");
const tr = require("./routes/user.router.js");
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "DocHub Server APIs",
    version: "1.0.0",
    description: "Description",
  },
};

const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
