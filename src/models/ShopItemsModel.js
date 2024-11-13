import pool from "../config/db.js";

export const getAllShopItemsService = async () => {
  const result = await pool.query("SELECT * FROM shop_items");
  return result.rows;
};

export const getShopItemByIdService = async (id) => {
  const result = await pool.query("SELECT * FROM shop_items WHERE id = $1", [
    id,
  ]);
  return result.rows[0];
};

export const createShopItemService = async (item_name, price) => {
  const result = await pool.query(
    "INSERT INTO shop_items (item_name, price) VALUES ($1, $2) RETURNING *",
    [item_name, price]
  );
  return result.rows[0];
};

export const updateShopItemService = async (id, item_name, price) => {
  const result = await pool.query(
    "UPDATE shop_items SET item_name = $1, price = $2 WHERE id = $3 RETURNING *",
    [item_name, price, id]
  );
  return result.rows[0];
};

export const deleteShopItemService = async (id) => {
  const result = await pool.query(
    "DELETE FROM shop_items WHERE id = $1 RETURNING *",
    [id]
  );

  return result.rows[0];
};
