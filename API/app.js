const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const logger = require("./logger");
const connectToMongoDB = require("./config/db");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const farmRoutes = require("./routes/farmRoutes");

const port = process.env.PORT || 3001;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "PoultryPal API",
      version: "1.0.0",
      description: "API documentation for the PoultryPal application",
    },
    servers: [
      {
        url: "*",
      },
    ],
  },
  apis: ["./routes/*", "./controllers/*"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use("/api-docs/v1", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/api/v1", farmRoutes);

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Connect to MongoDB and start the server
connectToMongoDB()
  .then(() => {
    app.listen(port, () => logger.info(`Listening on port ${port}`));
  })
  .catch((error) => {
    console.error(
      "Failed to start server due to MongoDB connection error:",
      error
    );
  });
