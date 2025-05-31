const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const authRoutes = require("./routes/authRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const favouriteRoutes = require("./routes/favouriteRoutes");
const errorHandler = require("./middleware/errorHandler");
const { swaggerSpec, swaggerUi } = require("./config/swagger");

const app = express();

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.get("/", (req, res) => {
  res.send("Welcome to the Property Listing API! Visit /api-docs for documentation.");
});
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/favorites", favouriteRoutes);

app.use(errorHandler);

module.exports = app;
