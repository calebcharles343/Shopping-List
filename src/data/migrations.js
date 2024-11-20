import pool from "../config/db.js";
import createShopItemsTable from "./createShopItemsTable.js";
import createUserTable from "./createUserTable.js";

// Testing PostgreSQL Connection
pool.query("SELECT current_database(), NOW()", (err, res) => {
    if (err) {
      console.error("Error connecting to the database", err);
    } else {
      console.log(`Connected to database ${res.rows[0].current_database} at ${res.rows[0].now}`);
      // Create tables before starting server
        createUserTable();
        createShopItemsTable();
    }
});
