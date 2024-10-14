import request from "supertest";
import express from "express";
import userRouter from "../../src/api/routes/user";
import userController from "../../src/api/controllers/userController";
import userService from "../../src/services/userService";
import { UserServices } from "../../src/types/user.interface";

jest.mock("../../src/controllers/userController");
jest.mock("../../src/services/userService");

const app = express();
app.use(express.json());
app.use("/user", userRouter);

describe("User Router", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call registerHandler on POST /user/register", async () => {
    const mockRegisterHandler = userController(userService as UserServices)
      .registerHandler as jest.Mock;
    mockRegisterHandler.mockImplementation((req, res) =>
      res.status(200).json({ message: "User registered" })
    );

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
    const mockLoginHandler = userController(userService as UserServices)
      .loginHandler as jest.Mock;
    mockLoginHandler.mockImplementation((req, res) =>
      res.status(200).json({ message: "User logged in" })
    );

    const response = await request(app).post("/user/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User logged in");
    expect(mockLoginHandler).toHaveBeenCalledTimes(1);
  });

  it("should call logoutHandler on POST /user/logout", async () => {
    const mockLogoutHandler = userController(userService as UserServices)
      .logoutHandler as jest.Mock;
    mockLogoutHandler.mockImplementation((req, res) =>
      res.status(200).json({ message: "User logged out" })
    );

    const response = await request(app).post("/user/logout").send();

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User logged out");
    expect(mockLogoutHandler).toHaveBeenCalledTimes(1);
  });

  it("should call listUserHandler on GET /user/me", async () => {
    const mockListUserHandler = userController(userService as UserServices)
      .listUserHandler as jest.Mock;
    mockListUserHandler.mockImplementation((req, res) =>
      res.status(200).json({ user: { id: "user-id", username: "testuser" } })
    );

    const response = await request(app).get("/user/me").send();

    expect(response.status).toBe(200);
    expect(response.body.user).toEqual({ id: "user-id", username: "testuser" });
    expect(mockListUserHandler).toHaveBeenCalledTimes(1);
  });

  it("should call updateUserDetailsHandler on PUT /user/updatedetails", async () => {
    const mockUpdateUserDetailsHandler = userController(
      userService as UserServices
    ).updateUserDetailsHandler as jest.Mock;
    mockUpdateUserDetailsHandler.mockImplementation((req, res) =>
      res.status(200).json({ message: "User details updated" })
    );

    const response = await request(app).put("/user/updatedetails").send({
      username: "updateduser",
      email: "updated@example.com",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User details updated");
    expect(mockUpdateUserDetailsHandler).toHaveBeenCalledTimes(1);
  });

  it("should call updateUserPasswordHandler on PUT /user/updatepassword", async () => {
    const mockUpdateUserPasswordHandler = userController(
      userService as UserServices
    ).updateUserPasswordHandler as jest.Mock;
    mockUpdateUserPasswordHandler.mockImplementation((req, res) =>
      res.status(200).json({ message: "User password updated" })
    );

    const response = await request(app).put("/user/updatepassword").send({
      password: "newpassword123",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User password updated");
    expect(mockUpdateUserPasswordHandler).toHaveBeenCalledTimes(1);
  });

  it("should call deleteUserHandler on DELETE /user/deleteuser", async () => {
    const mockDeleteUserHandler = userController(userService as UserServices)
      .deleteUserHandler as jest.Mock;
    mockDeleteUserHandler.mockImplementation((req, res) =>
      res.status(200).json({ message: "User deleted" })
    );

    const response = await request(app).delete("/user/deleteuser").send({
      userId: "user-id",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("User deleted");
    expect(mockDeleteUserHandler).toHaveBeenCalledTimes(1);
  });
});
