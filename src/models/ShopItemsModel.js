import pool from "../config/db.js";

export const getAllshop_itemsService = async () => {
  const result = await pool.query(
    "SELECT * FROM shop_items WHERE active = true"
  );
  return result.rows;
};

export const getUserByIdService = async (id) => {
  const result = await pool.query("SELECT * FROM shop_items WHERE id = $1", [
    id,
  ]);
  return result.rows[0];
};

export const createShopItemService = async (name, email) => {
  const result = await pool.query(
    "INSERT INTO shop_items (name, email) VALUES ($1, $2) RETURNING *",
    [name, email]
  );
  return result.rows[0];
};

export const updateshop_itemservice = async (id, name, email) => {
  const result = await pool.query(
    "UPDATE shop_items SET name = $1, email = $2 WHERE id = $3 RETURNING *",
    [name, email, id]
  );
  return result.rows[0];
};

export const deleteshop_itemservice = async (id) => {
  const result = await pool.query(
    "UPDATE shop_items SET active = false WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};
