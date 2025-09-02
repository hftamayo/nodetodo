import request from "supertest";
import express from "express";

// Mock middleware
jest.mock("@middleware/authorize", () => () => (req: any, res: any, next: any) => next());
jest.mock("@middleware/validator", () => ({
  registerRules: [(req: any, res: any, next: any) => next()],
  loginRules: [(req: any, res: any, next: any) => next()],
  updateDetailsRules: [(req: any, res: any, next: any) => next()],
  updatePasswordRules: [(req: any, res: any, next: any) => next()],
}));
jest.mock("@middleware/validationResults", () => (req: any, res: any, next: any) => next());
jest.mock("@middleware/rateLimiter", () => ({
  signUpLimiter: (req: any, res: any, next: any) => next(),
  loginLimiter: (req: any, res: any, next: any) => next(),
}));

// Mock controller factory and its methods
const mockSignUpHandler = jest.fn((req: any, res: any) => res.status(201).json({ message: "signUpHandler called" }));
const mockLoginHandler = jest.fn((req: any, res: any) => res.status(200).json({ message: "loginHandler called" }));
const mockLogoutHandler = jest.fn((req: any, res: any) => res.status(200).json({ message: "logoutHandler called" }));
const mockListUsersHandler = jest.fn((req: any, res: any) => res.status(200).json({ message: "listUsersHandler called" }));
const mockListUserHandler = jest.fn((req: any, res: any) => res.status(200).json({ message: "listUserHandler called" }));
const mockUpdateUserDetailsHandler = jest.fn((req: any, res: any) => res.status(200).json({ message: "updateUserDetailsHandler called" }));
const mockUpdateUserPasswordHandler = jest.fn((req: any, res: any) => res.status(200).json({ message: "updateUserPasswordHandler called" }));
const mockDeleteUserHandler = jest.fn((req: any, res: any) => res.status(200).json({ message: "deleteUserHandler called" }));

jest.mock("@controllers/userController", () => () => ({
  signUpHandler: mockSignUpHandler,
  loginHandler: mockLoginHandler,
  logoutHandler: mockLogoutHandler,
  listUsersHandler: mockListUsersHandler,
  listUserHandler: mockListUserHandler,
  updateUserDetailsHandler: mockUpdateUserDetailsHandler,
  updateUserPasswordHandler: mockUpdateUserPasswordHandler,
  deleteUserHandler: mockDeleteUserHandler,
}));

import userRouter from "@/api/routes/user.routes";

const app = express();
app.use(express.json());
app.use("/users", userRouter);

afterEach(() => {
  jest.clearAllMocks();
});

describe("User Router", () => {
  it("should call signUpHandler on POST /users/register", async () => {
    const response = await request(app)
      .post("/users/register")
      .send({ name: "test", email: "test@example.com", password: "pass123", age: 30 });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("signUpHandler called");
    expect(mockSignUpHandler).toHaveBeenCalledTimes(1);
  });

  it("should call loginHandler on POST /users/login", async () => {
    const response = await request(app)
      .post("/users/login")
      .send({ email: "test@example.com", password: "pass123" });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("loginHandler called");
    expect(mockLoginHandler).toHaveBeenCalledTimes(1);
  });

  it("should call logoutHandler on POST /users/logout", async () => {
    const response = await request(app).post("/users/logout");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("logoutHandler called");
    expect(mockLogoutHandler).toHaveBeenCalledTimes(1);
  });

  it("should call listUsersHandler on GET /users/list", async () => {
    const response = await request(app).get("/users/list");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("listUsersHandler called");
    expect(mockListUsersHandler).toHaveBeenCalledTimes(1);
  });

  it("should call listUserHandler on GET /users/me", async () => {
    const response = await request(app).get("/users/me");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("listUserHandler called");
    expect(mockListUserHandler).toHaveBeenCalledTimes(1);
  });

  it("should call updateUserDetailsHandler on PATCH /users/updatedetails", async () => {
    const response = await request(app)
      .patch("/users/updatedetails")
      .send({ name: "updated", email: "updated@example.com", age: 31 });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("updateUserDetailsHandler called");
    expect(mockUpdateUserDetailsHandler).toHaveBeenCalledTimes(1);
  });

  it("should call updateUserPasswordHandler on PUT /users/updatepassword", async () => {
    const response = await request(app)
      .put("/users/updatepassword")
      .send({ password: "oldpass", newPassword: "newpass123" });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("updateUserPasswordHandler called");
    expect(mockUpdateUserPasswordHandler).toHaveBeenCalledTimes(1);
  });

  it("should call deleteUserHandler on DELETE /users/delete", async () => {
    const response = await request(app).delete("/users/delete");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("deleteUserHandler called");
    expect(mockDeleteUserHandler).toHaveBeenCalledTimes(1);
  });
}); 