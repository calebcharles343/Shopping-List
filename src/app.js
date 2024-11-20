import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";
import errorHandler from "./middleware/errorHandler.js";
import createUserTable from "./data/createUserTable.js";
import userRouter from "./routes/userRoutes.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import shopItemsRouter from "./routes/shopItemsRoutes.js";
import createShopItemsTable from "./data/createShopItemsTable.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json" assert { type: "json" };

// Load environment variables
dotenv.config();

// Create the Express app
const app = express();

////////////////////////////////////////////////////////////
// Middlewares
////////////////////////////////////////////////////////////
app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(cors());

// Limit requests from same API (bruteforce and denial of service attacks protection)
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

app.use(
  "/shopping-list/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

// Create tables before starting server
createUserTable();
createShopItemsTable();

// Routes
app.use("/api/v1/shopping-list/users", userRouter);
app.use("/api/v1/shopping-list/items", shopItemsRouter);

// Error handling middleware
app.use(errorHandler);

export default app; // Export the app
