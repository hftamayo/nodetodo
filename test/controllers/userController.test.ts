import { Request, Response } from "express";
import {
  mockUserRoleUser,
  mockUserInvalid,
  mockUserUpdate,
  mockUserDelete,
  mockUserRoleAdmin,
} from "../mocks/user.mock";
import {
  UserRequest,
  UserIdRequest,
  LoginRequest,
  UpdateUserRequest,
  UserServices,
} from "../../src/types/user.interface";
import userController from "../../src/api/controllers/userController";
import { cookie } from "express-validator";

describe("userController Unit Test", () => {
  let req:
    | UserRequest
    | LoginRequest
    | Request
    | UserIdRequest
    | UpdateUserRequest;
  let res: Response<any, Record<string, any>>;
  let json: jest.Mock;
  let signUpUserStub: jest.Mock<any, any, any>;
  let loginStub: jest.Mock<any, any, any>;
  let logoutStub: jest.Mock<any, any, any>;
  let listUserByIDStub: jest.Mock<any, any, any>;
  let updateUserDetailsByIDStub: jest.Mock<any, any, any>;
  let updateUserPasswordByIDStub: jest.Mock<any, any, any>;
  let deleteUserByIDStub: jest.Mock<any, any, any>;
  let controller: ReturnType<typeof userController>;
  let mockUserService: UserServices;

  beforeEach(() => {
    req = {} as
      | UserRequest
      | LoginRequest
      | Request
      | UserIdRequest
      | UpdateUserRequest;
    json = jest.fn();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response<any, Record<string, any>>;

    signUpUserStub = jest.fn((user) => {
      if (user === mockUserInvalid) {
        return Promise.resolve({
          httpStatusCode: 400,
          message: "Email already exists",
        });
      }
      return Promise.resolve({
        httpStatusCode: 200,
        message: "User created successfully",
        user: mockUserRoleUser,
      });
    });

    loginStub = jest.fn((user) => {
      if (user.email === mockUserInvalid.email) {
        return Promise.resolve({
          httpStatusCode: 404,
          message: "User or Password does not match",
        });
      }
      return Promise.resolve({
        httpStatusCode: 200,
        message: "User login successfully",
        user: mockUserRoleUser,
        tokenCreated: "token",
        token: "token",
      });
    });

    logoutStub = jest.fn(() => {
      return Promise.resolve({
        httpStatusCode: 200,
        message: "User logged out successfully",
      });
    });

    listUserByIDStub = jest.fn((user) => {
      if (user.id === mockUserInvalid.id) {
        return Promise.resolve({
          httpStatusCode: 404,
          message: "User Not Found",
        });
      }
      return Promise.resolve({
        httpStatusCode: 200,
        message: "User Found",
        user: mockUserRoleUser,
      });
    });

    updateUserDetailsByIDStub = jest.fn((user) => {
      if (user.id === mockUserInvalid.id) {
        return Promise.resolve({
          httpStatusCode: 404,
          message: "User Not Found",
        });
      }
      return Promise.resolve({
        httpStatusCode: 200,
        message: "Data updated successfully",
        user: mockUserRoleUser,
      });
    });

    updateUserPasswordByIDStub = jest.fn((user) => {
      if (user.id === mockUserInvalid.id) {
        return Promise.resolve({
          httpStatusCode: 404,
          message: "User Not Found",
        });
      }
      if (user.password === mockUserUpdate.notMatchPassword) {
        return Promise.resolve({
          httpStatusCode: 400,
          message: "The entered credentials are not valid",
        });
      }
      return Promise.resolve({
        httpStatusCode: 200,
        message: "Password updated successfully",
        user: mockUserRoleUser,
      });
    });

    deleteUserByIDStub = jest.fn((user) => {
      if (user.userId === mockUserInvalid.id) {
        return Promise.resolve({
          httpStatusCode: 404,
          message: "User Not Found",
        });
      }
      return Promise.resolve({
        httpStatusCode: 200,
        message: "User deleted successfully",
      });
    });

    mockUserService = {
      signUpUser: signUpUserStub,
      loginUser: loginStub,
      logoutUser: logoutStub,
      listUserByID: listUserByIDStub,
      updateUserDetailsByID: updateUserDetailsByIDStub,
      updateUserPasswordByID: updateUserPasswordByIDStub,
      deleteUserByID: deleteUserByIDStub,
    };

    controller = userController(mockUserService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("register method", () => {
    it("should register a new user", async () => {
      const { _id, ...userWithoutId } = mockUserRoleUser;
      req = userWithoutId as UserRequest;

      await controller.registerHandler(req as UserRequest, res);

      const { password, ...filteredMockUser } = mockUserRoleUser;

      expect(signUpUserStub).toHaveBeenCalledTimes(1);
      expect(signUpUserStub).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledTimes(1);
      expect(json).toHaveBeenCalledWith({
        resultMessage: "User created successfully",
        newUser: filteredMockUser,
      });
    });

    it("should restrict to register an existing user", async () => {
      req = mockUserInvalid as UserRequest;

      await controller.registerHandler(req as UserRequest, res);

      expect(signUpUserStub).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledTimes(1);
      expect(json).toHaveBeenCalledWith({
        resultMessage: "Email already exists",
      });
    });
  });

  describe("login method", () => {
    it("should login a valid user", async () => {
      const { email, password } = mockUserRoleUser;
      req = { email, password } as LoginRequest;

      await controller.loginHandler(req, res);

      const { password: _, ...filteredMockUser } = mockUserRoleUser;

      expect(loginStub).toHaveBeenCalledTimes(1);
      expect(loginStub).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledTimes(1);
      expect(json).toHaveBeenCalledWith({
        resultMessage: "User login successfully",
        loggedUser: filteredMockUser,
      });
      expect(cookie).toHaveBeenCalledTimes(1);
      expect(cookie).toHaveBeenCalledWith("nodetodo", "token", {
        httpOnly: true,
        expiresIn: 360000,
      });
    });

    it("should restrict login an invalid user", async () => {
      const { email, password } = mockUserInvalid;
      req = { email, password } as LoginRequest;

      await controller.loginHandler(req, res);

      expect(loginStub).toHaveBeenCalledTimes(1);
      expect(loginStub).toHaveBeenCalledWith(404);
      expect(json).toHaveBeenCalledTimes(1);
      expect(json).toHaveBeenCalledWith({
        resultMessage: "User or Password does not match",
      });
    });
  });

  describe("logout method", () => {
    it("should logout a user", async () => {
      await controller.logoutHandler(req as Request, res);

      expect(res.clearCookie).toHaveBeenCalledTimes(1);
      expect(res.clearCookie).toHaveBeenCalledWith("nodetodo");
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("listUser method", () => {
    it("should get details of a valid user", async () => {
      const userId = mockUserRoleUser._id.toString();
      req = { userId } as UserIdRequest;

      await controller.listUserHandler(req, res);

      const { password, ...filteredMockUser } = mockUserRoleUser;

      expect(listUserByIDStub).toHaveBeenCalledTimes(1);
      expect(listUserByIDStub).toHaveBeenCalledWith(userId);
      expect(json).toHaveBeenCalledWith({
        resultMessage: "User Found",
        searchUser: filteredMockUser,
      });
    });

    it("should restrict to get details of an invalid user", async () => {
      const userId = mockUserInvalid.id;
      req = { userId } as UserIdRequest;

      await controller.listUserHandler(req, res);

      expect(listUserByIDStub).toHaveBeenCalledTimes(1);
      expect(listUserByIDStub).toHaveBeenCalledWith(userId);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(json).toHaveBeenCalledWith({
        resultMessage: "User Not Found",
      });
    });
  });

  describe("updateDetails method", () => {
    it("should update details of a valid user", async () => {
      const expectedUpdateProperties = {
        name: mockUserUpdate.name,
        email: mockUserUpdate.email,
        age: mockUserUpdate.age,
      };

      const req = {
        userId: mockUserRoleUser._id.toString(),
        user: expectedUpdateProperties,
      } as UpdateUserRequest;

      await controller.updateUserDetailsHandler(req, res);

      const { password, ...filteredMockUser } = mockUserRoleUser;

      expect(updateUserDetailsByIDStub).toHaveBeenCalledTimes(1);
      expect(updateUserDetailsByIDStub).toHaveBeenCalledWith(200);
      expect(updateUserDetailsByIDStub).toHaveBeenCalledWith(
        mockUserRoleUser,
        expectedUpdateProperties
      );
      expect(json).toHaveBeenCalledTimes(1);
      expect(json).toHaveBeenCalledWith({
        resultMessage: "Data updated successfully",
        updatedUser: filteredMockUser,
      });
    });

    it("should restrict to update details of an invalid user", async () => {
      const expectedUpdateProperties = {
        name: mockUserUpdate.name,
        email: mockUserUpdate.email,
        age: mockUserUpdate.age,
      };

      const req = {
        userId: mockUserInvalid.id,
        user: expectedUpdateProperties,
      } as UpdateUserRequest;

      await controller.updateUserDetailsHandler(req, res);

      expect(updateUserDetailsByIDStub).toHaveBeenCalledTimes(1);
      expect(updateUserDetailsByIDStub).toHaveBeenCalledWith(404);
      expect(json).toHaveBeenCalledTimes(1);
      expect(json).toHaveBeenCalledWith({
        resultMessage: "User Not Found",
      });
    });
  });

  describe("updatePassword method", () => {
    it("should update password of a valid user", async () => {
      const expectedUpdateProperties = {
        password: mockUserUpdate.oldPassword,
        newPassword: mockUserUpdate.newPassword,
      };

      const req = {
        userId: mockUserRoleUser._id.toString(),
        user: expectedUpdateProperties,
      } as UpdateUserRequest;

      await controller.updateUserPasswordHandler(req, res);

      const { password, ...filteredMockUser } = mockUserRoleUser;

      expect(updateUserPasswordByIDStub).toHaveBeenCalledTimes(1);
      expect(updateUserPasswordByIDStub).toHaveBeenCalledWith(200);
      expect(updateUserPasswordByIDStub).toHaveBeenCalledWith(
        mockUserRoleUser,
        expectedUpdateProperties
      );
      expect(json).toHaveBeenCalledTimes(1);
      expect(json).toHaveBeenCalledWith({
        resultMessage: "Password updated successfully",
        updatedUser: filteredMockUser,
      });
    });

    it("should restrict to update password of an invalid user", async () => {
      const expectedUpdateProperties = {
        password: mockUserUpdate.oldPassword,
        newPassword: mockUserUpdate.newPassword,
      };

      const req = {
        userId: mockUserInvalid.id,
        user: expectedUpdateProperties,
      } as UpdateUserRequest;

      await controller.updateUserPasswordHandler(req, res);

      expect(updateUserPasswordByIDStub).toHaveBeenCalledTimes(1);
      expect(updateUserPasswordByIDStub).toHaveBeenCalledWith(404);
      expect(json).toHaveBeenCalledTimes(1);
      expect(json).toHaveBeenCalledWith({
        resultMessage: "User Not Found",
      });
    });

    it("should restrict to update password of a valid user with incorrect password", async () => {
      const expectedUpdateProperties = {
        password: mockUserUpdate.notMatchPassword,
        newPassword: mockUserUpdate.newPassword,
      };

      const req = {
        userId: mockUserRoleUser._id.toString(),
        user: expectedUpdateProperties,
      } as UpdateUserRequest;

      await controller.updateUserPasswordHandler(req, res);

      expect(updateUserPasswordByIDStub).toHaveBeenCalledTimes(1);
      expect(updateUserPasswordByIDStub).toHaveBeenCalledWith(400);
      expect(json).toHaveBeenCalledTimes(1);
      expect(json).toHaveBeenCalledWith({
        resultMessage: "The entered credentials are not valid",
      });
    });
  });

  describe("deleteUser method", () => {
    it("should delete a valid user", async () => {
      const userId = mockUserDelete.id;
      req = { userId } as UserIdRequest;

      await controller.deleteUserHandler(req, res);

      expect(deleteUserByIDStub).toHaveBeenCalledTimes(1);
      expect(deleteUserByIDStub).toHaveBeenCalledWith({ userId });
      // expect(json).toHaveBeenCalledWith({
      //   resultMessage: "User deleted successfully",
      // });
    });

    it("should restrict to delete an invalid user", async () => {
      const userId = mockUserInvalid.id;
      req = { userId } as UserIdRequest;

      await controller.deleteUserHandler(req, res);

      console.log("deleteUserByIDStub calls:", deleteUserByIDStub.mock.calls);
      console.log("res.status calls:", (res.status as jest.Mock).mock.calls);
      console.log("res.json calls:", json.mock.calls);

      expect(deleteUserByIDStub).toHaveBeenCalledTimes(1);
      expect(deleteUserByIDStub).toHaveBeenCalledWith({ userId });
      expect(res.status).toHaveBeenCalledWith(404);
      // expect(json).toHaveBeenCalledWith({
      //   resultMessage: "User Not Found",
      // });
    });
  });
});
