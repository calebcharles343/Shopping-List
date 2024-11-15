import request from "supertest";
import app from "../app.js";
import pool from "../config/db.js";

describe("User API Tests", () => {
  beforeAll(async () => {
    // Setup: Reset the database or run necessary migrations
    await pool.query("DELETE FROM users"); // Clear users table
  });

  afterAll(async () => {
    // Teardown: Close database connection after all tests
    await pool.end();
  });

  it("should create a new user", async () => {
    const newUser = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    };

    const res = await request(app)
      .post("/api/v1/shopping-list/users")
      .send(newUser);

    expect(res.statusCode).toBe(201);
    expect(res.body.username).toBe(newUser.username);
    expect(res.body.email).toBe(newUser.email);
  });

  it("should retrieve all users", async () => {
    const res = await request(app).get("/api/v1/shopping-list/users");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
