import {
  successResponse,
  errorResponse,
  makeResponse,
} from "@/utils/endpoints/apiMakeResponse";
import { EndpointResponseDto } from "@/api/v1/dto/EndpointResponse.dto";
import { ErrorResponseDTO } from "@/api/v1/dto/error/ErrorResponse.dto";

describe("API Make Response Utils", () => {
  describe("successResponse", () => {
    it("should create success response with default values", () => {
      const response = successResponse();

      expect(response).toBeInstanceOf(EndpointResponseDto);
      expect(response.code).toBe(200);
      expect(response.resultMessage).toBe("OPERATION_SUCCESS");
      expect(response.data).toBeUndefined();
      expect(response.dataList).toBeUndefined();
      expect(response.cacheTTL).toBe(0);
      expect(response.timestamp).toBeDefined();
      expect(typeof response.timestamp).toBe("number");
    });

    it("should create success response with data", () => {
      const testData = { id: "123", name: "Test User" };
      const response = successResponse(testData);

      expect(response).toBeInstanceOf(EndpointResponseDto);
      expect(response.code).toBe(200);
      expect(response.resultMessage).toBe("OPERATION_SUCCESS");
      expect(response.data).toEqual(testData);
      expect(response.dataList).toBeUndefined();
      expect(response.cacheTTL).toBe(0);
    });

    it("should create success response with dataList", () => {
      const testDataList = [
        { id: "1", name: "User 1" },
        { id: "2", name: "User 2" },
      ];
      const response = successResponse(undefined, testDataList);

      expect(response).toBeInstanceOf(EndpointResponseDto);
      expect(response.code).toBe(200);
      expect(response.resultMessage).toBe("OPERATION_SUCCESS");
      expect(response.data).toBeUndefined();
      expect(response.dataList).toEqual(testDataList);
      expect(response.cacheTTL).toBe(0);
    });

    it("should create success response with both data and dataList", () => {
      const testData = { id: "123", name: "Test User" };
      const testDataList = [
        { id: "1", name: "User 1" },
        { id: "2", name: "User 2" },
      ];
      const response = successResponse(testData, testDataList);

      expect(response).toBeInstanceOf(EndpointResponseDto);
      expect(response.code).toBe(200);
      expect(response.resultMessage).toBe("OPERATION_SUCCESS");
      expect(response.data).toEqual(testData);
      expect(response.dataList).toEqual(testDataList);
      expect(response.cacheTTL).toBe(0);
    });

    it("should create success response with custom code and message", () => {
      const testData = { id: "123", name: "Test User" };
      const response = successResponse(
        testData,
        undefined,
        201,
        "USER_CREATED",
        300
      );

      expect(response).toBeInstanceOf(EndpointResponseDto);
      expect(response.code).toBe(201);
      expect(response.resultMessage).toBe("USER_CREATED");
      expect(response.data).toEqual(testData);
      expect(response.cacheTTL).toBe(300);
    });

    it("should create success response with null data", () => {
      const response = successResponse(null);

      expect(response).toBeInstanceOf(EndpointResponseDto);
      expect(response.code).toBe(200);
      expect(response.resultMessage).toBe("OPERATION_SUCCESS");
      expect(response.data).toBeNull();
      expect(response.dataList).toBeUndefined();
    });

    it("should create success response with empty array dataList", () => {
      const response = successResponse(undefined, []);

      expect(response).toBeInstanceOf(EndpointResponseDto);
      expect(response.code).toBe(200);
      expect(response.resultMessage).toBe("OPERATION_SUCCESS");
      expect(response.data).toBeUndefined();
      expect(response.dataList).toEqual([]);
    });

    it("should handle complex data types", () => {
      const complexData = {
        user: {
          id: "123",
          profile: {
            name: "John Doe",
            preferences: {
              theme: "dark",
              notifications: true,
            },
          },
        },
        metadata: {
          created: "2024-01-01T00:00:00.000Z",
          tags: ["admin", "premium"],
        },
      };

      const response = successResponse(complexData);

      expect(response).toBeInstanceOf(EndpointResponseDto);
      expect(response.data).toEqual(complexData);
    });
  });

  describe("errorResponse", () => {
    it("should create error response with default values", () => {
      const response = errorResponse(400, "BAD_REQUEST");

      expect(response).toBeInstanceOf(ErrorResponseDTO);
      expect(response.code).toBe(400);
      expect(response.resultMessage).toBe("BAD_REQUEST");
      expect(response.debugMessage).toBeUndefined();
      expect(response.cacheTTL).toBe(0);
      expect(response.timestamp).toBeDefined();
      expect(typeof response.timestamp).toBe("string");
    });

    it("should create error response with debug message", () => {
      const response = errorResponse(
        500,
        "INTERNAL_SERVER_ERROR",
        "Database connection failed",
        60
      );

      expect(response).toBeInstanceOf(ErrorResponseDTO);
      expect(response.code).toBe(500);
      expect(response.resultMessage).toBe("INTERNAL_SERVER_ERROR");
      expect(response.debugMessage).toBe("Database connection failed");
      expect(response.cacheTTL).toBe(60);
    });

    it("should create error response with custom cache TTL", () => {
      const response = errorResponse(404, "NOT_FOUND", undefined, 120);

      expect(response).toBeInstanceOf(ErrorResponseDTO);
      expect(response.code).toBe(404);
      expect(response.resultMessage).toBe("NOT_FOUND");
      expect(response.debugMessage).toBeUndefined();
      expect(response.cacheTTL).toBe(120);
    });

    it("should handle various HTTP status codes", () => {
      const statusCodes = [400, 401, 403, 404, 409, 422, 500, 503];
      
      statusCodes.forEach(code => {
        const response = errorResponse(code, `ERROR_${code}`);
        
        expect(response).toBeInstanceOf(ErrorResponseDTO);
        expect(response.code).toBe(code);
        expect(response.resultMessage).toBe(`ERROR_${code}`);
      });
    });

    it("should create valid ISO timestamp", () => {
      const response = errorResponse(400, "BAD_REQUEST");
      
      expect(response.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      
      // Verify it's a valid date
      const date = new Date(response.timestamp);
      expect(date.getTime()).not.toBeNaN();
    });

    it("should handle special characters in messages", () => {
      const specialMessage = "Error with special chars: !@#$%^&*()_+-=[]{}|;':\",./<>?";
      const response = errorResponse(400, specialMessage);

      expect(response).toBeInstanceOf(ErrorResponseDTO);
      expect(response.resultMessage).toBe(specialMessage);
    });

    it("should handle unicode characters in messages", () => {
      const unicodeMessage = "Error with unicode: 测试中文 🚀 émojis";
      const response = errorResponse(400, unicodeMessage);

      expect(response).toBeInstanceOf(ErrorResponseDTO);
      expect(response.resultMessage).toBe(unicodeMessage);
    });
  });

  describe("makeResponse (Legacy)", () => {
    it("should handle SUCCESS type", () => {
      const data = { id: "123", name: "Test" };
      const response = makeResponse("SUCCESS", { data });

      expect(response).toBeInstanceOf(EndpointResponseDto);
      expect(response.code).toBe(200);
      expect(response.resultMessage).toBe("OPERATION_SUCCESS");
      expect(response.data).toEqual(data);
    });

    it("should handle CREATED type", () => {
      const data = { id: "123", name: "New User" };
      const response = makeResponse("CREATED", { data });

      expect(response).toBeInstanceOf(EndpointResponseDto);
      expect(response.code).toBe(201);
      expect(response.resultMessage).toBe("ENTITY_CREATED");
      expect(response.data).toEqual(data);
    });

    it("should handle SUCCESS type with dataList", () => {
      const dataList = [
        { id: "1", name: "User 1" },
        { id: "2", name: "User 2" },
      ];
      const response = makeResponse("SUCCESS", { dataList });

      expect(response).toBeInstanceOf(EndpointResponseDto);
      expect(response.code).toBe(200);
      expect(response.resultMessage).toBe("OPERATION_SUCCESS");
      expect(response.dataList).toEqual(dataList);
    });

    it("should handle ERROR type", () => {
      const response = makeResponse("ERROR");

      expect(response).toBeInstanceOf(ErrorResponseDTO);
      expect(response.code).toBe(404);
      expect(response.resultMessage).toBe("NOT_FOUND");
    });

    it("should handle BAD_REQUEST type", () => {
      const response = makeResponse("BAD_REQUEST");

      expect(response).toBeInstanceOf(ErrorResponseDTO);
      expect(response.code).toBe(400);
      expect(response.resultMessage).toBe("BAD_REQUEST");
    });

    it("should handle UNAUTHORIZED type", () => {
      const response = makeResponse("UNAUTHORIZED");

      expect(response).toBeInstanceOf(ErrorResponseDTO);
      expect(response.code).toBe(401);
      expect(response.resultMessage).toBe("UNAUTHORIZED");
    });

    it("should handle FORBIDDEN type", () => {
      const response = makeResponse("FORBIDDEN");

      expect(response).toBeInstanceOf(ErrorResponseDTO);
      expect(response.code).toBe(403);
      expect(response.resultMessage).toBe("FORBIDDEN");
    });

    it("should handle ENTITY_ALREADY_EXISTS type", () => {
      const response = makeResponse("ENTITY_ALREADY_EXISTS");

      expect(response).toBeInstanceOf(ErrorResponseDTO);
      expect(response.code).toBe(409);
      expect(response.resultMessage).toBe("ENTITY_ALREADY_EXISTS");
    });

    it("should handle INTERNAL_SERVER_ERROR type", () => {
      const response = makeResponse("INTERNAL_SERVER_ERROR");

      expect(response).toBeInstanceOf(ErrorResponseDTO);
      expect(response.code).toBe(500);
      expect(response.resultMessage).toBe("INTERNAL_SERVER_ERROR");
    });

    it("should handle unknown type with default error", () => {
      const response = makeResponse("UNKNOWN_TYPE");

      expect(response).toBeInstanceOf(ErrorResponseDTO);
      expect(response.code).toBe(500);
      expect(response.resultMessage).toBe("UNKNOWN_ERROR");
    });

    it("should handle empty data object", () => {
      const response = makeResponse("SUCCESS", {});

      expect(response).toBeInstanceOf(EndpointResponseDto);
      expect(response.code).toBe(200);
      expect(response.resultMessage).toBe("OPERATION_SUCCESS");
      expect(response.data).toBeUndefined();
      expect(response.dataList).toBeUndefined();
    });

    it("should handle null data", () => {
      const response = makeResponse("SUCCESS", null);

      expect(response).toBeInstanceOf(EndpointResponseDto);
      expect(response.code).toBe(200);
      expect(response.resultMessage).toBe("OPERATION_SUCCESS");
      expect(response.data).toBeUndefined();
      expect(response.dataList).toBeUndefined();
    });
  });

  describe("Integration Tests", () => {
    it("should maintain consistency between successResponse and makeResponse SUCCESS", () => {
      const testData = { id: "123", name: "Test" };
      
      const successResp = successResponse(testData);
      const makeResp = makeResponse("SUCCESS", { data: testData });

      expect(successResp.code).toBe(makeResp.code);
      expect(successResp.resultMessage).toBe(makeResp.resultMessage);
      expect(successResp.data).toEqual(makeResp.data);
    });

    it("should maintain consistency between errorResponse and makeResponse ERROR", () => {
      const errorResp = errorResponse(404, "NOT_FOUND");
      const makeResp = makeResponse("ERROR");

      expect(errorResp.code).toBe(makeResp.code);
      expect(errorResp.resultMessage).toBe(makeResp.resultMessage);
    });

    it("should handle edge cases consistently", () => {
      // Test with undefined data
      const response1 = successResponse(undefined);
      expect(response1.data).toBeUndefined();

      // Test with null data
      const response2 = successResponse(null);
      expect(response2.data).toBeNull();

      // Test with empty string message
      const response3 = errorResponse(400, "");
      expect(response3.resultMessage).toBe("");
    });
  });
});
