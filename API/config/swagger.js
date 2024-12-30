import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
        url: "http://127.0.0.1:3001/api/v1",
      },
    ],
  },
  apis: [
    path.join(__dirname, "../modules/*/*.routes.js"),
    path.join(__dirname, "../modules/*/*.controller.js"),
  ],
};

export default swaggerOptions;
