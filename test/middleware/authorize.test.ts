import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import authorize, { isAuthenticated } from "../../src/api/middleware/authorize";
import User from "@models/User";
import Role from "@models/Role";
import { masterKey } from "@config/envvars";
import { AuthenticatedUserRequest } from "@/types/user.types";

// Mock dependencies
jest.mock("jsonwebtoken");
jest.mock("@models/User");
jest.mock("@models/Role");
jest.mock("@config/envvars", () => ({
  masterKey: "test-master-key",
}));

const mockedJwt = jwt as jest.Mocked<typeof jwt>;
const mockedUser = User as jest.Mocked<typeof User>;
const mockedRole = Role as jest.Mocked<typeof Role>;

describe("Authorize Middleware", () => {
  let mockRequest: Partial<AuthenticatedUserRequest>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock<NextFunction>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockNext = jest.fn();
    mockResponse = {
      json: mockJson,
      status: mockStatus,
    };
    mockRequest = {
      cookies: {},
      path: "/test",
      method: "GET",
    };
    jest.clearAllMocks();
  });

  describe("Authentication", () => {
    it("should return 401 if no token is provided", async () => {
      // Arrange
      const middleware = authorize();

      // Act
      await middleware(
        mockRequest as AuthenticatedUserRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 401,
          resultMessage: expect.stringContaining("no token found"),
        })
      );
    });

    it("should return 401 if masterKey is not set", async () => {
      // Arrange
      jest
        .spyOn(require("@config/envvars"), "masterKey", "get")
        .mockReturnValue(undefined);
      const middleware = authorize();
      mockRequest.cookies = { nodetodo: "valid-token" };

      // Act
      await middleware(
        mockRequest as AuthenticatedUserRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 401,
          resultMessage: expect.stringContaining("no masterKey present"),
        })
      );
    });

    it("should return 401 if token is invalid", async () => {
      // Arrange
      mockedJwt.verify.mockImplementation(() => {
        throw new Error("Invalid token");
      });
      const middleware = authorize();
      mockRequest.cookies = { nodetodo: "invalid-token" };

      // Act
      await middleware(
        mockRequest as AuthenticatedUserRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 401,
          resultMessage: expect.stringContaining("malformed request"),
        })
      );
    });

    it("should return 401 if decoded token is missing required fields", async () => {
      // Arrange
      mockedJwt.verify.mockReturnValue({ sub: "user-id" } as any);
      const middleware = authorize();
      mockRequest.cookies = { nodetodo: "valid-token" };

      // Act
      await middleware(
        mockRequest as AuthenticatedUserRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 401,
          resultMessage: expect.stringContaining("missing fields"),
        })
      );
    });

    it("should return 401 if user is not found", async () => {
      // Arrange
      mockedJwt.verify.mockReturnValue({
        sub: "user-id",
        role: "role-id",
        sessionId: "session-id",
      } as any);
      mockedUser.findById.mockResolvedValue(null);
      const middleware = authorize();
      mockRequest.cookies = { nodetodo: "valid-token" };

      // Act
      await middleware(
        mockRequest as AuthenticatedUserRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 401,
          resultMessage: expect.stringContaining("no user found"),
        })
      );
    });
  });

  describe("Authorization", () => {
    const mockUser = {
      _id: "user-id",
      role: { _id: "role-id" },
    };
    const mockRole = {
      _id: "role-id",
      permissions: new Map([["test-domain", 3]]), // 3 = read (1) + write (2)
    };

    beforeEach(() => {
      mockedJwt.verify.mockReturnValue({
        sub: "user-id",
        role: "role-id",
        sessionId: "session-id",
      } as any);
      mockedUser.findById.mockResolvedValue(mockUser as any);
      mockedRole.findById.mockResolvedValue(mockRole as any);
      mockRequest.cookies = { nodetodo: "valid-token" };
    });

    it("should proceed if no domain/permission is required", async () => {
      // Arrange
      const middleware = authorize();

      // Act
      await middleware(
        mockRequest as AuthenticatedUserRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalled();
      expect(mockRequest.user).toEqual({
        sub: "user-id",
        role: "role-id",
      });
    });

    it("should return 401 if role is not found", async () => {
      // Arrange
      mockedRole.findById.mockResolvedValue(null);
      const middleware = authorize("test-domain", 1);

      // Act
      await middleware(
        mockRequest as AuthenticatedUserRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 401,
          resultMessage: expect.stringContaining("no role found"),
        })
      );
    });

    it("should return 401 if user has insufficient permissions", async () => {
      // Arrange
      const middleware = authorize("test-domain", 4); // 4 = admin permission

      // Act
      await middleware(
        mockRequest as AuthenticatedUserRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(401);
      expect(mockJson).toHaveBeenCalledWith(
        expect.objectContaining({
          code: 401,
          resultMessage: expect.stringContaining("insufficient permissions"),
        })
      );
    });

    it("should proceed if user has required permissions", async () => {
      // Arrange
      const middleware = authorize("test-domain", 1); // 1 = read permission

      // Act
      await middleware(
        mockRequest as AuthenticatedUserRequest,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalled();
      expect(mockRequest.user).toEqual({
        sub: "user-id",
        role: "role-id",
      });
    });
  });

  describe("isAuthenticated Type Guard", () => {
    it("should return true for authenticated request", () => {
      // Arrange
      const req = {
        user: {
          sub: "user-id",
          role: "role-id",
        },
      } as AuthenticatedUserRequest;

      // Act
      const result = isAuthenticated(req);

      // Assert
      expect(result).toBe(true);
    });

    it("should return false for unauthenticated request", () => {
      // Arrange
      const req = {
        user: undefined,
      } as AuthenticatedUserRequest;

      // Act
      const result = isAuthenticated(req);

      // Assert
      expect(result).toBe(false);
    });
  });
});
