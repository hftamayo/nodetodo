import { ErrorResponseDTO } from '../../../../src/api/v1/dto/error/ErrorResponse.dto';

describe('ErrorResponseDTO', () => {
  describe('constructor', () => {
    it('should create an ErrorResponseDTO with all fields', () => {
      // Arrange
      const timestamp = new Date('2024-01-01T00:00:00.000Z');
      const code = 400;
      const resultMessage = 'Bad Request';
      const debugMessage = 'Validation failed';
      const cacheTTL = 0;

      // Act
      const errorResponse = new ErrorResponseDTO({
        code,
        resultMessage,
        debugMessage,
        timestamp: timestamp.getTime(),
        cacheTTL
      });

      // Assert
      expect(errorResponse.code).toBe(code);
      expect(errorResponse.resultMessage).toBe(resultMessage);
      expect(errorResponse.debugMessage).toBe(debugMessage);
      expect(errorResponse.timestamp).toBe(timestamp.toISOString());
      expect(errorResponse.cacheTTL).toBe(cacheTTL);
    });

    it('should create an ErrorResponseDTO with minimal fields', () => {
      // Arrange
      const code = 404;
      const resultMessage = 'Not Found';

      // Act
      const errorResponse = new ErrorResponseDTO({
        code,
        resultMessage
      });

      // Assert
      expect(errorResponse.code).toBe(code);
      expect(errorResponse.resultMessage).toBe(resultMessage);
      expect(errorResponse.debugMessage).toBeUndefined();
      expect(errorResponse.cacheTTL).toBe(0);
      expect(errorResponse.timestamp).toBeDefined();
      expect(typeof errorResponse.timestamp).toBe('string');
    });

    it('should create an ErrorResponseDTO with custom cache TTL', () => {
      // Arrange
      const code = 500;
      const resultMessage = 'Internal Server Error';
      const debugMessage = 'Database connection failed';
      const cacheTTL = 300;

      // Act
      const errorResponse = new ErrorResponseDTO({
        code,
        resultMessage,
        debugMessage,
        cacheTTL
      });

      // Assert
      expect(errorResponse.code).toBe(code);
      expect(errorResponse.resultMessage).toBe(resultMessage);
      expect(errorResponse.debugMessage).toBe(debugMessage);
      expect(errorResponse.cacheTTL).toBe(cacheTTL);
    });

    it('should handle undefined debugMessage', () => {
      // Arrange
      const code = 422;
      const resultMessage = 'Unprocessable Entity';

      // Act
      const errorResponse = new ErrorResponseDTO({
        code,
        resultMessage,
        debugMessage: undefined
      });

      // Assert
      expect(errorResponse.code).toBe(code);
      expect(errorResponse.resultMessage).toBe(resultMessage);
      expect(errorResponse.debugMessage).toBeUndefined();
    });

    it('should handle null debugMessage', () => {
      // Arrange
      const code = 500;
      const resultMessage = 'Internal Server Error';

      // Act
      const errorResponse = new ErrorResponseDTO({
        code,
        resultMessage,
        debugMessage: null as any
      });

      // Assert
      expect(errorResponse.code).toBe(code);
      expect(errorResponse.resultMessage).toBe(resultMessage);
      expect(errorResponse.debugMessage).toBeNull();
    });
  });

  describe('timestamp handling', () => {
    it('should use provided timestamp', () => {
      // Arrange
      const timestamp = new Date('2024-01-01T12:00:00.000Z');
      const code = 400;
      const resultMessage = 'Bad Request';

      // Act
      const errorResponse = new ErrorResponseDTO({
        code,
        resultMessage,
        timestamp: timestamp.getTime()
      });

      // Assert
      expect(errorResponse.timestamp).toBe(timestamp.toISOString());
    });

    it('should use current timestamp when not provided', () => {
      // Arrange
      const code = 400;
      const resultMessage = 'Bad Request';

      // Act
      const beforeCreation = new Date();
      const errorResponse = new ErrorResponseDTO({
        code,
        resultMessage
      });
      const afterCreation = new Date();

      // Assert
      const responseTimestamp = new Date(errorResponse.timestamp);
      expect(responseTimestamp.getTime()).toBeGreaterThanOrEqual(beforeCreation.getTime());
      expect(responseTimestamp.getTime()).toBeLessThanOrEqual(afterCreation.getTime());
    });

    it('should create valid ISO timestamp', () => {
      // Arrange
      const code = 400;
      const resultMessage = 'Bad Request';

      // Act
      const errorResponse = new ErrorResponseDTO({
        code,
        resultMessage
      });

      // Assert
      expect(errorResponse.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
      
      // Verify it's a valid date
      const date = new Date(errorResponse.timestamp);
      expect(date.getTime()).not.toBeNaN();
    });
  });

  describe('serialization', () => {
    it('should serialize to JSON correctly', () => {
      // Arrange
      const timestamp = new Date('2024-01-01T00:00:00.000Z');
      const code = 400;
      const resultMessage = 'Bad Request';
      const debugMessage = 'Invalid input';
      const cacheTTL = 0;

      // Act
      const errorResponse = new ErrorResponseDTO({
        code,
        resultMessage,
        debugMessage,
        timestamp: timestamp.getTime(),
        cacheTTL
      });
      const json = JSON.stringify(errorResponse);

      // Assert
      const expectedJson = JSON.stringify({
        code: 400,
        resultMessage: 'Bad Request',
        debugMessage: 'Invalid input',
        timestamp: '2024-01-01T00:00:00.000Z',
        cacheTTL: 0
      });
      expect(json).toBe(expectedJson);
    });

    it('should serialize with undefined debugMessage correctly', () => {
      // Arrange
      const code = 500;
      const resultMessage = 'Internal Server Error';

      // Act
      const errorResponse = new ErrorResponseDTO({
        code,
        resultMessage
      });
      const json = JSON.stringify(errorResponse);
      const parsed = JSON.parse(json);

      // Assert
      expect(parsed.code).toBe(code);
      expect(parsed.resultMessage).toBe(resultMessage);
      expect(parsed.debugMessage).toBeUndefined();
      expect(parsed.timestamp).toBeDefined();
      expect(parsed.cacheTTL).toBe(0);
    });
  });

  describe('HTTP status codes', () => {
    it('should handle various HTTP status codes', () => {
      const statusCodes = [400, 401, 403, 404, 409, 422, 500, 503];
      
      statusCodes.forEach(code => {
        const errorResponse = new ErrorResponseDTO({
          code,
          resultMessage: `Error ${code}`
        });
        
        expect(errorResponse.code).toBe(code);
        expect(errorResponse.resultMessage).toBe(`Error ${code}`);
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty resultMessage', () => {
      // Arrange
      const code = 400;
      const resultMessage = '';

      // Act
      const errorResponse = new ErrorResponseDTO({
        code,
        resultMessage
      });

      // Assert
      expect(errorResponse.code).toBe(code);
      expect(errorResponse.resultMessage).toBe('');
    });

    it('should handle special characters in messages', () => {
      // Arrange
      const code = 400;
      const resultMessage = 'Error with special chars: !@#$%^&*()_+-=[]{}|;\':",./<>?';
      const debugMessage = 'Unicode: 测试中文 🚀 émojis';

      // Act
      const errorResponse = new ErrorResponseDTO({
        code,
        resultMessage,
        debugMessage
      });

      // Assert
      expect(errorResponse.resultMessage).toBe(resultMessage);
      expect(errorResponse.debugMessage).toBe(debugMessage);
    });

    it('should handle negative cache TTL', () => {
      // Arrange
      const code = 400;
      const resultMessage = 'Bad Request';
      const cacheTTL = -1;

      // Act
      const errorResponse = new ErrorResponseDTO({
        code,
        resultMessage,
        cacheTTL
      });

      // Assert
      expect(errorResponse.cacheTTL).toBe(-1);
    });
  });
});