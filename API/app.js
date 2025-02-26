import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import logger from "./config/logger.js";
import connectToMongoDB from "./config/db.js";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import swaggerOptions from "./config/swagger.js";
import farmRoutes from "./modules/farm/farm.routes.js";

const port = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
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
