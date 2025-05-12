import { Response } from "express";
import userController from "../../src/api/controllers/userController";
import { mockUserRoleUser, mockUserRoleSupervisor } from "../mocks/user.mock";
import { mockRolesData } from "../mocks/role.mock";
import {
  AuthenticatedUserRequest,
  UserServices,
  SignUpRequest,
  UpdateUserRequest,
} from "@/types/user.types";

jest.mock("@/services/userService");

describe("UserController Unit Tests", () => {
  let mockRequest: Partial<AuthenticatedUserRequest>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let mockUserService: UserServices;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockResponse = {
      json: mockJson,
      status: mockStatus,
    };
    mockRequest = {};
    mockUserService = {
      signUpUser: jest.fn(),
      loginUser: jest.fn(),
      logoutUser: jest.fn(),
      listUsers: jest.fn(),
      listUserByID: jest.fn(),
      updateUserDetailsByID: jest.fn(),
      updateUserPasswordByID: jest.fn(),
      deleteUserByID: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("listUsersHandler", () => {
    it("should return a list of users with pagination", async () => {
      // Arrange
      mockRequest.query = {
        page: "1",
        limit: "10",
      };
      mockRequest.user = {
        sub: mockUserRoleUser._id.toString(),
        role: "user",
      };

      const mockUsers = [mockUserRoleUser, mockUserRoleSupervisor];
      (mockUserService.listUsers as jest.Mock).mockResolvedValue({
        httpStatusCode: 200,
        message: "USERS_FOUND",
        users: mockUsers,
      });

      // Act
      await userController(mockUserService).listUsersHandler(
        mockRequest as AuthenticatedUserRequest,
        mockResponse as Response
      );

      // Assert
      expect(mockUserService.listUsers).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
      });
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        code: 200,
        resultMessage: "USERS_FOUND",
        users: mockUsers,
      });
    });

    it("should handle errors when listing users", async () => {
      // Arrange
      mockRequest.query = {
        page: "1",
        limit: "10",
      };
      mockRequest.user = {
        sub: mockUserRoleUser._id.toString(),
        role: "user",
      };

      (mockUserService.listUsers as jest.Mock).mockResolvedValue({
        httpStatusCode: 404,
        message: "USERS_NOT_FOUND",
      });

      // Act
      await userController(mockUserService).listUsersHandler(
        mockRequest as AuthenticatedUserRequest,
        mockResponse as Response
      );

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        code: 404,
        resultMessage: "USERS_NOT_FOUND",
      });
    });
  });

  describe("listUserHandler", () => {
    it("should return a user when found", async () => {
      // Arrange
      mockRequest.user = {
        sub: mockUserRoleUser._id.toString(),
        role: "user",
      };

      (mockUserService.listUserByID as jest.Mock).mockResolvedValue({
        httpStatusCode: 200,
        message: "ENTITY_FOUND",
        user: mockUserRoleUser,
      });

      // Act
      await userController(mockUserService).listUserHandler(
        mockRequest as AuthenticatedUserRequest,
        mockResponse as Response
      );

      // Assert
      expect(mockUserService.listUserByID).toHaveBeenCalledWith(
        mockUserRoleUser._id.toString()
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        code: 200,
        resultMessage: "ENTITY_FOUND",
        user: mockUserRoleUser,
      });
    });

    it("should handle errors when user is not found", async () => {
      // Arrange
      mockRequest.user = {
        sub: "nonexistentid",
        role: "user",
      };

      (mockUserService.listUserByID as jest.Mock).mockResolvedValue({
        httpStatusCode: 404,
        message: "ENTITY_NOT_FOUND",
      });

      // Act
      await userController(mockUserService).listUserHandler(
        mockRequest as AuthenticatedUserRequest,
        mockResponse as Response
      );

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        code: 404,
        resultMessage: "ENTITY_NOT_FOUND",
      });
    });
  });

  describe("signUpHandler", () => {
    it("should create a new user successfully", async () => {
      // Arrange
      const signUpRequest: SignUpRequest = {
        name: "New User",
        email: "newuser@example.com",
        password: "password123",
        repeatPassword: "password123",
        age: 25,
      };
      mockRequest.body = signUpRequest;

      const newUser = {
        _id: "newuserid",
        name: signUpRequest.name,
        email: signUpRequest.email,
        role: mockRolesData[1]._id,
      };

      (mockUserService.signUpUser as jest.Mock).mockResolvedValue({
        httpStatusCode: 201,
        message: "USER_CREATED",
        user: newUser,
      });

      // Act
      await userController(mockUserService).signUpHandler(
        signUpRequest,
        mockResponse as Response
      );

      // Assert
      expect(mockUserService.signUpUser).toHaveBeenCalledWith(signUpRequest);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith({
        code: 201,
        resultMessage: "USER_CREATED",
        user: newUser,
      });
    });

    it("should handle errors when creating user", async () => {
      // Arrange
      const signUpRequest: SignUpRequest = {
        name: "",
        email: "",
        password: "",
        repeatPassword: "",
        age: 0,
      };
      mockRequest.body = signUpRequest;

      (mockUserService.signUpUser as jest.Mock).mockResolvedValue({
        httpStatusCode: 400,
        message: "MISSING_FIELDS",
      });

      // Act
      await userController(mockUserService).signUpHandler(
        signUpRequest,
        mockResponse as Response
      );

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        code: 400,
        resultMessage: "MISSING_FIELDS",
      });
    });
  });

  describe("updateUserDetailsHandler", () => {
    it("should update a user successfully", async () => {
      // Arrange
      const updateRequest: UpdateUserRequest = {
        userId: mockUserRoleUser._id.toString(),
        user: {
          name: "Updated Name",
          email: "updated@example.com",
        },
      };
      mockRequest.body = updateRequest;

      const updatedUser = {
        ...mockUserRoleUser,
        name: updateRequest.user.name,
        email: updateRequest.user.email,
      };

      (mockUserService.updateUserDetailsByID as jest.Mock).mockResolvedValue({
        httpStatusCode: 200,
        message: "ENTITY_UPDATED",
        user: updatedUser,
      });

      // Act
      await userController(mockUserService).updateUserDetailsHandler(
        updateRequest,
        mockResponse as Response
      );

      // Assert
      expect(mockUserService.updateUserDetailsByID).toHaveBeenCalledWith(
        updateRequest
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        code: 200,
        resultMessage: "ENTITY_UPDATED",
        user: updatedUser,
      });
    });

    it("should handle errors when updating user", async () => {
      // Arrange
      const updateRequest: UpdateUserRequest = {
        userId: "nonexistentid",
        user: {
          name: "Updated Name",
        },
      };
      mockRequest.body = updateRequest;

      (mockUserService.updateUserDetailsByID as jest.Mock).mockResolvedValue({
        httpStatusCode: 404,
        message: "ENTITY_NOT_FOUND",
      });

      // Act
      await userController(mockUserService).updateUserDetailsHandler(
        updateRequest,
        mockResponse as Response
      );

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        code: 404,
        resultMessage: "ENTITY_NOT_FOUND",
      });
    });
  });

  describe("deleteUserHandler", () => {
    it("should delete a user successfully", async () => {
      // Arrange
      mockRequest.user = {
        sub: mockUserRoleUser._id.toString(),
        role: "user",
      };

      (mockUserService.deleteUserByID as jest.Mock).mockResolvedValue({
        httpStatusCode: 200,
        message: "ENTITY_DELETED",
      });

      // Act
      await userController(mockUserService).deleteUserHandler(
        mockRequest as AuthenticatedUserRequest,
        mockResponse as Response
      );

      // Assert
      expect(mockUserService.deleteUserByID).toHaveBeenCalledWith(
        mockUserRoleUser._id.toString()
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        code: 200,
        resultMessage: "ENTITY_DELETED",
      });
    });

    it("should handle errors when deleting user", async () => {
      // Arrange
      mockRequest.user = {
        sub: "nonexistentid",
        role: "user",
      };

      (mockUserService.deleteUserByID as jest.Mock).mockResolvedValue({
        httpStatusCode: 404,
        message: "ENTITY_NOT_FOUND",
      });

      // Act
      await userController(mockUserService).deleteUserHandler(
        mockRequest as AuthenticatedUserRequest,
        mockResponse as Response
      );

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        code: 404,
        resultMessage: "ENTITY_NOT_FOUND",
      });
    });
  });
});
