import { Request, Response, NextFunction } from "express";
import { validationResult, Result, ValidationError } from "express-validator";
import validateResult from "../../../../src/api/v1/middleware/validationResults";

// Mock express-validator
jest.mock("express-validator", () => ({
  validationResult: jest.fn(),
  Result: jest.fn(),
  ValidationError: jest.fn(),
}));

describe("Validation Results Middleware", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: jest.Mock<NextFunction>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let mockValidationResult: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockNext = jest.fn();
    mockResponse = {
      json: mockJson,
      status: mockStatus,
    };
    mockRequest = {};
    mockValidationResult = validationResult as unknown as jest.Mock;
    jest.clearAllMocks();
  });

  describe("validateResult", () => {
    it("should call next() when there are no validation errors", () => {
      // Arrange
      const mockEmptyErrors = {
        isEmpty: () => true,
        array: () => [],
      } as unknown as Result<ValidationError>;
      mockValidationResult.mockReturnValue(mockEmptyErrors);

      // Act
      validateResult(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockValidationResult).toHaveBeenCalledWith(mockRequest);
      expect(mockNext).toHaveBeenCalled();
      expect(mockStatus).not.toHaveBeenCalled();
      expect(mockJson).not.toHaveBeenCalled();
    });

    it("should return 400 with first error message when there are validation errors", () => {
      // Arrange
      const mockError = {
        msg: "Invalid input",
        param: "field",
        value: "invalid",
        location: "body",
      };
      const mockErrors = {
        isEmpty: () => false,
        array: () => [mockError],
      } as unknown as Result<ValidationError>;
      mockValidationResult.mockReturnValue(mockErrors);

      // Act
      validateResult(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockValidationResult).toHaveBeenCalledWith(mockRequest);
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ msg: "Invalid input" });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it("should handle multiple validation errors and return the first one", () => {
      // Arrange
      const mockErrors = {
        isEmpty: () => false,
        array: () => [
          { msg: "First error", param: "field1", value: "invalid1", location: "body" },
          { msg: "Second error", param: "field2", value: "invalid2", location: "body" },
        ],
      } as unknown as Result<ValidationError>;
      mockValidationResult.mockReturnValue(mockErrors);

      // Act
      validateResult(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assert
      expect(mockValidationResult).toHaveBeenCalledWith(mockRequest);
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ msg: "First error" });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
}); 