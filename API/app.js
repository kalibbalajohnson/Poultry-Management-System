const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const logger = require("./logger");
const promClient = require("prom-client");
const connectToMongoDB = require("./config/db");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const port = process.env.PORT || 3001;
const farmRoutes = require("./routes/farmRoutes");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const register = new promClient.Registry();
promClient.collectDefaultMetrics({ register });

const httpRequestDuration = new promClient.Histogram({
  name: "http_request_duration_seconds",
  help: "Duration of HTTP requests in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.3, 0.5, 1, 1.5, 2, 5],
});

register.registerMetric(httpRequestDuration);

app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on("finish", () => {
    end({
      method: req.method,
      route: req.route?.path || req.url,
      status_code: res.statusCode,
    });
  });
  next();
});

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
        url: "http://localhost:3001/api",
      },
      {
        url: "http://4.206.218.223:3001/api",
      },
    ],
  },
  apis: ["./routes/farmRoutes.js", "./controllers/*"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use("/api-docs/v1", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get("/metrics", async (req, res) => {
  logger.info("Metrics endpoint was hit");
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

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
