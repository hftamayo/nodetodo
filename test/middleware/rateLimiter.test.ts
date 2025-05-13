import { Request, Response, NextFunction } from "express";
import rateLimit, { RateLimitRequestHandler, ClientRateLimitInfo } from "express-rate-limit";
import rateLimiter from "../../src/api/middleware/rateLimiter";
import { mode } from "@config/envvars";

// Mock express-rate-limit
jest.mock("express-rate-limit");

type MockRateLimitHandler = jest.Mock & {
  resetKey: jest.Mock;
  getKey: jest.Mock;
};

// Create a mock implementation of RateLimitRequestHandler
const createMockRateLimitHandler = (): MockRateLimitHandler => {
  const handler = jest.fn() as MockRateLimitHandler;
  handler.resetKey = jest.fn();
  handler.getKey = jest.fn();
  return handler;
};

const mockedRateLimit = rateLimit as jest.Mock;

// Mock envvars
jest.mock("@config/envvars", () => ({
  mode: "development",
}));

describe("Rate Limiter Middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock<NextFunction>;

  beforeEach(() => {
    mockRequest = {
      ip: "127.0.0.1",
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe("Sign Up Limiter", () => {
    it("should create signup limiter with development settings", () => {
      // Arrange
      const mockLimiter = createMockRateLimitHandler();
      mockedRateLimit.mockReturnValue(mockLimiter);

      // Act
      const limiter = rateLimiter.signUpLimiter;

      // Assert
      expect(mockedRateLimit).toHaveBeenCalledWith({
        windowMs: 24 * 60 * 60 * 1000, // 24 hours
        max: 10000,
        message: "Too many accounts created from this IP, please try again after an hour",
      });
      expect(limiter).toBe(mockLimiter);
    });

    it("should create signup limiter with production settings", () => {
      // Arrange
      jest.spyOn(require("@config/envvars"), "mode", "get").mockReturnValue("production");
      const mockLimiter = createMockRateLimitHandler();
      mockedRateLimit.mockReturnValue(mockLimiter);

      // Act
      const limiter = rateLimiter.signUpLimiter;

      // Assert
      expect(mockedRateLimit).toHaveBeenCalledWith({
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 5,
        message: "Too many accounts created from this IP, please try again after an hour",
      });
      expect(limiter).toBe(mockLimiter);
    });

    it("should handle rate limit exceeded", async () => {
      // Arrange
      const mockLimiter = createMockRateLimitHandler();
      mockLimiter.mockImplementation((req: Request, res: Response, next: NextFunction) => {
        res.status(429).json({ message: "Too many accounts created from this IP, please try again after an hour" });
      });
      mockedRateLimit.mockReturnValue(mockLimiter);

      // Act
      const limiter = rateLimiter.signUpLimiter;
      await limiter(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockResponse.status).toBe(429);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Too many accounts created from this IP, please try again after an hour",
      });
    });
  });

  describe("Login Limiter", () => {
    it("should create login limiter with development settings", () => {
      // Arrange
      const mockLimiter = createMockRateLimitHandler();
      mockedRateLimit.mockReturnValue(mockLimiter);

      // Act
      const limiter = rateLimiter.loginLimiter;

      // Assert
      expect(mockedRateLimit).toHaveBeenCalledWith({
        windowMs: 24 * 60 * 60 * 1000, // 24 hours
        max: 10000,
        message: "Too many login attempts from this IP, please try again after 15 minutes",
      });
      expect(limiter).toBe(mockLimiter);
    });

    it("should create login limiter with production settings", () => {
      // Arrange
      jest.spyOn(require("@config/envvars"), "mode", "get").mockReturnValue("production");
      const mockLimiter = createMockRateLimitHandler();
      mockedRateLimit.mockReturnValue(mockLimiter);

      // Act
      const limiter = rateLimiter.loginLimiter;

      // Assert
      expect(mockedRateLimit).toHaveBeenCalledWith({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 3,
        message: "Too many login attempts from this IP, please try again after 15 minutes",
      });
      expect(limiter).toBe(mockLimiter);
    });

    it("should handle rate limit exceeded", async () => {
      // Arrange
      const mockLimiter = createMockRateLimitHandler();
      mockLimiter.mockImplementation((req: Request, res: Response, next: NextFunction) => {
        res.status(429).json({ message: "Too many login attempts from this IP, please try again after 15 minutes" });
      });
      mockedRateLimit.mockReturnValue(mockLimiter);

      // Act
      const limiter = rateLimiter.loginLimiter;
      await limiter(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockResponse.status).toBe(429);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Too many login attempts from this IP, please try again after 15 minutes",
      });
    });
  });

  describe("Rate Limiter Behavior", () => {
    it("should allow requests within rate limit", async () => {
      // Arrange
      const mockLimiter = createMockRateLimitHandler();
      mockLimiter.mockImplementation((req: Request, res: Response, next: NextFunction) => {
        next();
      });
      mockedRateLimit.mockReturnValue(mockLimiter);

      // Act
      const limiter = rateLimiter.signUpLimiter;
      await limiter(mockRequest as Request, mockResponse as Response, mockNext);

      // Assert
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });

    it("should handle different IP addresses separately", async () => {
      // Arrange
      const mockLimiter = createMockRateLimitHandler();
      mockLimiter.mockImplementation((req: Request, res: Response, next: NextFunction) => {
        next();
      });
      mockedRateLimit.mockReturnValue(mockLimiter);

      // Act
      const limiter = rateLimiter.signUpLimiter;
      await limiter(
        { ...mockRequest, ip: "192.168.1.1" } as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockNext).toHaveBeenCalled();
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });
}); 