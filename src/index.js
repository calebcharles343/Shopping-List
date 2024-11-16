import dotenv from "dotenv";
import app from "./app.js"; // Import the app

// Load environment variables
dotenv.config();

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...,", err);
  process.exit(1); // Graceful shutdown
});

// Server running
const port = process.env.PORT || 3001;
const server = app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

////////////////////////////////////////////////////////////////////////////////////
// GLOBAL UNHANDLED REJECTION ERROR HANDLER as (Last Safety Net)
// For rejected promises not handled i.e. ASYNCHRONOUS CODE
/////////////////////////////////////////////////////////////////////////////////////
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
