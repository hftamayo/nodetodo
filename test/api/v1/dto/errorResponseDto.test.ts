import { ErrorResponseDto } from '../../src/dto/errorResponseDto';

describe('ErrorResponseDto', () => {
  describe('constructor', () => {
    it('should create an ErrorResponseDTO including all fields', () => {
      // Arrange
      const timestamp = new Date('2024-01-01T00:00:00.000Z');
      const status = 400;
      const errors = ['Validation failed', 'Invalid email format'];
      const message = 'Bad Request';

      // Act
      const errorResponse = new ErrorResponseDto(status, message, errors, timestamp);

      // Assert
      expect(errorResponse.status).toBe(status);
      expect(errorResponse.message).toBe(message);
      expect(errorResponse.errors).toEqual(errors);
      expect(errorResponse.timestamp).toBe(timestamp);
    });

    it('should create an ErrorResponseDTO with single error', () => {
      // Arrange
      const status = 404;
      const message = 'Not Found';
      const errors = ['Resource not found'];

      // Act
      const errorResponse = new ErrorResponseDto(status, message, errors);

      // Assert
      expect(errorResponse.status).toBe(status);
      expect(errorResponse.message).toBe(message);
      expect(errorResponse.errors).toEqual(errors);
      expect(errorResponse.timestamp).toBeInstanceOf(Date);
    });

    it('should create an ErrorResponseDTO with null errors', () => {
      // Arrange
      const status = 500;
      const message = 'Internal Server Error';
      const errors = null;

      // Act
      const errorResponse = new ErrorResponseDto(status, message, errors);

      // Assert
      expect(errorResponse.status).toBe(status);
      expect(errorResponse.message).toBe(message);
      expect(errorResponse.errors).toBeNull();
      expect(errorResponse.timestamp).toBeInstanceOf(Date);
    });

    it('should create an ErrorResponseDTO with empty error list', () => {
      // Arrange
      const status = 422;
      const message = 'Unprocessable Entity';
      const errors: string[] = [];

      // Act
      const errorResponse = new ErrorResponseDto(status, message, errors);

      // Assert
      expect(errorResponse.status).toBe(status);
      expect(errorResponse.message).toBe(message);
      expect(errorResponse.errors).toEqual([]);
      expect(errorResponse.timestamp).toBeInstanceOf(Date);
    });

    it('should handle null message gracefully', () => {
      // Arrange
      const status = 500;
      const message = null;
      const errors = ['Database connection failed'];

      // Act
      const errorResponse = new ErrorResponseDto(status, message, errors);

      // Assert
      expect(errorResponse.status).toBe(status);
      expect(errorResponse.message).toBeNull();
      expect(errorResponse.errors).toEqual(errors);
      expect(errorResponse.timestamp).toBeInstanceOf(Date);
    });
  });

  describe('serialization', () => {
    it('should serialize to JSON correctly', () => {
      // Arrange
      const timestamp = new Date('2024-01-01T00:00:00.000Z');
      const status = 400;
      const message = 'Bad Request';
      const errors = ['Invalid input'];

      // Act
      const errorResponse = new ErrorResponseDto(status, message, errors, timestamp);
      const json = JSON.stringify(errorResponse);

      // Assert
      const expectedJson = JSON.stringify({
        status: 400,
        message: 'Bad Request',
        errors: ['Invalid input'],
        timestamp: '2024-01-01T00:00:00.000Z'
      });
      expect(json).toBe(expectedJson);
    });

    it('should serialize with null values correctly', () => {
      // Arrange
      const status = 500;
      const message = null;
      const errors = null;

      // Act
      const errorResponse = new ErrorResponseDto(status, message, errors);
      const json = JSON.stringify(errorResponse);
      const parsed = JSON.parse(json);

      // Assert
      expect(parsed.status).toBe(status);
      expect(parsed.message).toBeNull();
      expect(parsed.errors).toBeNull();
      expect(parsed.timestamp).toBeDefined();
    });
  });

  describe('default values', () => {
    it('should use current timestamp when not provided', () => {
      // Arrange
      const status = 400;
      const message = 'Bad Request';
      const errors = ['Error'];

      // Act
      const beforeCreation = new Date();
      const errorResponse = new ErrorResponseDto(status, message, errors);
      const afterCreation = new Date();

      // Assert
      expect(errorResponse.timestamp.getTime()).toBeGreaterThanOrEqual(beforeCreation.getTime());
      expect(errorResponse.timestamp.getTime()).toBeLessThanOrEqual(afterCreation.getTime());
    });
  });
}); 