import request from "supertest";
import express, { Request, Response } from "express";
import { check } from "express-validator";
import validateResult from "../../src/api/middleware/validationResults";

const app = express();
app.use(express.json());

app.post(
  "/test",
  [
    check("email", "Please provide a valid email").isEmail(),
    check("password", "Password must be at least 6 characters long").isLength({
      min: 6,
    }),
  ],
  validateResult,
  (req: Request, res: Response) => {
    res.status(200).json({ message: "Validation passed" });
  }
);

describe("validateResult Middleware", () => {
  it("should return 400 if validation errors exist", async () => {
    const response = await request(app).post("/test").send({
      email: "invalid-email",
      password: "123",
    });

    expect(response.status).toBe(400);
    expect(response.body.msg).toBe("Please provide a valid email");
  });

  it("should proceed to next middleware if no validation errors", async () => {
    const response = await request(app).post("/test").send({
      email: "test@example.com",
      password: "123456",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Validation passed");
  });
});
