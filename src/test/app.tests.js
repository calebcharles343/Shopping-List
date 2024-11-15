import request from "supertest";
import app from "../app"; // Import the app without starting the server

describe("API Basic Tests", () => {
  it("should return a 200 status code for Swagger API Docs", async () => {
    const res = await request(app).get("/shopping-list/api-docs");
    expect(res.statusCode).toBe(200);
  });

  it("should limit too many requests from the same IP", async () => {
    // Simulate too many requests to trigger the rate limiter
    for (let i = 0; i < 101; i++) {
      await request(app).get("/api/v1/shopping-list/items");
    }

    const res = await request(app).get("/api/v1/shopping-list/items");
    expect(res.statusCode).toBe(429); // 429 is the status for Too Many Requests
    expect(res.body.message).toBe(
      "Too many requests from this IP, please try again in an hour!"
    );
  });
});
