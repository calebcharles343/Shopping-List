import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";
import errorHandler from "./middleware/errorHandler.js";

import createUserTable from "./data/createUserTable.js";
import userRouter from "./routes/userRoutes.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/v1/users", userRouter);

// Error handling middleware
//////////////////////////////////////////////////////////////////////////////////////////
//GLOBAL UNCAUGHT EXCEPTION ERROR HANDLER as (Last Safety Net) i.e. SYNCHRONOUSE CODE
/////////////////////////////////////////////////////////////////////////////////////////
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  process.exit(1); //graceful shutdown
});

app.use(errorHandler);

// create table before starting Server
createUserTable();

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
