import pool from "../config/db.js";

const createShopItemsTable = async () => {
  const queryText = `CREATE TABLE IF NOT EXISTS shop_items (
    id SERIAL PRIMARY KEY,
    item_name VARCHAR(100) NOT NULL,
    price NUMERIC(10, 2) NOT NULL
  )`;

  try {
    await pool.query(queryText);
    console.log("Shop items table created successfully or already exists");
  } catch (error) {
    console.error("Error creating shop items table:", error);
  }
};

export default createShopItemsTable;
