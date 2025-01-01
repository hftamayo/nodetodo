import request from "supertest";
import userRouter from "../../src/api/routes/user";
import userController from "../../src/api/controllers/userController";
import express, { Request, Response, NextFunction } from "express";

jest.mock("../../src/api/controllers/userController");
jest.mock("../../src/services/userService");

interface AuthenticatedRequest extends Request {
  user?: { userId: string };
}

jest.mock(
  "../../src/api/middleware/authorize",
  () => (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    req.body.userId = "user-id";
    next();
  }
);

const app = express();
app.use(express.json());
app.use("/user", userRouter);

describe("User Router", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call registerHandler on POST /user/register", async () => {
    const mockRegisterHandler = jest.fn((req, res) =>
      res.status(200).json({ message: "User registered" })
    );
    (userController as any).registerHandler = mockRegisterHandler;

    const response = await request(app).post("/user/register").send({
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User registered");
    expect(mockRegisterHandler).toHaveBeenCalledTimes(1);
  });

  it("should call loginHandler on POST /user/login", async () => {
    const mockLoginHandler = jest.fn((req, res) =>
      res.status(200).json({ message: "User logged in" })
    );
    (userController as any).loginHandler = mockLoginHandler;

    const response = await request(app).post("/user/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User logged in");
    expect(mockLoginHandler).toHaveBeenCalledTimes(1);
  });

  it("should call logoutHandler on POST /user/logout", async () => {
    const mockLogoutHandler = jest.fn((req, res) =>
      res.status(200).json({ message: "User logged out" })
    );
    (userController as any).logoutHandler = mockLogoutHandler;

    const response = await request(app).post("/user/logout").send();

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User logged out");
    expect(mockLogoutHandler).toHaveBeenCalledTimes(1);
  });

  it("should call listUserHandler on GET /user/me", async () => {
    const mockListUserHandler = jest.fn((req, res) =>
      res.status(200).json({ user: { id: "user-id", username: "testuser" } })
    );
    (userController as any).listUserHandler = mockListUserHandler;

    const response = await request(app).get("/user/me").send();

    expect(response.status).toBe(200);
    expect(response.body.user).toEqual({ id: "user-id", username: "testuser" });
    expect(mockListUserHandler).toHaveBeenCalledTimes(1);
  });

  it("should call updateUserDetailsHandler on PUT /user/updatedetails", async () => {
    const mockUpdateUserDetailsHandler = jest.fn((req, res) =>
      res.status(200).json({ message: "User details updated" })
    );
    (userController as any).updateUserDetailsHandler =
      mockUpdateUserDetailsHandler;

    const response = await request(app).put("/user/updatedetails").send({
      username: "updateduser",
      email: "updated@example.com",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User details updated");
    expect(mockUpdateUserDetailsHandler).toHaveBeenCalledTimes(1);
  });

  it("should call updateUserPasswordHandler on PUT /user/updatepassword", async () => {
    const mockUpdateUserPasswordHandler = jest.fn((req, res) =>
      res.status(200).json({ message: "User password updated" })
    );
    (userController as any).updateUserPasswordHandler =
      mockUpdateUserPasswordHandler;

    const response = await request(app).put("/user/updatepassword").send({
      password: "newpassword123",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User password updated");
    expect(mockUpdateUserPasswordHandler).toHaveBeenCalledTimes(1);
  });

  it.only("should call deleteUserHandler on DELETE /user/deleteuser", async () => {
    const mockDeleteUserHandler = jest.fn((req, res) =>
      res.status(200).json({ message: "User deleted" })
    );
    (userController as any).deleteUserHandler = mockDeleteUserHandler;

    const response = await request(app).delete("/user/deleteuser").send({
      userId: "user-id",
    });

    console.log("response.status:", response.status);
    console.log("response.body:", response.body);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User deleted");
    expect(mockDeleteUserHandler).toHaveBeenCalledTimes(1);
  });
});
