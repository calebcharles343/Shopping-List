import pool from "../config/db.js";

export const addItemToShoppingListService = async (userId, itemId) => {
  const queryText = `INSERT INTO shopping_list (user_id, item_id) VALUES ($1, $2) RETURNING *`;
  const values = [userId, itemId];

  try {
    const result = await pool.query(queryText, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error adding item to shopping list:", error);
    throw error;
  }
};

export const deleteItemFromShoppingListService = async (userId, itemId) => {
  const queryText = `DELETE FROM shopping_list WHERE user_id = $1 AND item_id = $2 RETURNING *`;
  const values = [userId, itemId];

  try {
    const result = await pool.query(queryText, values);
    return result.rows[0];
  } catch (error) {
    console.error("Error deleting item from shopping list:", error);
    throw error;
  }
};

export const getTotalPriceOfShoppingListService = async (userId) => {
  const queryText = `
    SELECT SUM(si.price) AS total_price
    FROM shopping_list sl
    JOIN shop_items si ON sl.item_id = si.id
    WHERE sl.user_id = $1
  `;
  const values = [userId];

  try {
    const result = await pool.query(queryText, values);
    return result.rows[0].total_price;
  } catch (error) {
    console.error("Error calculating total price of shopping list:", error);
    throw error;
  }
};
