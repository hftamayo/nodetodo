import { validationResult } from "express-validator";
import request from "supertest";
import express from "express";
import validator from "../../src/api/middleware/validator";

const app = express();
app.use(express.json());

const testValidationRules = (rules: any[]) => {
  return async (req: any, res: any) => {
    await Promise.all(rules.map((rule) => rule.run(req)));
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    res.status(200).json({ message: "Validation passed" });
  };
};

describe("Validation Rules", () => {
  beforeAll(() => {
    app.post("/register", testValidationRules(validator.registerRules));
    app.post("/login", testValidationRules(validator.loginRules));
    app.post(
      "/update-details",
      testValidationRules(validator.updateDetailsRules)
    );
    app.post(
      "/update-password",
      testValidationRules(validator.updatePasswordRules)
    );
    app.post("/create-todo", testValidationRules(validator.createTodoRules));
    app.post("/update-todo", testValidationRules(validator.updateTodoRules));
  });

  it("should validate register rules", async () => {
    const response = await request(app).post("/register").send({
      name: "",
      email: "invalid-email",
      password: "123",
      age: "not-a-number",
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toHaveLength(4);
  });

  it("should validate login rules", async () => {
    const response = await request(app).post("/login").send({
      email: "invalid-email",
      password: "123",
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toHaveLength(2);
  });

  it("should validate update details rules", async () => {
    const response = await request(app)
      .post("/update-details")
      .send({
        user: {
          name: "",
          email: "invalid-email",
          age: "not-a-number",
        },
      });

    expect(response.status).toBe(400);
    expect(response.body.errors).toHaveLength(4);
  });

  it("should validate update password rules", async () => {
    const response = await request(app)
      .post("/update-password")
      .send({
        user: {
          password: "123",
          newPassword: "123",
        },
      });

    expect(response.status).toBe(400);
    expect(response.body.errors).toHaveLength(2);
  });

  it("should validate create todo rules", async () => {
    const response = await request(app).post("/create-todo").send({
      title: "",
      description: "",
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toHaveLength(2);
  });

  it("should validate update todo rules", async () => {
    const response = await request(app).post("/update-todo").send({
      title: "",
      description: "",
      completed: "not-a-boolean",
    });

    expect(response.status).toBe(400);
    expect(response.body.errors).toHaveLength(3);
  });
});
