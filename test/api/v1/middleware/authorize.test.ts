import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import authorize, {
  isAuthenticated,
} from "../../../../src/api/v1/middleware/authorize";
import { AuthenticatedUserRequest, JwtActiveSession } from "@/types/user.types";
import User from "@models/User";
import Role from "@models/Role";
import { masterKey } from "@config/envvars";

// Mock dependencies
jest.mock("jsonwebtoken");
jest.mock("@models/User");
jest.mock("@models/Role");
jest.mock("@config/envvars");

const mockJwt = jwt as jest.Mocked<typeof jwt>;
const mockUser = User as jest.Mocked<typeof User>;
const mockRole = Role as jest.Mocked<typeof Role>;

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
    };

    // Reset mocks
    jest.clearAllMocks();

    // Mock masterKey
    (masterKey as any) = "test-master-key";
  });

  describe("isAuthenticated", () => {
    it("should return true when user has sub property", () => {
      const req = {
        user: { sub: "123", role: "456" },
      } as AuthenticatedUserRequest;

      expect(isAuthenticated(req)).toBe(true);
    });

    it("should return false when user is undefined", () => {
      const req = {} as AuthenticatedUserRequest;

      expect(isAuthenticated(req)).toBe(false);
    });

    it("should return false when user.sub is undefined", () => {
      const req = {
        user: { role: "456" },
      } as AuthenticatedUserRequest;

      expect(isAuthenticated(req)).toBe(false);
    });
  });

  describe("authorize middleware", () => {
    describe("Token validation", () => {
      it("should return 401 when no token is provided", async () => {
        const middleware = authorize();

        await middleware(
          mockRequest as AuthenticatedUserRequest,
          mockResponse as Response,
          mockNext
        );

        expect(mockStatus).toHaveBeenCalledWith(401);
        expect(mockJson).toHaveBeenCalledWith({
          code: 401,
          resultMessage: "malformed request: no token found",
        });
        expect(mockNext).not.toHaveBeenCalled();
      });

      it("should return 401 when masterKey is not available", async () => {
        (masterKey as any) = undefined;
        mockRequest.cookies = { nodetodo: "valid-token" };

        const middleware = authorize();

        await middleware(
          mockRequest as AuthenticatedUserRequest,
          mockResponse as Response,
          mockNext
        );

        expect(mockStatus).toHaveBeenCalledWith(401);
        expect(mockJson).toHaveBeenCalledWith({
          code: 401,
          resultMessage: "malformed request: no masterKey present",
        });
        expect(mockNext).not.toHaveBeenCalled();
      });

      it("should return 401 when token verification fails", async () => {
        mockRequest.cookies = { nodetodo: "invalid-token" };
        mockJwt.verify.mockImplementation(() => {
          throw new Error("Invalid token");
        });

        const middleware = authorize();

        await middleware(
          mockRequest as AuthenticatedUserRequest,
          mockResponse as Response,
          mockNext
        );

        expect(mockStatus).toHaveBeenCalledWith(401);
        expect(mockJson).toHaveBeenCalledWith({
          code: 401,
          resultMessage: "authentication verification failed",
        });
        expect(mockNext).not.toHaveBeenCalled();
      });

      it("should return 401 when token is missing required fields", async () => {
        mockRequest.cookies = { nodetodo: "valid-token" };
        const invalidDecoded = { sub: "123" }; // Missing role and sessionId
        mockJwt.verify.mockReturnValue(invalidDecoded as any);

        const middleware = authorize();

        await middleware(
          mockRequest as AuthenticatedUserRequest,
          mockResponse as Response,
          mockNext
        );

        expect(mockStatus).toHaveBeenCalledWith(401);
        expect(mockJson).toHaveBeenCalledWith({
          code: 401,
          resultMessage: "malformed request: missing fields in token",
        });
        expect(mockNext).not.toHaveBeenCalled();
      });

      it("should return 401 when decoded token is null", async () => {
        mockRequest.cookies = { nodetodo: "valid-token" };
        mockJwt.verify.mockReturnValue(null as any);

        const middleware = authorize();

        await middleware(
          mockRequest as AuthenticatedUserRequest,
          mockResponse as Response,
          mockNext
        );

        expect(mockStatus).toHaveBeenCalledWith(401);
        expect(mockJson).toHaveBeenCalledWith({
          code: 401,
          resultMessage: "malformed request: missing fields in token",
        });
        expect(mockNext).not.toHaveBeenCalled();
      });
    });

    describe("User validation", () => {
      it("should return 401 when user is not found", async () => {
        mockRequest.cookies = { nodetodo: "valid-token" };
        const validDecoded: JwtActiveSession = {
          sub: "123",
          role: "456",
          sessionId: "session-123",
          ver: "1.0",
          iat: 1234567890,
          exp: 1234567890,
        };
        mockJwt.verify.mockReturnValue(validDecoded as any);
        mockUser.findById.mockReturnValue({
          populate: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(null),
          }),
        } as any);

        const middleware = authorize();

        await middleware(
          mockRequest as AuthenticatedUserRequest,
          mockResponse as Response,
          mockNext
        );

        expect(mockStatus).toHaveBeenCalledWith(401);
        expect(mockJson).toHaveBeenCalledWith({
          code: 401,
          resultMessage: "invalid request: user not found",
        });
        expect(mockNext).not.toHaveBeenCalled();
      });

      it("should set user in request and call next when user is found", async () => {
        mockRequest.cookies = { nodetodo: "valid-token" };
        const validDecoded: JwtActiveSession = {
          sub: "123",
          role: "456",
          sessionId: "session-123",
          ver: "1.0",
          iat: 1234567890,
          exp: 1234567890,
        };
        const mockUserDoc = { _id: "123", name: "Test User" };

        mockJwt.verify.mockReturnValue(validDecoded as any);
        mockUser.findById.mockReturnValue({
          populate: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockUserDoc),
          }),
        } as any);

        const middleware = authorize();

        await middleware(
          mockRequest as AuthenticatedUserRequest,
          mockResponse as Response,
          mockNext
        );

        expect(mockRequest.user).toEqual({
          sub: "123",
          role: "456",
        });
        expect(mockNext).toHaveBeenCalled();
        expect(mockStatus).not.toHaveBeenCalled();
      });
    });

    describe("Permission validation", () => {
      it("should call next when no domain/permission specified", async () => {
        mockRequest.cookies = { nodetodo: "valid-token" };
        const validDecoded: JwtActiveSession = {
          sub: "123",
          role: "456",
          sessionId: "session-123",
          ver: "1.0",
          iat: 1234567890,
          exp: 1234567890,
        };
        const mockUserDoc = { _id: "123", name: "Test User" };

        mockJwt.verify.mockReturnValue(validDecoded as any);
        mockUser.findById.mockReturnValue({
          populate: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockUserDoc),
          }),
        } as any);

        const middleware = authorize(); // No domain/permission

        await middleware(
          mockRequest as AuthenticatedUserRequest,
          mockResponse as Response,
          mockNext
        );

        expect(mockNext).toHaveBeenCalled();
        expect(mockStatus).not.toHaveBeenCalled();
      });

      it("should return 401 when role is not found", async () => {
        mockRequest.cookies = { nodetodo: "valid-token" };
        const validDecoded: JwtActiveSession = {
          sub: "123",
          role: "456",
          sessionId: "session-123",
          ver: "1.0",
          iat: 1234567890,
          exp: 1234567890,
        };
        const mockUserDoc = { _id: "123", name: "Test User" };

        mockJwt.verify.mockReturnValue(validDecoded as any);
        mockUser.findById.mockReturnValue({
          populate: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockUserDoc),
          }),
        } as any);
        mockRole.findById.mockReturnValue({
          exec: jest.fn().mockResolvedValue(null),
        } as any);

        const middleware = authorize("users", 1); // READ permission

        await middleware(
          mockRequest as AuthenticatedUserRequest,
          mockResponse as Response,
          mockNext
        );

        expect(mockStatus).toHaveBeenCalledWith(401);
        expect(mockJson).toHaveBeenCalledWith({
          code: 401,
          resultMessage: "insufficient permissions: role not found",
        });
        expect(mockNext).not.toHaveBeenCalled();
      });

      it("should return 401 when user has insufficient permissions", async () => {
        mockRequest.cookies = { nodetodo: "valid-token" };
        const validDecoded: JwtActiveSession = {
          sub: "123",
          role: "456",
          sessionId: "session-123",
          ver: "1.0",
          iat: 1234567890,
          exp: 1234567890,
        };
        const mockUserDoc = { _id: "123", name: "Test User" };
        const mockRoleDoc = {
          _id: "456",
          permissions: new Map([["users", 1]]), // Only READ permission
        };

        mockJwt.verify.mockReturnValue(validDecoded as any);
        mockUser.findById.mockReturnValue({
          populate: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockUserDoc),
          }),
        } as any);
        mockRole.findById.mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockRoleDoc),
        } as any);

        const middleware = authorize("users", 2); // WRITE permission (requires 2)

        await middleware(
          mockRequest as AuthenticatedUserRequest,
          mockResponse as Response,
          mockNext
        );

        expect(mockStatus).toHaveBeenCalledWith(401);
        expect(mockJson).toHaveBeenCalledWith({
          code: 401,
          resultMessage: "insufficient permissions",
        });
        expect(mockNext).not.toHaveBeenCalled();
      });

      it("should call next when user has sufficient permissions", async () => {
        mockRequest.cookies = { nodetodo: "valid-token" };
        const validDecoded: JwtActiveSession = {
          sub: "123",
          role: "456",
          sessionId: "session-123",
          ver: "1.0",
          iat: 1234567890,
          exp: 1234567890,
        };
        const mockUserDoc = { _id: "123", name: "Test User" };
        const mockRoleDoc = {
          _id: "456",
          permissions: new Map([["users", 7]]), // READ(1) + WRITE(2) + UPDATE(4) = 7
        };

        mockJwt.verify.mockReturnValue(validDecoded as any);
        mockUser.findById.mockReturnValue({
          populate: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockUserDoc),
          }),
        } as any);
        mockRole.findById.mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockRoleDoc),
        } as any);

        const middleware = authorize("users", 2); // WRITE permission

        await middleware(
          mockRequest as AuthenticatedUserRequest,
          mockResponse as Response,
          mockNext
        );

        expect(mockNext).toHaveBeenCalled();
        expect(mockStatus).not.toHaveBeenCalled();
      });

      it("should handle domain with no permissions (defaults to 0)", async () => {
        mockRequest.cookies = { nodetodo: "valid-token" };
        const validDecoded: JwtActiveSession = {
          sub: "123",
          role: "456",
          sessionId: "session-123",
          ver: "1.0",
          iat: 1234567890,
          exp: 1234567890,
        };
        const mockUserDoc = { _id: "123", name: "Test User" };
        const mockRoleDoc = {
          _id: "456",
          permissions: new Map([["users", 7]]), // No "todos" domain
        };

        mockJwt.verify.mockReturnValue(validDecoded as any);
        mockUser.findById.mockReturnValue({
          populate: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockUserDoc),
          }),
        } as any);
        mockRole.findById.mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockRoleDoc),
        } as any);

        const middleware = authorize("todos", 1); // READ permission on todos domain

        await middleware(
          mockRequest as AuthenticatedUserRequest,
          mockResponse as Response,
          mockNext
        );

        expect(mockStatus).toHaveBeenCalledWith(401);
        expect(mockJson).toHaveBeenCalledWith({
          code: 401,
          resultMessage: "insufficient permissions",
        });
        expect(mockNext).not.toHaveBeenCalled();
      });
    });

    describe("Bitwise permission operations", () => {
      it("should correctly validate READ permission (1)", async () => {
        mockRequest.cookies = { nodetodo: "valid-token" };
        const validDecoded: JwtActiveSession = {
          sub: "123",
          role: "456",
          sessionId: "session-123",
          ver: "1.0",
          iat: 1234567890,
          exp: 1234567890,
        };
        const mockUserDoc = { _id: "123", name: "Test User" };
        const mockRoleDoc = {
          _id: "456",
          permissions: new Map([["users", 1]]), // Only READ
        };

        mockJwt.verify.mockReturnValue(validDecoded as any);
        mockUser.findById.mockReturnValue({
          populate: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockUserDoc),
          }),
        } as any);
        mockRole.findById.mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockRoleDoc),
        } as any);

        const middleware = authorize("users", 1); // READ permission

        await middleware(
          mockRequest as AuthenticatedUserRequest,
          mockResponse as Response,
          mockNext
        );

        expect(mockNext).toHaveBeenCalled();
      });

      it("should correctly validate WRITE permission (2)", async () => {
        mockRequest.cookies = { nodetodo: "valid-token" };
        const validDecoded: JwtActiveSession = {
          sub: "123",
          role: "456",
          sessionId: "session-123",
          ver: "1.0",
          iat: 1234567890,
          exp: 1234567890,
        };
        const mockUserDoc = { _id: "123", name: "Test User" };
        const mockRoleDoc = {
          _id: "456",
          permissions: new Map([["users", 3]]), // READ(1) + WRITE(2) = 3
        };

        mockJwt.verify.mockReturnValue(validDecoded as any);
        mockUser.findById.mockReturnValue({
          populate: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockUserDoc),
          }),
        } as any);
        mockRole.findById.mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockRoleDoc),
        } as any);

        const middleware = authorize("users", 2); // WRITE permission

        await middleware(
          mockRequest as AuthenticatedUserRequest,
          mockResponse as Response,
          mockNext
        );

        expect(mockNext).toHaveBeenCalled();
      });

      it("should correctly validate ALL permissions (15)", async () => {
        mockRequest.cookies = { nodetodo: "valid-token" };
        const validDecoded: JwtActiveSession = {
          sub: "123",
          role: "456",
          sessionId: "session-123",
          ver: "1.0",
          iat: 1234567890,
          exp: 1234567890,
        };
        const mockUserDoc = { _id: "123", name: "Test User" };
        const mockRoleDoc = {
          _id: "456",
          permissions: new Map([["users", 15]]), // ALL permissions
        };

        mockJwt.verify.mockReturnValue(validDecoded as any);
        mockUser.findById.mockReturnValue({
          populate: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockUserDoc),
          }),
        } as any);
        mockRole.findById.mockReturnValue({
          exec: jest.fn().mockResolvedValue(mockRoleDoc),
        } as any);

        const middleware = authorize("users", 8); // DELETE permission

        await middleware(
          mockRequest as AuthenticatedUserRequest,
          mockResponse as Response,
          mockNext
        );

        expect(mockNext).toHaveBeenCalled();
      });
    });

    describe("Error handling", () => {
      it("should handle database errors gracefully", async () => {
        mockRequest.cookies = { nodetodo: "valid-token" };
        const validDecoded: JwtActiveSession = {
          sub: "123",
          role: "456",
          sessionId: "session-123",
          ver: "1.0",
          iat: 1234567890,
          exp: 1234567890,
        };

        mockJwt.verify.mockReturnValue(validDecoded as any);
        mockUser.findById.mockReturnValue({
          populate: jest.fn().mockReturnValue({
            exec: jest.fn().mockRejectedValue(new Error("Database error")),
          }),
        } as any);

        const middleware = authorize();

        await middleware(
          mockRequest as AuthenticatedUserRequest,
          mockResponse as Response,
          mockNext
        );

        expect(mockStatus).toHaveBeenCalledWith(401);
        expect(mockJson).toHaveBeenCalledWith({
          code: 401,
          resultMessage: "authentication verification failed",
        });
        expect(mockNext).not.toHaveBeenCalled();
      });

      it("should handle role lookup errors gracefully", async () => {
        mockRequest.cookies = { nodetodo: "valid-token" };
        const validDecoded: JwtActiveSession = {
          sub: "123",
          role: "456",
          sessionId: "session-123",
          ver: "1.0",
          iat: 1234567890,
          exp: 1234567890,
        };
        const mockUserDoc = { _id: "123", name: "Test User" };

        mockJwt.verify.mockReturnValue(validDecoded as any);
        mockUser.findById.mockReturnValue({
          populate: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockUserDoc),
          }),
        } as any);
        mockRole.findById.mockReturnValue({
          exec: jest.fn().mockRejectedValue(new Error("Database error")),
        } as any);

        const middleware = authorize("users", 1);

        await middleware(
          mockRequest as AuthenticatedUserRequest,
          mockResponse as Response,
          mockNext
        );

        expect(mockStatus).toHaveBeenCalledWith(401);
        expect(mockJson).toHaveBeenCalledWith({
          code: 401,
          resultMessage: "authentication verification failed",
        });
        expect(mockNext).not.toHaveBeenCalled();
      });
    });
  });
});
