import { validationResult, ValidationChain } from "express-validator";
import request from "supertest";
import express, { Request, Response } from "express";
import validator from "../../src/api/middleware/validator";

const app = express();
app.use(express.json());

const testValidationRules = (rules: ValidationChain[]) => {
  return async (req: Request, res: Response) => {
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

describe("Validator Middleware", () => {
  describe("Role Validators", () => {
    describe("createRoleRules", () => {
      it("should validate required role fields", () => {
        // Arrange
        const rules = validator.createRoleRules;
        const validRole = {
          role: {
            name: "Test Role",
            description: "Test Description",
            status: true,
            permissions: ["read", "write"],
          },
        };

        // Act & Assert
        rules.forEach((rule: ValidationChain) => {
          const validation = rule.run({ body: validRole });
          expect(validation).toBeDefined();
        });
      });

      it("should reject invalid role data", () => {
        // Arrange
        const rules = validator.createRoleRules;
        const invalidRole = {
          role: {
            name: "",
            description: "",
            status: "not-a-boolean",
            permissions: "not-an-array",
          },
        };

        // Act & Assert
        rules.forEach((rule: ValidationChain) => {
          const validation = rule.run({ body: invalidRole });
          expect(validation).toBeDefined();
        });
      });
    });

    describe("updateRoleRules", () => {
      it("should validate optional role fields", () => {
        // Arrange
        const rules = validator.updateRoleRules;
        const validRole = {
          role: {
            name: "Updated Role",
            description: "Updated Description",
            status: false,
            permissions: ["read"],
          },
        };

        // Act & Assert
        rules.forEach((rule: ValidationChain) => {
          const validation = rule.run({ body: validRole });
          expect(validation).toBeDefined();
        });
      });

      it("should allow partial role updates", () => {
        // Arrange
        const rules = validator.updateRoleRules;
        const partialRole = {
          role: {
            name: "Updated Role",
          },
        };

        // Act & Assert
        rules.forEach((rule: ValidationChain) => {
          const validation = rule.run({ body: partialRole });
          expect(validation).toBeDefined();
        });
      });
    });
  });

  describe("User Validators", () => {
    describe("registerRules", () => {
      it("should validate required user registration fields", () => {
        // Arrange
        const rules = validator.registerRules;
        const validUser = {
          name: "Test User",
          email: "test@example.com",
          password: "password123",
          age: "25",
        };

        // Act & Assert
        rules.forEach((rule: ValidationChain) => {
          const validation = rule.run({ body: validUser });
          expect(validation).toBeDefined();
        });
      });

      it("should reject invalid registration data", () => {
        // Arrange
        const rules = validator.registerRules;
        const invalidUser = {
          name: "",
          email: "invalid-email",
          password: "123",
          age: "not-a-number",
        };

        // Act & Assert
        rules.forEach((rule: ValidationChain) => {
          const validation = rule.run({ body: invalidUser });
          expect(validation).toBeDefined();
        });
      });
    });

    describe("loginRules", () => {
      it("should validate login credentials", () => {
        // Arrange
        const rules = validator.loginRules;
        const validCredentials = {
          email: "test@example.com",
          password: "password123",
        };

        // Act & Assert
        rules.forEach((rule: ValidationChain) => {
          const validation = rule.run({ body: validCredentials });
          expect(validation).toBeDefined();
        });
      });

      it("should reject invalid login data", () => {
        // Arrange
        const rules = validator.loginRules;
        const invalidCredentials = {
          email: "invalid-email",
          password: "123",
        };

        // Act & Assert
        rules.forEach((rule: ValidationChain) => {
          const validation = rule.run({ body: invalidCredentials });
          expect(validation).toBeDefined();
        });
      });
    });

    describe("updateDetailsRules", () => {
      it("should validate user update fields", () => {
        // Arrange
        const rules = validator.updateDetailsRules;
        const validUpdate = {
          user: {
            name: "Updated User",
            email: "updated@example.com",
            age: "30",
          },
        };

        // Act & Assert
        rules.forEach((rule: ValidationChain) => {
          const validation = rule.run({ body: validUpdate });
          expect(validation).toBeDefined();
        });
      });

      it("should reject invalid update data", () => {
        // Arrange
        const rules = validator.updateDetailsRules;
        const invalidUpdate = {
          user: {
            name: "",
            email: "invalid-email",
            age: "15", // Below minimum age
          },
        };

        // Act & Assert
        rules.forEach((rule: ValidationChain) => {
          const validation = rule.run({ body: invalidUpdate });
          expect(validation).toBeDefined();
        });
      });
    });

    describe("updatePasswordRules", () => {
      it("should validate password update fields", () => {
        // Arrange
        const rules = validator.updatePasswordRules;
        const validPasswords = {
          user: {
            password: "oldpassword123",
            newPassword: "newpassword123",
          },
        };

        // Act & Assert
        rules.forEach((rule: ValidationChain) => {
          const validation = rule.run({ body: validPasswords });
          expect(validation).toBeDefined();
        });
      });

      it("should reject invalid password data", () => {
        // Arrange
        const rules = validator.updatePasswordRules;
        const invalidPasswords = {
          user: {
            password: "123",
            newPassword: "456",
          },
        };

        // Act & Assert
        rules.forEach((rule: ValidationChain) => {
          const validation = rule.run({ body: invalidPasswords });
          expect(validation).toBeDefined();
        });
      });
    });
  });

  describe("Todo Validators", () => {
    describe("createTodoRules", () => {
      it("should validate required todo fields", () => {
        // Arrange
        const rules = validator.createTodoRules;
        const validTodo = {
          title: "Test Todo",
          description: "Test Description",
        };

        // Act & Assert
        rules.forEach((rule: ValidationChain) => {
          const validation = rule.run({ body: validTodo });
          expect(validation).toBeDefined();
        });
      });

      it("should reject invalid todo data", () => {
        // Arrange
        const rules = validator.createTodoRules;
        const invalidTodo = {
          title: "",
          description: "",
        };

        // Act & Assert
        rules.forEach((rule: ValidationChain) => {
          const validation = rule.run({ body: invalidTodo });
          expect(validation).toBeDefined();
        });
      });
    });

    describe("updateTodoRules", () => {
      it("should validate optional todo fields", () => {
        // Arrange
        const rules = validator.updateTodoRules;
        const validTodo = {
          title: "Updated Todo",
          description: "Updated Description",
          completed: true,
        };

        // Act & Assert
        rules.forEach((rule: ValidationChain) => {
          const validation = rule.run({ body: validTodo });
          expect(validation).toBeDefined();
        });
      });

      it("should allow partial todo updates", () => {
        // Arrange
        const rules = validator.updateTodoRules;
        const partialTodo = {
          title: "Updated Todo",
        };

        // Act & Assert
        rules.forEach((rule: ValidationChain) => {
          const validation = rule.run({ body: partialTodo });
          expect(validation).toBeDefined();
        });
      });

      it("should reject invalid todo update data", () => {
        // Arrange
        const rules = validator.updateTodoRules;
        const invalidTodo = {
          title: "",
          description: "",
          completed: "not-a-boolean",
        };

        // Act & Assert
        rules.forEach((rule: ValidationChain) => {
          const validation = rule.run({ body: invalidTodo });
          expect(validation).toBeDefined();
        });
      });
    });
  });
});
