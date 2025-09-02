import { EndpointResponseDto } from '../../../../src/api/v1/dto/EndpointResponse.dto';

describe('EndpointResponseDto', () => {
  describe('constructor', () => {
    it('should create an EndpointResponseDto with all fields', () => {
      // Arrange
      const timestamp = new Date('2024-01-01T00:00:00.000Z').getTime();
      const code = 200;
      const resultMessage = 'SUCCESS';
      const data = { id: '123', name: 'Test User' };
      const dataList = [
        { id: '123', name: 'Test User 1' },
        { id: '456', name: 'Test User 2' }
      ];
      const cacheTTL = 300;

      // Act
      const response = new EndpointResponseDto({
        code,
        resultMessage,
        data,
        dataList,
        timestamp,
        cacheTTL
      });

      // Assert
      expect(response.code).toBe(code);
      expect(response.resultMessage).toBe(resultMessage);
      expect(response.data).toEqual(data);
      expect(response.dataList).toEqual(dataList);
      expect(response.timestamp).toBe(timestamp);
      expect(response.cacheTTL).toBe(cacheTTL);
    });

    it('should create an EndpointResponseDto with minimal fields', () => {
      // Arrange
      const code = 200;
      const resultMessage = 'SUCCESS';

      // Act
      const response = new EndpointResponseDto({
        code,
        resultMessage
      });

      // Assert
      expect(response.code).toBe(code);
      expect(response.resultMessage).toBe(resultMessage);
      expect(response.data).toBeUndefined();
      expect(response.dataList).toBeUndefined();
      expect(response.cacheTTL).toBe(0);
      expect(response.timestamp).toBeDefined();
      expect(typeof response.timestamp).toBe('number');
    });

    it('should use current timestamp when not provided', () => {
      // Arrange
      const code = 200;
      const resultMessage = 'SUCCESS';

      // Act
      const beforeCreation = Date.now();
      const response = new EndpointResponseDto({
        code,
        resultMessage
      });
      const afterCreation = Date.now();

      // Assert
      expect(response.timestamp).toBeGreaterThanOrEqual(beforeCreation);
      expect(response.timestamp).toBeLessThanOrEqual(afterCreation);
    });

    it('should default cacheTTL to 0 when not provided', () => {
      // Arrange
      const code = 200;
      const resultMessage = 'SUCCESS';

      // Act
      const response = new EndpointResponseDto({
        code,
        resultMessage
      });

      // Assert
      expect(response.cacheTTL).toBe(0);
    });

    it('should handle data without dataList', () => {
      // Arrange
      const code = 200;
      const resultMessage = 'SUCCESS';
      const data = { id: '123', name: 'Test User' };

      // Act
      const response = new EndpointResponseDto({
        code,
        resultMessage,
        data
      });

      // Assert
      expect(response.data).toEqual(data);
      expect(response.dataList).toBeUndefined();
    });

    it('should handle dataList without data', () => {
      // Arrange
      const code = 200;
      const resultMessage = 'SUCCESS';
      const dataList = [
        { id: '123', name: 'Test User 1' },
        { id: '456', name: 'Test User 2' }
      ];

      // Act
      const response = new EndpointResponseDto({
        code,
        resultMessage,
        dataList
      });

      // Assert
      expect(response.data).toBeUndefined();
      expect(response.dataList).toEqual(dataList);
    });

    it('should handle both data and dataList', () => {
      // Arrange
      const code = 200;
      const resultMessage = 'SUCCESS';
      const data = { id: '123', name: 'Test User' };
      const dataList = [
        { id: '123', name: 'Test User 1' },
        { id: '456', name: 'Test User 2' }
      ];

      // Act
      const response = new EndpointResponseDto({
        code,
        resultMessage,
        data,
        dataList
      });

      // Assert
      expect(response.data).toEqual(data);
      expect(response.dataList).toEqual(dataList);
    });
  });

  describe('generic type handling', () => {
    it('should handle string data type', () => {
      // Arrange
      const code = 200;
      const resultMessage = 'SUCCESS';
      const data = 'test string';

      // Act
      const response = new EndpointResponseDto<string>({
        code,
        resultMessage,
        data
      });

      // Assert
      expect(response.data).toBe(data);
      expect(typeof response.data).toBe('string');
    });

    it('should handle number data type', () => {
      // Arrange
      const code = 200;
      const resultMessage = 'SUCCESS';
      const data = 42;

      // Act
      const response = new EndpointResponseDto<number>({
        code,
        resultMessage,
        data
      });

      // Assert
      expect(response.data).toBe(data);
      expect(typeof response.data).toBe('number');
    });

    it('should handle array data type', () => {
      // Arrange
      const code = 200;
      const resultMessage = 'SUCCESS';
      const data = [1, 2, 3, 4, 5];

      // Act
      const response = new EndpointResponseDto<number[]>({
        code,
        resultMessage,
        data
      });

      // Assert
      expect(response.data).toEqual(data);
      expect(Array.isArray(response.data)).toBe(true);
    });

    it('should handle complex object data type', () => {
      // Arrange
      const code = 200;
      const resultMessage = 'SUCCESS';
      const data = {
        user: {
          id: '123',
          name: 'Test User',
          email: 'test@example.com',
          roles: ['user', 'admin']
        },
        metadata: {
          createdAt: new Date(),
          version: '1.0.0'
        }
      };

      // Act
      const response = new EndpointResponseDto<typeof data>({
        code,
        resultMessage,
        data
      });

      // Assert
      expect(response.data).toEqual(data);
      expect(response.data?.user.id).toBe('123');
      expect(response.data?.user.roles).toContain('admin');
    });
  });

  describe('serialization', () => {
    it('should serialize to JSON correctly', () => {
      // Arrange
      const timestamp = new Date('2024-01-01T00:00:00.000Z').getTime();
      const code = 200;
      const resultMessage = 'SUCCESS';
      const data = { id: '123', name: 'Test User' };
      const cacheTTL = 300;

      // Act
      const response = new EndpointResponseDto({
        code,
        resultMessage,
        data,
        timestamp,
        cacheTTL
      });
      const json = JSON.stringify(response);

      // Assert
      const expectedJson = JSON.stringify({
        code: 200,
        resultMessage: 'SUCCESS',
        data: { id: '123', name: 'Test User' },
        dataList: undefined,
        timestamp: timestamp,
        cacheTTL: 300
      });
      expect(json).toBe(expectedJson);
    });

    it('should serialize with dataList correctly', () => {
      // Arrange
      const code = 200;
      const resultMessage = 'SUCCESS';
      const dataList = [
        { id: '123', name: 'Test User 1' },
        { id: '456', name: 'Test User 2' }
      ];

      // Act
      const response = new EndpointResponseDto({
        code,
        resultMessage,
        dataList
      });
      const json = JSON.stringify(response);
      const parsed = JSON.parse(json);

      // Assert
      expect(parsed.code).toBe(code);
      expect(parsed.resultMessage).toBe(resultMessage);
      expect(parsed.dataList).toEqual(dataList);
      expect(parsed.data).toBeUndefined();
      expect(parsed.cacheTTL).toBe(0);
      expect(parsed.timestamp).toBeDefined();
    });

    it('should serialize with undefined fields correctly', () => {
      // Arrange
      const code = 200;
      const resultMessage = 'SUCCESS';

      // Act
      const response = new EndpointResponseDto({
        code,
        resultMessage
      });
      const json = JSON.stringify(response);
      const parsed = JSON.parse(json);

      // Assert
      expect(parsed.code).toBe(code);
      expect(parsed.resultMessage).toBe(resultMessage);
      expect(parsed.data).toBeUndefined();
      expect(parsed.dataList).toBeUndefined();
      expect(parsed.cacheTTL).toBe(0);
      expect(parsed.timestamp).toBeDefined();
    });
  });

  describe('HTTP status codes', () => {
    it('should handle various HTTP status codes', () => {
      const statusCodes = [200, 201, 204, 400, 401, 403, 404, 409, 422, 500];
      
      statusCodes.forEach(code => {
        const response = new EndpointResponseDto({
          code,
          resultMessage: `Status ${code}`
        });
        
        expect(response.code).toBe(code);
        expect(response.resultMessage).toBe(`Status ${code}`);
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty resultMessage', () => {
      // Arrange
      const code = 200;
      const resultMessage = '';

      // Act
      const response = new EndpointResponseDto({
        code,
        resultMessage
      });

      // Assert
      expect(response.code).toBe(code);
      expect(response.resultMessage).toBe('');
    });

    it('should handle null data', () => {
      // Arrange
      const code = 200;
      const resultMessage = 'SUCCESS';
      const data = null;

      // Act
      const response = new EndpointResponseDto({
        code,
        resultMessage,
        data: data as any
      });

      // Assert
      expect(response.data).toBeNull();
    });

    it('should handle empty dataList', () => {
      // Arrange
      const code = 200;
      const resultMessage = 'SUCCESS';
      const dataList: any[] = [];

      // Act
      const response = new EndpointResponseDto({
        code,
        resultMessage,
        dataList
      });

      // Assert
      expect(response.dataList).toEqual([]);
      expect(Array.isArray(response.dataList)).toBe(true);
    });

    it('should handle negative cache TTL', () => {
      // Arrange
      const code = 200;
      const resultMessage = 'SUCCESS';
      const cacheTTL = -1;

      // Act
      const response = new EndpointResponseDto({
        code,
        resultMessage,
        cacheTTL
      });

      // Assert
      expect(response.cacheTTL).toBe(-1);
    });

    it('should handle zero timestamp', () => {
      // Arrange
      const code = 200;
      const resultMessage = 'SUCCESS';
      const timestamp = 0;

      // Act
      const response = new EndpointResponseDto({
        code,
        resultMessage,
        timestamp
      });

      // Assert
      expect(response.timestamp).toBe(0);
    });

    it('should handle special characters in resultMessage', () => {
      // Arrange
      const code = 200;
      const resultMessage = 'Success with special chars: !@#$%^&*()_+-=[]{}|;\':",./<>?';

      // Act
      const response = new EndpointResponseDto({
        code,
        resultMessage
      });

      // Assert
      expect(response.resultMessage).toBe(resultMessage);
    });

    it('should handle unicode characters in data', () => {
      // Arrange
      const code = 200;
      const resultMessage = 'SUCCESS';
      const data = {
        message: 'Unicode: 测试中文 🚀 émojis',
        name: 'José María'
      };

      // Act
      const response = new EndpointResponseDto({
        code,
        resultMessage,
        data
      });

      // Assert
      expect(response.data).toEqual(data);
      expect(response.data?.message).toContain('测试中文');
      expect(response.data?.message).toContain('🚀');
    });
  });

  describe('integration scenarios', () => {
    it('should work with user creation response', () => {
      // Arrange
      const code = 201;
      const resultMessage = 'USER_CREATED';
      const data = {
        id: '507f1f77bcf86cd799439011',
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user',
        createdAt: new Date().toISOString()
      };

      // Act
      const response = new EndpointResponseDto({
        code,
        resultMessage,
        data
      });

      // Assert
      expect(response.code).toBe(201);
      expect(response.resultMessage).toBe('USER_CREATED');
      expect(response.data?.id).toBe('507f1f77bcf86cd799439011');
      expect(response.data?.name).toBe('John Doe');
    });

    it('should work with list response', () => {
      // Arrange
      const code = 200;
      const resultMessage = 'USERS_RETRIEVED';
      const dataList = [
        { id: '1', name: 'User 1', email: 'user1@example.com' },
        { id: '2', name: 'User 2', email: 'user2@example.com' },
        { id: '3', name: 'User 3', email: 'user3@example.com' }
      ];

      // Act
      const response = new EndpointResponseDto({
        code,
        resultMessage,
        dataList
      });

      // Assert
      expect(response.code).toBe(200);
      expect(response.resultMessage).toBe('USERS_RETRIEVED');
      expect(response.dataList).toHaveLength(3);
      expect(response.dataList?.[0].name).toBe('User 1');
    });

    it('should work with error response', () => {
      // Arrange
      const code = 400;
      const resultMessage = 'VALIDATION_ERROR';
      const data = {
        errors: [
          { field: 'email', message: 'Invalid email format' },
          { field: 'password', message: 'Password too short' }
        ]
      };

      // Act
      const response = new EndpointResponseDto({
        code,
        resultMessage,
        data
      });

      // Assert
      expect(response.code).toBe(400);
      expect(response.resultMessage).toBe('VALIDATION_ERROR');
      expect(response.data?.errors).toHaveLength(2);
      expect(response.data?.errors?.[0].field).toBe('email');
    });
  });
});
