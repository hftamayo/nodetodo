import { generateETag } from "@/utils/pagination/etag";

describe("ETag Generation Utils", () => {
  describe("generateETag", () => {
    it("should generate ETag for single item", () => {
      const data = [
        {
          id: "123",
          title: "Test Todo",
          updatedAt: "2024-01-01T00:00:00.000Z",
        },
      ];

      const etag = generateETag(data);

      expect(etag).toBeDefined();
      expect(typeof etag).toBe("string");
      expect(etag).toMatch(/^W\/".*"$/); // Should be weak ETag format
      expect(etag).toHaveLength(68); // W/" + 64 hex chars + "
    });

    it("should generate ETag for multiple items", () => {
      const data = [
        {
          id: "123",
          title: "First Todo",
          updatedAt: "2024-01-01T00:00:00.000Z",
        },
        {
          id: "456",
          title: "Second Todo",
          updatedAt: "2024-01-02T00:00:00.000Z",
        },
      ];

      const etag = generateETag(data);

      expect(etag).toBeDefined();
      expect(typeof etag).toBe("string");
      expect(etag).toMatch(/^W\/".*"$/);
    });

    it("should generate different ETags for different data", () => {
      const data1 = [
        {
          id: "123",
          title: "First Todo",
          updatedAt: "2024-01-01T00:00:00.000Z",
        },
      ];

      const data2 = [
        {
          id: "456",
          title: "Second Todo",
          updatedAt: "2024-01-01T00:00:00.000Z",
        },
      ];

      const etag1 = generateETag(data1);
      const etag2 = generateETag(data2);

      expect(etag1).not.toBe(etag2);
    });

    it("should generate same ETag for identical data", () => {
      const data = [
        {
          id: "123",
          title: "Test Todo",
          updatedAt: "2024-01-01T00:00:00.000Z",
        },
      ];

      const etag1 = generateETag(data);
      const etag2 = generateETag(data);

      expect(etag1).toBe(etag2);
    });

    it("should handle numeric IDs", () => {
      const data = [
        {
          id: 123,
          title: "Numeric ID Todo",
          updatedAt: "2024-01-01T00:00:00.000Z",
        },
      ];

      const etag = generateETag(data);

      expect(etag).toBeDefined();
      expect(typeof etag).toBe("string");
      expect(etag).toMatch(/^W\/".*"$/);
    });

    it("should handle empty array", () => {
      const data: Array<{
        id: string | number;
        title: string;
        updatedAt: string;
      }> = [];

      const etag = generateETag(data);

      expect(etag).toBeDefined();
      expect(typeof etag).toBe("string");
      expect(etag).toMatch(/^W\/".*"$/);
      expect(etag).toBe(
        'W/"e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"'
      ); // SHA256 of empty string
    });

    it("should handle special characters in title", () => {
      const data = [
        {
          id: "123",
          title: "Special chars: !@#$%^&*()_+-=[]{}|;':\",./<>?",
          updatedAt: "2024-01-01T00:00:00.000Z",
        },
      ];

      const etag = generateETag(data);

      expect(etag).toBeDefined();
      expect(typeof etag).toBe("string");
      expect(etag).toMatch(/^W\/".*"$/);
    });

    it("should handle unicode characters", () => {
      const data = [
        {
          id: "123",
          title: "Unicode: 测试中文 🚀 émojis",
          updatedAt: "2024-01-01T00:00:00.000Z",
        },
      ];

      const etag = generateETag(data);

      expect(etag).toBeDefined();
      expect(typeof etag).toBe("string");
      expect(etag).toMatch(/^W\/".*"$/);
    });

    it("should handle long titles", () => {
      const longTitle = "A".repeat(1000);
      const data = [
        {
          id: "123",
          title: longTitle,
          updatedAt: "2024-01-01T00:00:00.000Z",
        },
      ];

      const etag = generateETag(data);

      expect(etag).toBeDefined();
      expect(typeof etag).toBe("string");
      expect(etag).toMatch(/^W\/".*"$/);
    });

    it("should be deterministic for same input", () => {
      const data = [
        {
          id: "123",
          title: "Deterministic Test",
          updatedAt: "2024-01-01T00:00:00.000Z",
        },
        {
          id: "456",
          title: "Another Item",
          updatedAt: "2024-01-02T00:00:00.000Z",
        },
      ];

      // Generate multiple times
      const etags = Array.from({ length: 10 }, () => generateETag(data));

      // All should be identical
      etags.forEach((etag) => {
        expect(etag).toBe(etags[0]);
      });
    });

    it("should handle different timestamp formats", () => {
      const data1 = [
        {
          id: "123",
          title: "Test",
          updatedAt: "2024-01-01T00:00:00.000Z",
        },
      ];

      const data2 = [
        {
          id: "123",
          title: "Test",
          updatedAt: "2024-01-01T00:00:00Z",
        },
      ];

      const etag1 = generateETag(data1);
      const etag2 = generateETag(data2);

      // Different timestamp formats should produce different ETags
      expect(etag1).not.toBe(etag2);
    });

    it("should handle mixed ID types", () => {
      const data = [
        {
          id: "string-id",
          title: "String ID Item",
          updatedAt: "2024-01-01T00:00:00.000Z",
        },
        {
          id: 123,
          title: "Numeric ID Item",
          updatedAt: "2024-01-02T00:00:00.000Z",
        },
      ];

      const etag = generateETag(data);

      expect(etag).toBeDefined();
      expect(typeof etag).toBe("string");
      expect(etag).toMatch(/^W\/".*"$/);
    });
  });

  describe("ETag Format Validation", () => {
    it("should always produce weak ETag format", () => {
      const testCases = [
        [{ id: "1", title: "A", updatedAt: "2024-01-01T00:00:00.000Z" }],
        [
          { id: "1", title: "A", updatedAt: "2024-01-01T00:00:00.000Z" },
          { id: "2", title: "B", updatedAt: "2024-01-02T00:00:00.000Z" },
        ],
        [],
      ];

      testCases.forEach((data) => {
        const etag = generateETag(data);
        expect(etag).toMatch(/^W\/".*"$/);
      });
    });

    it("should produce valid SHA256 hash", () => {
      const data = [
        {
          id: "123",
          title: "Test",
          updatedAt: "2024-01-01T00:00:00.000Z",
        },
      ];

      const etag = generateETag(data);
      const hashPart = etag.slice(3, -1); // Remove W/" and "

      expect(hashPart).toMatch(/^[a-f0-9]{64}$/); // 64 hex characters
    });
  });

  describe("Edge Cases", () => {
    it("should handle items with same ID but different titles", () => {
      const data = [
        {
          id: "123",
          title: "First Title",
          updatedAt: "2024-01-01T00:00:00.000Z",
        },
        {
          id: "123",
          title: "Second Title",
          updatedAt: "2024-01-02T00:00:00.000Z",
        },
      ];

      const etag = generateETag(data);

      expect(etag).toBeDefined();
      expect(typeof etag).toBe("string");
      expect(etag).toMatch(/^W\/".*"$/);
    });

    it("should handle items with same title but different IDs", () => {
      const data = [
        {
          id: "123",
          title: "Same Title",
          updatedAt: "2024-01-01T00:00:00.000Z",
        },
        {
          id: "456",
          title: "Same Title",
          updatedAt: "2024-01-02T00:00:00.000Z",
        },
      ];

      const etag = generateETag(data);

      expect(etag).toBeDefined();
      expect(typeof etag).toBe("string");
      expect(etag).toMatch(/^W\/".*"$/);
    });

    it("should handle very large datasets", () => {
      const data = Array.from({ length: 1000 }, (_, i) => ({
        id: `item-${i}`,
        title: `Title ${i}`,
        updatedAt: `2024-01-01T00:00:${i.toString().padStart(2, "0")}.000Z`,
      }));

      const etag = generateETag(data);

      expect(etag).toBeDefined();
      expect(typeof etag).toBe("string");
      expect(etag).toMatch(/^W\/".*"$/);
    });
  });
});
