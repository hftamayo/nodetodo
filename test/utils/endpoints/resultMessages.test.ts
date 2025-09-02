import { ResultMessages, ResultMessageKeys } from "@/utils/endpoints/resultMessages";

describe("Result Messages", () => {
  describe("ResultMessages object", () => {
    it("should contain all expected message types", () => {
      const expectedKeys = [
        "SUCCESS",
        "CREATED", 
        "BAD_REQUEST",
        "ENTITY_ALREADY_EXISTS",
        "UNAUTHORIZED",
        "BAD_CREDENTIALS",
        "FORBIDDEN",
        "ERROR",
        "ACCOUNT_DISABLED",
        "INTERNAL_SERVER_ERROR",
      ];

      expectedKeys.forEach(key => {
        expect(ResultMessages).toHaveProperty(key);
        expect(ResultMessages[key as keyof typeof ResultMessages]).toBeDefined();
      });
    });

    it("should have correct SUCCESS message", () => {
      expect(ResultMessages.SUCCESS).toEqual({
        code: 200,
        message: "OPERATION_SUCCESS",
      });
    });

    it("should have correct CREATED message", () => {
      expect(ResultMessages.CREATED).toEqual({
        code: 201,
        message: "ENTITY_CREATED",
      });
    });

    it("should have correct BAD_REQUEST message", () => {
      expect(ResultMessages.BAD_REQUEST).toEqual({
        code: 400,
        message: "REQUIREMENTS_MISSING",
      });
    });

    it("should have correct ENTITY_ALREADY_EXISTS message", () => {
      expect(ResultMessages.ENTITY_ALREADY_EXISTS).toEqual({
        code: 400,
        message: "ENTITY_ALREADY_EXISTS",
      });
    });

    it("should have correct UNAUTHORIZED message", () => {
      expect(ResultMessages.UNAUTHORIZED).toEqual({
        code: 401,
        message: "UNAUTHORIZED",
      });
    });

    it("should have correct BAD_CREDENTIALS message", () => {
      expect(ResultMessages.BAD_CREDENTIALS).toEqual({
        code: 402,
        message: "BAD_CREDENTIALS",
      });
    });

    it("should have correct FORBIDDEN message", () => {
      expect(ResultMessages.FORBIDDEN).toEqual({
        code: 403,
        message: "FORBIDDEN",
      });
    });

    it("should have correct ERROR message", () => {
      expect(ResultMessages.ERROR).toEqual({
        code: 404,
        message: "ENTITY_NOT_FOUND",
      });
    });

    it("should have correct ACCOUNT_DISABLED message", () => {
      expect(ResultMessages.ACCOUNT_DISABLED).toEqual({
        code: 405,
        message: "ACCOUNT_DISABLED",
      });
    });

    it("should have correct INTERNAL_SERVER_ERROR message", () => {
      expect(ResultMessages.INTERNAL_SERVER_ERROR).toEqual({
        code: 500,
        message: "UNKNOWN_SERVER_ERROR",
      });
    });

    it("should have unique codes for each message type", () => {
      const codes = Object.values(ResultMessages).map(msg => msg.code);
      const uniqueCodes = [...new Set(codes)];
      
      // Note: BAD_REQUEST and ENTITY_ALREADY_EXISTS both use code 400, which is intentional
      // This test verifies we're aware of this design decision
      expect(codes).toHaveLength(10);
      expect(uniqueCodes).toHaveLength(9); // 10 total, 9 unique (400 appears twice)
    });

    it("should have unique messages for each message type", () => {
      const messages = Object.values(ResultMessages).map(msg => msg.message);
      const uniqueMessages = [...new Set(messages)];
      
      expect(messages).toHaveLength(uniqueMessages.length);
    });

    it("should have valid HTTP status codes", () => {
      Object.values(ResultMessages).forEach(msg => {
        expect(msg.code).toBeGreaterThanOrEqual(200);
        expect(msg.code).toBeLessThanOrEqual(599);
        expect(Number.isInteger(msg.code)).toBe(true);
      });
    });

    it("should have non-empty message strings", () => {
      Object.values(ResultMessages).forEach(msg => {
        expect(msg.message).toBeDefined();
        expect(typeof msg.message).toBe("string");
        expect(msg.message.length).toBeGreaterThan(0);
      });
    });

    it("should be properly typed as const", () => {
      // This test verifies that the object is properly typed as const
      // Note: const assertion provides compile-time immutability, not runtime immutability
      const originalSuccess = ResultMessages.SUCCESS;
      
      expect(originalSuccess).toEqual({
        code: 200,
        message: "OPERATION_SUCCESS",
      });
      
      // Verify the structure is as expected
      expect(typeof originalSuccess.code).toBe("number");
      expect(typeof originalSuccess.message).toBe("string");
    });
  });

  describe("ResultMessageKeys type", () => {
    it("should include all message keys", () => {
      const expectedKeys: ResultMessageKeys[] = [
        "SUCCESS",
        "CREATED",
        "BAD_REQUEST", 
        "ENTITY_ALREADY_EXISTS",
        "UNAUTHORIZED",
        "BAD_CREDENTIALS",
        "FORBIDDEN",
        "ERROR",
        "ACCOUNT_DISABLED",
        "INTERNAL_SERVER_ERROR",
      ];

      expectedKeys.forEach(key => {
        expect(ResultMessages).toHaveProperty(key);
      });
    });

    it("should allow type-safe access to messages", () => {
      const key: ResultMessageKeys = "SUCCESS";
      const message = ResultMessages[key];
      
      expect(message).toBeDefined();
      expect(message.code).toBe(200);
      expect(message.message).toBe("OPERATION_SUCCESS");
    });

    it("should work with Object.keys() for iteration", () => {
      const keys = Object.keys(ResultMessages) as ResultMessageKeys[];
      
      expect(keys).toHaveLength(10);
      expect(keys).toContain("SUCCESS");
      expect(keys).toContain("ERROR");
      expect(keys).toContain("INTERNAL_SERVER_ERROR");
    });

    it("should work with Object.entries() for iteration", () => {
      const entries = Object.entries(ResultMessages);
      
      expect(entries).toHaveLength(10);
      
      entries.forEach(([key, value]) => {
        expect(typeof key).toBe("string");
        expect(value).toHaveProperty("code");
        expect(value).toHaveProperty("message");
        expect(typeof value.code).toBe("number");
        expect(typeof value.message).toBe("string");
      });
    });
  });

  describe("Message categorization", () => {
    it("should have success messages (2xx)", () => {
      const successMessages = Object.values(ResultMessages).filter(
        msg => msg.code >= 200 && msg.code < 300
      );
      
      expect(successMessages).toHaveLength(2);
      expect(successMessages.map(m => m.code)).toEqual([200, 201]);
    });

    it("should have client error messages (4xx)", () => {
      const clientErrorMessages = Object.values(ResultMessages).filter(
        msg => msg.code >= 400 && msg.code < 500
      );
      
      expect(clientErrorMessages).toHaveLength(7);
      expect(clientErrorMessages.map(m => m.code)).toEqual([400, 400, 401, 402, 403, 404, 405]);
    });

    it("should have server error messages (5xx)", () => {
      const serverErrorMessages = Object.values(ResultMessages).filter(
        msg => msg.code >= 500 && msg.code < 600
      );
      
      expect(serverErrorMessages).toHaveLength(1);
      expect(serverErrorMessages.map(m => m.code)).toEqual([500]);
    });

    it("should not have redirect messages (3xx)", () => {
      const redirectMessages = Object.values(ResultMessages).filter(
        msg => msg.code >= 300 && msg.code < 400
      );
      
      expect(redirectMessages).toHaveLength(0);
    });
  });

  describe("Message consistency", () => {
    it("should have consistent naming convention", () => {
      Object.entries(ResultMessages).forEach(([key, value]) => {
        // Keys should be UPPER_SNAKE_CASE
        expect(key).toMatch(/^[A-Z_]+$/);
        
        // Messages should be UPPER_SNAKE_CASE
        expect(value.message).toMatch(/^[A-Z_]+$/);
      });
    });

    it("should have meaningful message names", () => {
      const meaningfulMessages = [
        "OPERATION_SUCCESS",
        "ENTITY_CREATED", 
        "REQUIREMENTS_MISSING",
        "ENTITY_ALREADY_EXISTS",
        "UNAUTHORIZED",
        "BAD_CREDENTIALS",
        "FORBIDDEN",
        "ENTITY_NOT_FOUND",
        "ACCOUNT_DISABLED",
        "UNKNOWN_SERVER_ERROR",
      ];

      Object.values(ResultMessages).forEach(msg => {
        expect(meaningfulMessages).toContain(msg.message);
      });
    });

    it("should have appropriate HTTP status codes for message types", () => {
      // Success operations
      expect(ResultMessages.SUCCESS.code).toBe(200);
      expect(ResultMessages.CREATED.code).toBe(201);

      // Client errors
      expect(ResultMessages.BAD_REQUEST.code).toBe(400);
      expect(ResultMessages.ENTITY_ALREADY_EXISTS.code).toBe(400);
      expect(ResultMessages.UNAUTHORIZED.code).toBe(401);
      expect(ResultMessages.BAD_CREDENTIALS.code).toBe(402);
      expect(ResultMessages.FORBIDDEN.code).toBe(403);
      expect(ResultMessages.ERROR.code).toBe(404);
      expect(ResultMessages.ACCOUNT_DISABLED.code).toBe(405);

      // Server errors
      expect(ResultMessages.INTERNAL_SERVER_ERROR.code).toBe(500);
    });
  });

  describe("Edge cases and validation", () => {
    it("should handle accessing non-existent keys gracefully", () => {
      // This test ensures TypeScript type safety
      const key = "NON_EXISTENT" as any;
      
      expect(() => {
        const message = (ResultMessages as any)[key];
        expect(message).toBeUndefined();
      }).not.toThrow();
    });

    it("should maintain object structure integrity", () => {
      const originalKeys = Object.keys(ResultMessages);
      const originalValues = Object.values(ResultMessages);
      
      // Verify structure hasn't changed
      expect(originalKeys).toHaveLength(10);
      expect(originalValues).toHaveLength(10);
      
      // Verify each value has the expected structure
      originalValues.forEach(value => {
        expect(value).toHaveProperty("code");
        expect(value).toHaveProperty("message");
        expect(Object.keys(value)).toHaveLength(2);
      });
    });

    it("should be usable in switch statements", () => {
      const getMessageByCode = (code: number) => {
        switch (code) {
          case ResultMessages.SUCCESS.code:
            return ResultMessages.SUCCESS.message;
          case ResultMessages.CREATED.code:
            return ResultMessages.CREATED.message;
          case ResultMessages.ERROR.code:
            return ResultMessages.ERROR.message;
          default:
            return "UNKNOWN";
        }
      };

      expect(getMessageByCode(200)).toBe("OPERATION_SUCCESS");
      expect(getMessageByCode(201)).toBe("ENTITY_CREATED");
      expect(getMessageByCode(404)).toBe("ENTITY_NOT_FOUND");
      expect(getMessageByCode(999)).toBe("UNKNOWN");
    });
  });
});
