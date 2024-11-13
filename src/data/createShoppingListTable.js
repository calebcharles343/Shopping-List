import pool from "../config/db.js";

const createShoppingListTable = async () => {
  const queryText = `CREATE TABLE IF NOT EXISTS shopping_list (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    item_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (item_id) REFERENCES shop_items(id)
  )`;

  try {
    await pool.query(queryText);
    console.log("Shopping list table created successfully or already exists");
  } catch (error) {
    console.error("Error creating shopping list table:", error);
  }
};

export default createShoppingListTable;
