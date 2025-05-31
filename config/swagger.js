const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Property Listing API",
      version: "1.0.0",
      description: "Auto-generated API docs using Swagger",
    },
    servers: [
      {
        url: "http://localhost:5000/api", // Change if needed
      },
    ],
    components: {
      schemas: {
        Property: {
          type: "object",
          required: ["title", "price", "city", "state"],
          properties: {
            title: { type: "string" },
            price: { type: "number" },
            city: { type: "string" },
            state: { type: "string" },
            type: { type: "string" },
            bedrooms: { type: "number" },
            bathrooms: { type: "number" },
            furnished: { type: "boolean" },
            listingType: { type: "string" },
            isVerified: { type: "boolean" },
            tags: {
              type: "array",
              items: { type: "string" },
            },
            amenities: {
              type: "array",
              items: { type: "string" },
            },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
   apis:[__dirname + "/../routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = { swaggerSpec, swaggerUi };
