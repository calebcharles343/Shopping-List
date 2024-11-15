import request from "supertest";
import app from "../app.js";
import pool from "../config/db.js";

describe("Shop Items API Tests", () => {
  beforeAll(async () => {
    // Setup: Reset the database or run necessary migrations
    await pool.query("DELETE FROM shop_items"); // Clear shop items table
  });

  afterAll(async () => {
    // Teardown: Close database connection after all tests
    await pool.end();
  });

  it("should create a new shop item", async () => {
    const newItem = {
      name: "Milk",
      quantity: 2,
      price: 5.0,
    };

    const res = await request(app)
      .post("/api/v1/shopping-list/items")
      .send(newItem);

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe(newItem.name);
    expect(res.body.quantity).toBe(newItem.quantity);
  });

  it("should retrieve all shop items", async () => {
    const res = await request(app).get("/api/v1/shopping-list/items");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
