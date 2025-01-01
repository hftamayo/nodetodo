import request from "supertest";
import express from "express";
import rateLimiter from "../../src/api/middleware/rateLimiter";
import * as envvars from "../../src/config/envvars";

const app = express();
app.use(express.json());

app.post("/signup", rateLimiter.signUpLimiter, (req, res) => {
  res.status(200).json({ message: "Signup successful" });
});

app.post("/login", rateLimiter.loginLimiter, (req, res) => {
  res.status(200).json({ message: "Login successful" });
});

describe("Rate Limiter Middleware", () => {
  beforeAll(() => {
    // Mock the mode to be "development" for testing purposes
    jest.spyOn(envvars, "mode", "get").mockReturnValue("development");
  });

  it("should allow multiple signup attempts in development mode", async () => {
    for (let i = 0; i < 100; i++) {
      const response = await request(app).post("/signup").send();
      expect(response.status).toBe(200);
    }
  });

  it("should block signup attempts after limit is reached in production mode", async () => {
    jest.spyOn(envvars, "mode", "get").mockReturnValue("production");
    for (let i = 0; i < 5; i++) {
      const response = await request(app).post("/signup").send();
      expect(response.status).toBe(200);
    }
    const response = await request(app).post("/signup").send();
    expect(response.status).toBe(429);
    expect(response.body.message).toBe(
      "Too many accounts created from this IP, please try again after an hour"
    );
  });

  it("should allow multiple login attempts in development mode", async () => {
    (envvars.mode as unknown) = "development";
    for (let i = 0; i < 100; i++) {
      const response = await request(app).post("/login").send();
      expect(response.status).toBe(200);
    }
  });

  it("should block login attempts after limit is reached in production mode", async () => {
    (envvars.mode as unknown) = "production";
    for (let i = 0; i < 3; i++) {
      const response = await request(app).post("/login").send();
      expect(response.status).toBe(200);
    }
    const response = await request(app).post("/login").send();
    expect(response.status).toBe(429);
    expect(response.body.message).toBe(
      "Too many login attempts from this IP, please try again after 15 minutes"
    );
  });
});
