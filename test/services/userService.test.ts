import userService from "@/services/userService";
import User from "@/models/User";
import Role from "@/models/Role";
import Todo from "@/models/Todo";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import {
  SignUpRequest,
  LoginRequest,
  UpdateUserRequest,
  ListUsersRequest,
} from "@/types/user.types";
import { mockUserRoleUser, mockUserRoleAdmin } from "../mocks/user.mock";

jest.mock("@/models/User");
jest.mock("@/models/Role");
jest.mock("@/models/Todo");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("crypto");

// Helper functions for test setup
const createMockMongooseChain = (mockExec: jest.Mock) => {
  const mockLimit = jest.fn().mockReturnValue({ exec: mockExec });
  const mockSkip = jest.fn().mockReturnValue({ limit: mockLimit });
  const mockSort = jest.fn().mockReturnValue({ skip: mockSkip });
  return { sort: mockSort };
};

const createTestUser = (overrides = {}) => ({
  name: "Test User",
  email: "test@example.com",
  password: "password123",
  age: 25,
  status: true,
  ...overrides,
});

// Test data constants
const TEST_PAGINATION = {
  page: 1,
  limit: 10,
};

const TEST_USER_ID = mockUserRoleUser._id.toString();

describe("User Service - signUpUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully create a new user", async () => {
    // Arrange
    const mockFindOneExec = jest.fn().mockResolvedValue(null);
    (User.findOne as jest.Mock).mockReturnValue({ exec: mockFindOneExec });

    const mockRole = { _id: "role-id" };
    const mockFindOneRoleExec = jest.fn().mockResolvedValue(mockRole);
    (Role.findOne as jest.Mock).mockReturnValue({ exec: mockFindOneRoleExec });

    const mockHash = "hashedPassword";
    (bcrypt.genSalt as jest.Mock).mockResolvedValue("salt");
    (bcrypt.hash as jest.Mock).mockResolvedValue(mockHash);

    const mockUser = {
      ...mockUserRoleUser,
      save: jest.fn().mockResolvedValue(mockUserRoleUser),
      toObject: () => mockUserRoleUser,
    };
    (User as unknown as jest.Mock).mockImplementation(() => mockUser);

    const params: SignUpRequest = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      repeatPassword: "password123",
      age: 25,
    };

    // Act
    const result = await userService.signUpUser(params);

    // Assert
    expect(result.httpStatusCode).toBe(201);
    expect(result.message).toBe("USER_CREATED");
    expect(result.user).toBeDefined();
    expect(result.user?.name).toBe(params.name);
    expect(result.user?.email).toBe(params.email);
    expect(User.findOne).toHaveBeenCalledWith({ email: params.email });
    expect(Role.findOne).toHaveBeenCalledWith({ name: "finaluser" });
    expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
    expect(bcrypt.hash).toHaveBeenCalledWith(params.password, "salt");
    expect(mockUser.save).toHaveBeenCalled();
  });

  it("should return 400 when email already exists", async () => {
    // Arrange
    const mockFindOneExec = jest.fn().mockResolvedValue(mockUserRoleUser);
    (User.findOne as jest.Mock).mockReturnValue({ exec: mockFindOneExec });

    const params: SignUpRequest = {
      name: "Test User",
      email: mockUserRoleUser.email,
      password: "password123",
      repeatPassword: "password123",
      age: 25,
    };

    // Act
    const result = await userService.signUpUser(params);

    // Assert
    expect(result.httpStatusCode).toBe(400);
    expect(result.message).toBe("EMAIL_EXISTS");
    expect(result.user).toBeUndefined();
  });

  it("should return 400 when passwords do not match", async () => {
    // Arrange
    const params: SignUpRequest = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      repeatPassword: "differentPassword",
      age: 25,
    };

    // Act
    const result = await userService.signUpUser(params);

    // Assert
    expect(result.httpStatusCode).toBe(400);
    expect(result.message).toBe("PASSWORD_MISMATCH");
    expect(result.user).toBeUndefined();
  });

  it("should return 400 when required fields are missing", async () => {
    // Arrange
    const params: SignUpRequest = {
      name: "",
      email: "",
      password: "",
      repeatPassword: "",
      age: 0,
    };

    // Act
    const result = await userService.signUpUser(params);

    // Assert
    expect(result.httpStatusCode).toBe(400);
    expect(result.message).toBe("MISSING_FIELDS");
    expect(result.user).toBeUndefined();
  });

  it("should return 500 when role is not found", async () => {
    // Arrange
    const mockFindOneExec = jest.fn().mockResolvedValue(null);
    (User.findOne as jest.Mock).mockReturnValue({ exec: mockFindOneExec });

    const mockFindOneRoleExec = jest.fn().mockResolvedValue(null);
    (Role.findOne as jest.Mock).mockReturnValue({ exec: mockFindOneRoleExec });

    const params: SignUpRequest = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
      repeatPassword: "password123",
      age: 25,
    };

    // Act
    const result = await userService.signUpUser(params);

    // Assert
    expect(result.httpStatusCode).toBe(500);
    expect(result.message).toBe("ROLE_NOT_FOUND");
    expect(result.user).toBeUndefined();
  });
});

describe("User Service - loginUser", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully login a user", async () => {
    // Arrange
    const mockUser = {
      ...mockUserRoleUser,
      status: true,
      toObject: () => mockUserRoleUser,
    };
    const mockFindOneExec = jest.fn().mockResolvedValue(mockUser);
    (User.findOne as jest.Mock).mockReturnValue({ exec: mockFindOneExec });

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (crypto.randomUUID as jest.Mock).mockReturnValue("session-id");
    (jwt.sign as jest.Mock).mockReturnValue("jwt-token");

    const params: LoginRequest = {
      email: mockUserRoleUser.email,
      password: "password123",
    };

    // Act
    const result = await userService.loginUser(params);

    // Assert
    expect(result.httpStatusCode).toBe(200);
    expect(result.message).toBe("LOGIN_SUCCESS");
    expect(result.tokenCreated).toBe("jwt-token");
    expect(result.user).toBeDefined();
    expect(User.findOne).toHaveBeenCalledWith({ email: params.email });
    expect(bcrypt.compare).toHaveBeenCalledWith(
      params.password,
      mockUser.password
    );
    expect(jwt.sign).toHaveBeenCalled();
  });

  it("should return 401 when user is not found", async () => {
    // Arrange
    const mockFindOneExec = jest.fn().mockResolvedValue(null);
    (User.findOne as jest.Mock).mockReturnValue({ exec: mockFindOneExec });

    const params: LoginRequest = {
      email: "nonexistent@example.com",
      password: "password123",
    };

    // Act
    const result = await userService.loginUser(params);

    // Assert
    expect(result.httpStatusCode).toBe(401);
    expect(result.message).toBe("BAD_CREDENTIALS");
    expect(result.tokenCreated).toBeUndefined();
    expect(result.user).toBeUndefined();
  });

  it("should return 401 when account is disabled", async () => {
    // Arrange
    const mockUser = {
      ...mockUserRoleUser,
      status: false,
      toObject: () => mockUserRoleUser,
    };
    const mockFindOneExec = jest.fn().mockResolvedValue(mockUser);
    (User.findOne as jest.Mock).mockReturnValue({ exec: mockFindOneExec });

    const params: LoginRequest = {
      email: mockUserRoleUser.email,
      password: "password123",
    };

    // Act
    const result = await userService.loginUser(params);

    // Assert
    expect(result.httpStatusCode).toBe(401);
    expect(result.message).toBe("ACCOUNT_DISABLED");
    expect(result.tokenCreated).toBeUndefined();
    expect(result.user).toBeUndefined();
  });

  it("should return 402 when password is incorrect", async () => {
    // Arrange
    const mockUser = {
      ...mockUserRoleUser,
      status: true,
      toObject: () => mockUserRoleUser,
    };
    const mockFindOneExec = jest.fn().mockResolvedValue(mockUser);
    (User.findOne as jest.Mock).mockReturnValue({ exec: mockFindOneExec });

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const params: LoginRequest = {
      email: mockUserRoleUser.email,
      password: "wrongpassword",
    };

    // Act
    const result = await userService.loginUser(params);

    // Assert
    expect(result.httpStatusCode).toBe(402);
    expect(result.message).toBe("BAD_CREDENTIALS");
    expect(result.tokenCreated).toBeUndefined();
    expect(result.user).toBeUndefined();
  });
});

describe("User Service - listUsers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully return users", async () => {
    // Arrange
    const mockUsers = [mockUserRoleUser, mockUserRoleAdmin];
    const mockExec = jest.fn().mockResolvedValue(mockUsers);
    (User.find as jest.Mock).mockReturnValue(createMockMongooseChain(mockExec));

    const params: ListUsersRequest = TEST_PAGINATION;

    // Act
    const result = await userService.listUsers(params);

    // Assert
    expect(result.httpStatusCode).toBe(200);
    expect(result.message).toBe("USERS_FOUND");
    expect(result.users).toBeDefined();
    expect(result.users).toHaveLength(2);
    expect(User.find).toHaveBeenCalled();
    expect(mockExec).toHaveBeenCalled();
  });

  it("should return 500 when database error occurs", async () => {
    // Arrange
    const mockExec = jest.fn().mockRejectedValue(new Error("Database error"));
    (User.find as jest.Mock).mockReturnValue(createMockMongooseChain(mockExec));

    const params: ListUsersRequest = TEST_PAGINATION;

    // Act
    const result = await userService.listUsers(params);

    // Assert
    expect(result.httpStatusCode).toBe(500);
    expect(result.message).toBe("UNKNOWN_ERROR");
    expect(result.users).toBeUndefined();
  });
});

describe("User Service - listUserByID", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully return a user", async () => {
    // Arrange
    const mockExec = jest.fn().mockResolvedValue(mockUserRoleUser);
    (User.findById as jest.Mock).mockReturnValue({ exec: mockExec });

    // Act
    const result = await userService.listUserByID(TEST_USER_ID);

    // Assert
    expect(result.httpStatusCode).toBe(200);
    expect(result.message).toBe("ENTITY_FOUND");
    expect(result.user).toBeDefined();
    expect(result.user?._id).toBe(mockUserRoleUser._id);
    expect(User.findById).toHaveBeenCalledWith(TEST_USER_ID);
  });

  it("should return 404 when user is not found", async () => {
    // Arrange
    const mockExec = jest.fn().mockResolvedValue(null);
    (User.findById as jest.Mock).mockReturnValue({ exec: mockExec });

    // Act
    const result = await userService.listUserByID("nonexistent-id");

    // Assert
    expect(result.httpStatusCode).toBe(404);
    expect(result.message).toBe("ENTITY_NOT_FOUND");
    expect(result.user).toBeUndefined();
  });

  it("should return 500 when database error occurs", async () => {
    // Arrange
    const mockExec = jest.fn().mockRejectedValue(new Error("Database error"));
    (User.findById as jest.Mock).mockReturnValue({ exec: mockExec });

    // Act
    const result = await userService.listUserByID(TEST_USER_ID);

    // Assert
    expect(result.httpStatusCode).toBe(500);
    expect(result.message).toBe("UNKNOWN_ERROR");
    expect(result.user).toBeUndefined();
  });
});

describe("User Service - updateUserDetailsByID", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully update user details", async () => {
    // Arrange
    const mockUser = {
      ...mockUserRoleUser,
      save: jest.fn().mockResolvedValue(mockUserRoleUser),
      toObject: () => mockUserRoleUser,
    };
    const mockExec = jest.fn().mockResolvedValue(mockUser);
    (User.findById as jest.Mock).mockReturnValue({ exec: mockExec });

    const mockFindOneExec = jest.fn().mockResolvedValue(null);
    (User.findOne as jest.Mock).mockReturnValue({ exec: mockFindOneExec });

    const params: UpdateUserRequest = {
      userId: TEST_USER_ID,
      user: {
        name: "Updated Name",
        email: "updated@example.com",
        age: 30,
      },
    };

    // Act
    const result = await userService.updateUserDetailsByID(params);

    // Assert
    expect(result.httpStatusCode).toBe(200);
    expect(result.message).toBe("ENTITY_UPDATED");
    expect(result.user).toBeDefined();
    expect(User.findById).toHaveBeenCalledWith(params.userId);
    expect(mockUser.save).toHaveBeenCalled();
  });

  it("should return 404 when user is not found", async () => {
    // Arrange
    const mockExec = jest.fn().mockResolvedValue(null);
    (User.findById as jest.Mock).mockReturnValue({ exec: mockExec });

    const params: UpdateUserRequest = {
      userId: "nonexistent-id",
      user: {
        name: "Updated Name",
      },
    };

    // Act
    const result = await userService.updateUserDetailsByID(params);

    // Assert
    expect(result.httpStatusCode).toBe(404);
    expect(result.message).toBe("ENTITY_NOT_FOUND");
    expect(result.user).toBeUndefined();
  });

  it("should return 400 when email already exists", async () => {
    // Arrange
    const mockUser = {
      ...mockUserRoleUser,
      save: jest.fn().mockResolvedValue(mockUserRoleUser),
      toObject: () => mockUserRoleUser,
    };
    const mockExec = jest.fn().mockResolvedValue(mockUser);
    (User.findById as jest.Mock).mockReturnValue({ exec: mockExec });

    const mockFindOneExec = jest.fn().mockResolvedValue(mockUserRoleAdmin);
    (User.findOne as jest.Mock).mockReturnValue({ exec: mockFindOneExec });

    const params: UpdateUserRequest = {
      userId: TEST_USER_ID,
      user: {
        email: mockUserRoleAdmin.email,
      },
    };

    // Act
    const result = await userService.updateUserDetailsByID(params);

    // Assert
    expect(result.httpStatusCode).toBe(400);
    expect(result.message).toBe("EMAIL_EXISTS");
    expect(result.user).toBeUndefined();
  });
});

describe("User Service - updateUserPasswordByID", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully update user password", async () => {
    // Arrange
    const mockUser = {
      ...mockUserRoleUser,
      save: jest.fn().mockResolvedValue(mockUserRoleUser),
      toObject: () => mockUserRoleUser,
    };
    const mockExec = jest.fn().mockResolvedValue(mockUser);
    (User.findById as jest.Mock).mockReturnValue({ exec: mockExec });

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    (bcrypt.genSalt as jest.Mock).mockResolvedValue("salt");
    (bcrypt.hash as jest.Mock).mockResolvedValue("newHashedPassword");

    const params: UpdateUserRequest = {
      userId: TEST_USER_ID,
      user: {
        password: "currentPassword",
        updatePassword: "newPassword",
      },
    };

    // Act
    const result = await userService.updateUserPasswordByID(params);

    // Assert
    expect(result.httpStatusCode).toBe(200);
    expect(result.message).toBe("ENTITY UPDATED");
    expect(result.user).toBeDefined();
    expect(User.findById).toHaveBeenCalledWith(params.userId);
    expect(bcrypt.compare).toHaveBeenCalledWith(
      params.user.password,
      mockUser.password
    );
    expect(bcrypt.hash).toHaveBeenCalledWith(
      params.user.updatePassword,
      "salt"
    );
    expect(mockUser.save).toHaveBeenCalled();
  });

  it("should return 404 when user is not found", async () => {
    // Arrange
    const mockExec = jest.fn().mockResolvedValue(null);
    (User.findById as jest.Mock).mockReturnValue({ exec: mockExec });

    const params: UpdateUserRequest = {
      userId: "nonexistent-id",
      user: {
        password: "currentPassword",
        updatePassword: "newPassword",
      },
    };

    // Act
    const result = await userService.updateUserPasswordByID(params);

    // Assert
    expect(result.httpStatusCode).toBe(404);
    expect(result.message).toBe("ENTITY_NOT_FOUND");
    expect(result.user).toBeUndefined();
  });

  it("should return 400 when current password is incorrect", async () => {
    // Arrange
    const mockUser = {
      ...mockUserRoleUser,
      save: jest.fn().mockResolvedValue(mockUserRoleUser),
      toObject: () => mockUserRoleUser,
    };
    const mockExec = jest.fn().mockResolvedValue(mockUser);
    (User.findById as jest.Mock).mockReturnValue({ exec: mockExec });

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const params: UpdateUserRequest = {
      userId: TEST_USER_ID,
      user: {
        password: "wrongPassword",
        updatePassword: "newPassword",
      },
    };

    // Act
    const result = await userService.updateUserPasswordByID(params);

    // Assert
    expect(result.httpStatusCode).toBe(400);
    expect(result.message).toBe("BAD_CREDENTIALS");
    expect(result.user).toBeUndefined();
  });
});

describe("User Service - deleteUserByID", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully delete a user and their todos", async () => {
    // Arrange
    const mockUser = {
      ...mockUserRoleUser,
      deleteOne: jest.fn().mockResolvedValue(undefined),
    };
    const mockExec = jest.fn().mockResolvedValue(mockUser);
    (User.findById as jest.Mock).mockReturnValue({ exec: mockExec });

    const mockTodos = [{ _id: "todo1" }, { _id: "todo2" }];
    const mockFindExec = jest.fn().mockResolvedValue(mockTodos);
    (Todo.find as jest.Mock).mockReturnValue({ exec: mockFindExec });

    const mockDeleteManyExec = jest.fn().mockResolvedValue({ deletedCount: 2 });
    (Todo.deleteMany as jest.Mock).mockReturnValue({
      exec: mockDeleteManyExec,
    });

    // Act
    const result = await userService.deleteUserByID(TEST_USER_ID);

    // Assert
    expect(result.httpStatusCode).toBe(200);
    expect(result.message).toBe("ENTITY_DELETED");
    expect(User.findById).toHaveBeenCalledWith(TEST_USER_ID);
    expect(Todo.find).toHaveBeenCalledWith({ user: mockUser });
    expect(Todo.deleteMany).toHaveBeenCalledWith({ user: mockUser });
    expect(mockUser.deleteOne).toHaveBeenCalled();
  });

  it("should return 404 when user is not found", async () => {
    // Arrange
    const mockExec = jest.fn().mockResolvedValue(null);
    (User.findById as jest.Mock).mockReturnValue({ exec: mockExec });

    // Act
    const result = await userService.deleteUserByID("nonexistent-id");

    // Assert
    expect(result.httpStatusCode).toBe(404);
    expect(result.message).toBe("ENTITY_NOT_FOUND");
  });

  it("should return 500 when database error occurs", async () => {
    // Arrange
    const mockExec = jest.fn().mockRejectedValue(new Error("Database error"));
    (User.findById as jest.Mock).mockReturnValue({ exec: mockExec });

    // Act
    const result = await userService.deleteUserByID(TEST_USER_ID);

    // Assert
    expect(result.httpStatusCode).toBe(500);
    expect(result.message).toBe("UNKNOWN_ERROR");
  });
});
