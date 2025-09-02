import { encodeCursor, decodeCursor } from "@/utils/pagination/cursor";

describe("Cursor Pagination Utils", () => {
  describe("encodeCursor", () => {
    it("should encode a simple cursor payload", () => {
      const payload = {
        id: "123",
        sort: "createdAt",
        order: "desc" as const,
      };

      const encoded = encodeCursor(payload);
      
      expect(encoded).toBeDefined();
      expect(typeof encoded).toBe("string");
      expect(encoded.length).toBeGreaterThan(0);
    });

    it("should encode cursor with numeric id", () => {
      const payload = {
        id: 456,
        sort: "title",
        order: "asc" as const,
      };

      const encoded = encodeCursor(payload);
      
      expect(encoded).toBeDefined();
      expect(typeof encoded).toBe("string");
    });

    it("should encode cursor with filters", () => {
      const payload = {
        id: "789",
        sort: "name",
        order: "desc" as const,
        filters: {
          status: "active",
          category: "work",
          priority: 1,
        },
      };

      const encoded = encodeCursor(payload);
      
      expect(encoded).toBeDefined();
      expect(typeof encoded).toBe("string");
    });

    it("should encode cursor with minimal payload", () => {
      const payload = {
        id: "minimal",
      };

      const encoded = encodeCursor(payload);
      
      expect(encoded).toBeDefined();
      expect(typeof encoded).toBe("string");
    });

    it("should produce different encodings for different payloads", () => {
      const payload1 = { id: "123", sort: "name", order: "asc" as const };
      const payload2 = { id: "456", sort: "name", order: "asc" as const };
      
      const encoded1 = encodeCursor(payload1);
      const encoded2 = encodeCursor(payload2);
      
      expect(encoded1).not.toBe(encoded2);
    });

    it("should handle complex filter objects", () => {
      const payload = {
        id: "complex",
        filters: {
          nested: {
            deep: {
              value: "test",
              array: [1, 2, 3],
            },
          },
          array: ["a", "b", "c"],
          boolean: true,
          null: null,
        },
      };

      const encoded = encodeCursor(payload);
      
      expect(encoded).toBeDefined();
      expect(typeof encoded).toBe("string");
    });
  });

  describe("decodeCursor", () => {
    it("should decode a simple cursor", () => {
      const originalPayload = {
        id: "123",
        sort: "createdAt",
        order: "desc" as const,
      };

      const encoded = encodeCursor(originalPayload);
      const decoded = decodeCursor(encoded);

      expect(decoded).toEqual(originalPayload);
    });

    it("should decode cursor with numeric id", () => {
      const originalPayload = {
        id: 456,
        sort: "title",
        order: "asc" as const,
      };

      const encoded = encodeCursor(originalPayload);
      const decoded = decodeCursor(encoded);

      expect(decoded).toEqual(originalPayload);
    });

    it("should decode cursor with filters", () => {
      const originalPayload = {
        id: "789",
        sort: "name",
        order: "desc" as const,
        filters: {
          status: "active",
          category: "work",
          priority: 1,
        },
      };

      const encoded = encodeCursor(originalPayload);
      const decoded = decodeCursor(encoded);

      expect(decoded).toEqual(originalPayload);
    });

    it("should decode cursor with minimal payload", () => {
      const originalPayload = {
        id: "minimal",
      };

      const encoded = encodeCursor(originalPayload);
      const decoded = decodeCursor(encoded);

      expect(decoded).toEqual(originalPayload);
    });

    it("should decode complex filter objects", () => {
      const originalPayload = {
        id: "complex",
        filters: {
          nested: {
            deep: {
              value: "test",
              array: [1, 2, 3],
            },
          },
          array: ["a", "b", "c"],
          boolean: true,
          null: null,
        },
      };

      const encoded = encodeCursor(originalPayload);
      const decoded = decodeCursor(encoded);

      expect(decoded).toEqual(originalPayload);
    });

    it("should handle round-trip encoding/decoding", () => {
      const testCases = [
        { id: "simple" },
        { id: 123, sort: "name" },
        { id: "test", sort: "date", order: "desc" as const },
        { 
          id: "complex", 
          sort: "priority", 
          order: "asc" as const,
          filters: { status: "active", type: "urgent" }
        },
      ];

      testCases.forEach((originalPayload) => {
        const encoded = encodeCursor(originalPayload);
        const decoded = decodeCursor(encoded);
        expect(decoded).toEqual(originalPayload);
      });
    });
  });

  describe("Error Handling", () => {
    it("should throw error when decoding invalid base64", () => {
      const invalidCursor = "invalid-base64-string!@#";
      
      expect(() => {
        decodeCursor(invalidCursor);
      }).toThrow();
    });

    it("should throw error when decoding invalid JSON", () => {
      const invalidJsonCursor = Buffer.from("invalid-json").toString('base64');
      
      expect(() => {
        decodeCursor(invalidJsonCursor);
      }).toThrow();
    });

    it("should throw error when decoding empty string", () => {
      expect(() => {
        decodeCursor("");
      }).toThrow();
    });

    it("should handle special characters in payload", () => {
      const payload = {
        id: "special-chars-!@#$%^&*()",
        sort: "name with spaces",
        filters: {
          "key with spaces": "value with special chars !@#",
          unicode: "测试中文",
        },
      };

      const encoded = encodeCursor(payload);
      const decoded = decodeCursor(encoded);

      expect(decoded).toEqual(payload);
    });
  });

  describe("Edge Cases", () => {
    it("should handle very long strings", () => {
      const longString = "a".repeat(1000);
      const payload = {
        id: longString,
        sort: longString,
        filters: {
          longKey: longString,
        },
      };

      const encoded = encodeCursor(payload);
      const decoded = decodeCursor(encoded);

      expect(decoded).toEqual(payload);
    });

    it("should handle empty filters object", () => {
      const payload = {
        id: "test",
        filters: {},
      };

      const encoded = encodeCursor(payload);
      const decoded = decodeCursor(encoded);

      expect(decoded).toEqual(payload);
    });

    it("should handle undefined and null values in filters", () => {
      const payload = {
        id: "test",
        filters: {
          undefined: undefined,
          null: null,
          empty: "",
          zero: 0,
          false: false,
        },
      };

      const encoded = encodeCursor(payload);
      const decoded = decodeCursor(encoded);

      expect(decoded).toEqual(payload);
    });
  });
});
