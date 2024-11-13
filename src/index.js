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

dotenv.config();

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1); //graceful shutdown
});

const app = express();
const port = process.env.PORT || 3001;

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
app.use("/api", limiter); // affects all routes starting with '/api'
// Body parser, reading data from body into req.body not greater than 10kb

// Routes
app.use("/api/v1/shopping-list/users", userRouter);
app.use("/api/v1/shopping-list/items", shopItemsRouter);

// Error handling middleware
//////////////////////////////////////////////////////////////////////////////////////////
//GLOBAL UNCAUGHT EXCEPTION ERROR HANDLER as (Last Safety Net) i.e. SYNCHRONOUSE CODE
/////////////////////////////////////////////////////////////////////////////////////////

app.use(errorHandler);

// create table before starting Server
createUserTable();
createShopItemsTable();

// Testing POSTGRES Connection
pool.query("SELECT current_database(), NOW()", (err, res) => {
  if (err) {
    console.error("Error connecting to the database", err);
  } else {
    console.log(
      `Connected to database ${res.rows[0].current_database} at ${res.rows[0].now}`
    );
  }
});

// Server running
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

////////////////////////////////////////////////////////////////////////////////////
//GLOBAL UNHANDLED REJECTION ERROR HANDLER as (Last Safety Net)
//for rejected promises not handled i.e. ASYNCHRONOUSE CODE
/////////////////////////////////////////////////////////////////////////////////////
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
