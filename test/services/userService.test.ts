import { Document } from "mongoose";
import {
  mockUserRoleUser,
  mockUserInvalid,
  mockUserUpdate,
  mockUserDelete,
} from "../mocks/user.mock";
import userService from "../../src/services/userService";
import {
  UserRequest,
  UserIdRequest,
  UpdateUserRequest,
} from "../../src/types/user.interface";

describe("UserService Unit Tests", () => {
  afterEach(function () {
    jest.restoreAllMocks();
  });

  describe("signupUser()", () => {
    it("should create a new user with valid data", async () => {
      const requestBody = {
        name: mockUserRoleUser.name,
        email: mockUserRoleUser.email,
        password: mockUserRoleUser.password,
        age: mockUserRoleUser.age,
      };

      const mockUser: Partial<UserRequest & Document> = {
        ...requestBody,
        id: "123456789",
      };

      const mockResponse = {
        httpStatusCode: 200,
        message: "User created successfully",
        user: mockUser as any, //please improve this
      };

      jest.spyOn(userService, "signUpUser").mockResolvedValue(mockResponse);

      const response = await userService.signUpUser(requestBody);

      expect(response.httpStatusCode).toBe(200);
      expect(response.user).toBeDefined();
      expect(response.message).toBe("User created successfully");
      expect(response.user!.name).toBe(mockUserRoleUser.name);
      expect(response.user!.email).toBe(mockUserRoleUser.email);
      expect(response.user!.age).toBe(mockUserRoleUser.age);
    });

    it("should return an error if the user's email is already in use", async () => {
      const requestBody = {
        name: mockUserRoleUser.name,
        email: mockUserRoleUser.email,
        password: mockUserRoleUser.password,
        age: mockUserRoleUser.age,
      };

      const mockResponse = {
        httpStatusCode: 400,
        message: "Email already exists",
      };

      jest.spyOn(userService, "signUpUser").mockResolvedValue(mockResponse);

      const response = await userService.signUpUser(requestBody);

      expect(response.httpStatusCode).toBe(400);
      expect(response.message).toBe("Email already exists");
    });
  });

  describe("loginUser()", () => {
    it("should login a user with valid credentials", async () => {
      const requestBody = {
        email: mockUserRoleUser.email,
        password: mockUserRoleUser.password,
      };

      const mockUser: Partial<UserRequest & Document> = {
        ...requestBody,
        name: mockUserRoleUser.name,
        age: mockUserRoleUser.age,
      };

      const mockResponse = {
        httpStatusCode: 200,
        tokenCreated: "token",
        message: "User login successfully",
        user: mockUser as any,
      };

      jest.spyOn(userService, "loginUser").mockResolvedValue(mockResponse);

      const response = await userService.loginUser(requestBody);

      expect(response.httpStatusCode).toBe(200);
      expect(response.tokenCreated).toBeDefined();
      expect(response.user).toBeDefined();
      expect(response.message).toBe("User login successfully");
      expect(response.user!.name).toBe(mockUserRoleUser.name);
      expect(response.user!.email).toBe(mockUserRoleUser.email);
      expect(response.user!.age).toBe(mockUserRoleUser.age);
    });

    it("should not login if user does not exist", async () => {
      const requestBody = {
        email: mockUserInvalid.email,
        password: mockUserInvalid.password,
      };

      const mockResponse = {
        httpStatusCode: 404,
        message: "User or Password does not match",
      };

      jest.spyOn(userService, "loginUser").mockResolvedValue(mockResponse);

      const response = await userService.loginUser(requestBody);

      expect(response.httpStatusCode).toBe(404);
      expect(response.message).toBe("User or Password does not match");
    });

    it("should return an error if the password is incorrect", async () => {
      const requestBody = {
        email: mockUserInvalid.email,
        password: mockUserInvalid.password,
      };

      const mockResponse = {
        httpStatusCode: 404,
        message: "User or Password does not match",
      };

      jest.spyOn(userService, "loginUser").mockResolvedValue(mockResponse);

      const response = await userService.loginUser(requestBody);

      expect(response.httpStatusCode).toBe(404);
      expect(response.message).toBe("User or Password does not match");
    });
  });

  describe("listUserById()", () => {
    it("should return a user with valid id", async () => {
      const userId = mockUserRoleUser._id.toString();

      const userIdRequest: UserIdRequest = {
        userId: userId,
      };

      const mockResponse = {
        httpStatusCode: 200,
        message: "User Found",
        user: mockUserRoleUser as any,
      };

      jest.spyOn(userService, "listUserByID").mockResolvedValue(mockResponse);

      const response = await userService.listUserByID(userIdRequest);

      expect(response.httpStatusCode).toBe(200);
      expect(response.user).toBeDefined();
      expect(response.message).toBe("User Found");
      expect(response.user!.name).toBe(mockUserRoleUser.name);
      expect(response.user!.email).toBe(mockUserRoleUser.email);
      expect(response.user!.age).toBe(mockUserRoleUser.age);
    });

    it("should return an error if the user id is invalid", async () => {
      const userId = mockUserInvalid.id.toString();

      const userIdRequest: UserIdRequest = {
        userId: userId,
      };

      const mockResponse = {
        httpStatusCode: 404,
        message: "User Not Found",
      };

      jest.spyOn(userService, "listUserByID").mockResolvedValue(mockResponse);

      const response = await userService.listUserByID(userIdRequest);

      expect(response.httpStatusCode).toBe(404);
      expect(response.message).toBe("User Not Found");
    });
  });

  describe("updateUser()", () => {
    it("should update a user with valid data", async () => {
      const requestBody: UpdateUserRequest = {
        userId: mockUserUpdate.id,
        user: {
          name: mockUserUpdate.name,
          email: mockUserUpdate.email,
          age: mockUserUpdate.age,
        },
      };

      const mockUser: Partial<UserRequest> = {
        name: mockUserUpdate.name,
        email: mockUserUpdate.email,
        age: mockUserUpdate.age,
      };

      const mockResponse = {
        httpStatusCode: 200,
        message: "User updated successfully",
        user: mockUser as any,
      };

      jest
        .spyOn(userService, "updateUserDetailsByID")
        .mockResolvedValue(mockResponse);

      const response = await userService.updateUserDetailsByID(requestBody);

      expect(response.httpStatusCode).toBe(200);
      expect(response.user).toBeDefined();
      expect(response.message).toBe("User updated successfully");
      expect(response.user!.name).toBe(mockUserUpdate.name);
      expect(response.user!.email).toBe(mockUserUpdate.email);
      expect(response.user!.age).toBe(mockUserUpdate.age);
    });

    it("should not update if the user has already taken", async () => {
      const requestBody: UpdateUserRequest = {
        userId: mockUserUpdate.id,
        user: {
          name: mockUserUpdate.name,
          email: mockUserUpdate.email,
          age: mockUserUpdate.age,
        },
      };

      const mockResponse = {
        httpStatusCode: 400,
        message: "Email already taken",
      };

      jest
        .spyOn(userService, "updateUserDetailsByID")
        .mockResolvedValue(mockResponse);

      const response = await userService.updateUserDetailsByID(requestBody);

      expect(response.httpStatusCode).toBe(400);
      expect(response.message).toBe("Email already taken");
    });

    it("should not update if current passwod did not match", async () => {
      const requestBody = {
        userId: mockUserUpdate.id,
        user: {
          password: mockUserUpdate.notMatchPassword,
          newPassword: mockUserUpdate.newPassword,
        },
      };

      const mockResponse = {
        httpStatusCode: 400,
        message: "Password does not match",
      };

      jest
        .spyOn(userService, "updateUserPasswordByID")
        .mockResolvedValue(mockResponse);

      const response = await userService.updateUserPasswordByID(requestBody);

      expect(response.httpStatusCode).toBe(400);
      expect(response.message).toBe("Password does not match");
    });

    it("should update the password of a valid user", async () => {
      const requestBody = {
        userId: mockUserUpdate.id,
        user: {
          password: mockUserUpdate.oldPassword,
          newPassword: mockUserUpdate.newPassword,
        },
      };

      const mockUser: Partial<UserRequest> = {
        password: mockUserUpdate.oldPassword,
        newPassword: mockUserUpdate.newPassword,
      };

      const mockResponse = {
        httpStatusCode: 200,
        message: "Password updated successfully",
        user: mockUser as any,
      };

      jest.spyOn(userService, "updateUserPasswordByID").mockResolvedValue(mockResponse);

      const response = await userService.updateUserPasswordByID(requestBody);

      expect(response.httpStatusCode).toBe(200);
      expect(response.user).toBeDefined();
      expect(response.message).toBe("Password updated successfully");
      expect(response.user!.name).toBe(mockUserUpdate.name);
      expect(response.user!.email).toBe(mockUserUpdate.email);
      expect(response.user!.age).toBe(mockUserUpdate.age);
    });
  });

  describe("deleteUser()", () => {
    it("should delete a user with valid id", async () => {
      const userId = mockUserDelete.id;

      const userIdRequest: UserIdRequest = {
        userId: userId,
      };

      const mockResponse = {
        httpStatusCode: 200,
        message: "User deleted successfully",
      };

      jest.spyOn(userService, "deleteUserByID").mockResolvedValue(mockResponse);

      const response = await userService.deleteUserByID(userIdRequest);

      expect(response.httpStatusCode).toBe(200);
      expect(response.message).toBe("User deleted successfully");
    });

    it("should return an error if the user id is invalid", async () => {
      const userId = mockUserInvalid.id;

      const userIdRequest: UserIdRequest = {
        userId: userId,
      };

      const mockResponse = {
        httpStatusCode: 404,
        message: "User Not Found",
      };

      jest.spyOn(userService, "deleteUserByID").mockResolvedValue(mockResponse);

      const response = await userService.deleteUserByID(userIdRequest);

      expect(response.httpStatusCode).toBe(404);
      expect(response.message).toBe("User Not Found");
    });
  });
});
