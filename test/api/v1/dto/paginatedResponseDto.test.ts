import { PaginatedResponseDTO, PaginationDTO } from '../../../../src/api/v1/dto/pagination/pagination.dto';

describe('PaginatedResponseDTO', () => {
  describe('constructor', () => {
    it('should create a PaginatedResponseDTO with all fields', () => {
      // Arrange
      const data = [
        { id: '1', name: 'Item 1' },
        { id: '2', name: 'Item 2' },
        { id: '3', name: 'Item 3' }
      ];
      const pagination = new PaginationDTO({
        nextCursor: 'eyJpZCI6IjQiLCJzb3J0IjoiY3JlYXRlZEF0Iiwib3JkZXIiOiJkZXNjIn0=',
        prevCursor: 'eyJpZCI6IjAiLCJzb3J0IjoiY3JlYXRlZEF0Iiwib3JkZXIiOiJkZXNjIn0=',
        limit: 3,
        totalCount: 10,
        hasMore: true,
        currentPage: 2,
        totalPages: 4,
        order: 'desc',
        hasPrev: true,
        isFirstPage: false,
        isLastPage: false
      });
      const etag = 'W/"abc123def456"';
      const lastModified = '2024-01-01T12:00:00.000Z';

      // Act
      const response = new PaginatedResponseDTO({
        data,
        pagination,
        etag,
        lastModified
      });

      // Assert
      expect(response.data).toEqual(data);
      expect(response.pagination).toEqual(pagination);
      expect(response.etag).toBe(etag);
      expect(response.lastModified).toBe(lastModified);
    });

    it('should create a PaginatedResponseDTO with minimal fields', () => {
      // Arrange
      const data = [
        { id: '1', name: 'Item 1' }
      ];
      const pagination = new PaginationDTO({
        limit: 1,
        totalCount: 1,
        hasMore: false,
        currentPage: 1,
        totalPages: 1,
        order: 'desc',
        hasPrev: false,
        isFirstPage: true,
        isLastPage: true
      });

      // Act
      const response = new PaginatedResponseDTO({
        data,
        pagination
      });

      // Assert
      expect(response.data).toEqual(data);
      expect(response.pagination).toEqual(pagination);
      expect(response.etag).toBeUndefined();
      expect(response.lastModified).toBeUndefined();
    });

    it('should handle empty data array', () => {
      // Arrange
      const data: any[] = [];
      const pagination = new PaginationDTO({
        limit: 10,
        totalCount: 0,
        hasMore: false,
        currentPage: 1,
        totalPages: 0,
        order: 'desc',
        hasPrev: false,
        isFirstPage: true,
        isLastPage: true
      });

      // Act
      const response = new PaginatedResponseDTO({
        data,
        pagination
      });

      // Assert
      expect(response.data).toEqual([]);
      expect(response.pagination.totalCount).toBe(0);
      expect(response.pagination.totalPages).toBe(0);
      expect(response.pagination.isFirstPage).toBe(true);
      expect(response.pagination.isLastPage).toBe(true);
    });

    it('should handle large data array', () => {
      // Arrange
      const data = Array.from({ length: 100 }, (_, i) => ({
        id: `${i + 1}`,
        name: `Item ${i + 1}`,
        value: i * 10
      }));
      const pagination = new PaginationDTO({
        nextCursor: 'eyJpZCI6IjEwMSIsInNvcnQiOiJjcmVhdGVkQXQiLCJvcmRlciI6ImRlc2MifQ==',
        limit: 100,
        totalCount: 1000,
        hasMore: true,
        currentPage: 1,
        totalPages: 10,
        order: 'desc',
        hasPrev: false,
        isFirstPage: true,
        isLastPage: false
      });

      // Act
      const response = new PaginatedResponseDTO({
        data,
        pagination
      });

      // Assert
      expect(response.data).toHaveLength(100);
      expect(response.data[0].id).toBe('1');
      expect(response.data[99].id).toBe('100');
      expect(response.pagination.totalCount).toBe(1000);
      expect(response.pagination.totalPages).toBe(10);
    });
  });

  describe('generic type handling', () => {
    it('should handle string data type', () => {
      // Arrange
      const data = ['item1', 'item2', 'item3'];
      const pagination = new PaginationDTO({
        limit: 3,
        totalCount: 3,
        hasMore: false,
        currentPage: 1,
        totalPages: 1,
        order: 'desc',
        hasPrev: false,
        isFirstPage: true,
        isLastPage: true
      });

      // Act
      const response = new PaginatedResponseDTO<string>({
        data,
        pagination
      });

      // Assert
      expect(response.data).toEqual(data);
      expect(response.data[0]).toBe('item1');
      expect(typeof response.data[0]).toBe('string');
    });

    it('should handle number data type', () => {
      // Arrange
      const data = [1, 2, 3, 4, 5];
      const pagination = new PaginationDTO({
        limit: 5,
        totalCount: 5,
        hasMore: false,
        currentPage: 1,
        totalPages: 1,
        order: 'desc',
        hasPrev: false,
        isFirstPage: true,
        isLastPage: true
      });

      // Act
      const response = new PaginatedResponseDTO<number>({
        data,
        pagination
      });

      // Assert
      expect(response.data).toEqual(data);
      expect(response.data[0]).toBe(1);
      expect(typeof response.data[0]).toBe('number');
    });

    it('should handle complex object data type', () => {
      // Arrange
      const data = [
        {
          id: '1',
          name: 'User 1',
          email: 'user1@example.com',
          profile: {
            age: 25,
            city: 'New York',
            preferences: {
              theme: 'dark',
              notifications: true
            }
          }
        },
        {
          id: '2',
          name: 'User 2',
          email: 'user2@example.com',
          profile: {
            age: 30,
            city: 'Los Angeles',
            preferences: {
              theme: 'light',
              notifications: false
            }
          }
        }
      ];
      const pagination = new PaginationDTO({
        limit: 2,
        totalCount: 2,
        hasMore: false,
        currentPage: 1,
        totalPages: 1,
        order: 'desc',
        hasPrev: false,
        isFirstPage: true,
        isLastPage: true
      });

      // Act
      const response = new PaginatedResponseDTO<typeof data[0]>({
        data,
        pagination
      });

      // Assert
      expect(response.data).toEqual(data);
      expect(response.data[0].profile.age).toBe(25);
      expect(response.data[0].profile.preferences.theme).toBe('dark');
      expect(response.data[1].profile.city).toBe('Los Angeles');
    });
  });

  describe('serialization', () => {
    it('should serialize to JSON correctly', () => {
      // Arrange
      const data = [
        { id: '1', name: 'Item 1' },
        { id: '2', name: 'Item 2' }
      ];
      const pagination = new PaginationDTO({
        nextCursor: 'eyJpZCI6IjMiLCJzb3J0IjoiY3JlYXRlZEF0Iiwib3JkZXIiOiJkZXNjIn0=',
        limit: 2,
        totalCount: 10,
        hasMore: true,
        currentPage: 1,
        totalPages: 5,
        order: 'desc',
        hasPrev: false,
        isFirstPage: true,
        isLastPage: false
      });
      const etag = 'W/"abc123def456"';
      const lastModified = '2024-01-01T12:00:00.000Z';

      // Act
      const response = new PaginatedResponseDTO({
        data,
        pagination,
        etag,
        lastModified
      });
      const json = JSON.stringify(response);

      // Assert
      const expectedJson = JSON.stringify({
        data: [
          { id: '1', name: 'Item 1' },
          { id: '2', name: 'Item 2' }
        ],
        pagination: {
          nextCursor: 'eyJpZCI6IjMiLCJzb3J0IjoiY3JlYXRlZEF0Iiwib3JkZXIiOiJkZXNjIn0=',
          prevCursor: undefined,
          limit: 2,
          totalCount: 10,
          hasMore: true,
          currentPage: 1,
          totalPages: 5,
          order: 'desc',
          hasPrev: false,
          isFirstPage: true,
          isLastPage: false
        },
        etag: 'W/"abc123def456"',
        lastModified: '2024-01-01T12:00:00.000Z'
      });
      expect(json).toBe(expectedJson);
    });

    it('should serialize without optional fields correctly', () => {
      // Arrange
      const data = [{ id: '1', name: 'Item 1' }];
      const pagination = new PaginationDTO({
        limit: 1,
        totalCount: 1,
        hasMore: false,
        currentPage: 1,
        totalPages: 1,
        order: 'desc',
        hasPrev: false,
        isFirstPage: true,
        isLastPage: true
      });

      // Act
      const response = new PaginatedResponseDTO({
        data,
        pagination
      });
      const json = JSON.stringify(response);
      const parsed = JSON.parse(json);

      // Assert
      expect(parsed.data).toEqual([{ id: '1', name: 'Item 1' }]);
      expect(parsed.pagination).toBeDefined();
      expect(parsed.etag).toBeUndefined();
      expect(parsed.lastModified).toBeUndefined();
    });
  });

  describe('edge cases', () => {
    it('should handle null data', () => {
      // Arrange
      const data = null as any;
      const pagination = new PaginationDTO({
        limit: 0,
        totalCount: 0,
        hasMore: false,
        currentPage: 1,
        totalPages: 0,
        order: 'desc',
        hasPrev: false,
        isFirstPage: true,
        isLastPage: true
      });

      // Act
      const response = new PaginatedResponseDTO({
        data,
        pagination
      });

      // Assert
      expect(response.data).toBeNull();
    });

    it('should handle undefined etag and lastModified', () => {
      // Arrange
      const data = [{ id: '1', name: 'Item 1' }];
      const pagination = new PaginationDTO({
        limit: 1,
        totalCount: 1,
        hasMore: false,
        currentPage: 1,
        totalPages: 1,
        order: 'desc',
        hasPrev: false,
        isFirstPage: true,
        isLastPage: true
      });

      // Act
      const response = new PaginatedResponseDTO({
        data,
        pagination,
        etag: undefined,
        lastModified: undefined
      });

      // Assert
      expect(response.etag).toBeUndefined();
      expect(response.lastModified).toBeUndefined();
    });

    it('should handle empty string etag and lastModified', () => {
      // Arrange
      const data = [{ id: '1', name: 'Item 1' }];
      const pagination = new PaginationDTO({
        limit: 1,
        totalCount: 1,
        hasMore: false,
        currentPage: 1,
        totalPages: 1,
        order: 'desc',
        hasPrev: false,
        isFirstPage: true,
        isLastPage: true
      });

      // Act
      const response = new PaginatedResponseDTO({
        data,
        pagination,
        etag: '',
        lastModified: ''
      });

      // Assert
      expect(response.etag).toBe('');
      expect(response.lastModified).toBe('');
    });

    it('should handle special characters in data', () => {
      // Arrange
      const data = [
        { id: '1', name: 'José María', description: 'Unicode: 测试中文 🚀 émojis' },
        { id: '2', name: 'Special chars: !@#$%^&*()', description: 'Normal description' }
      ];
      const pagination = new PaginationDTO({
        limit: 2,
        totalCount: 2,
        hasMore: false,
        currentPage: 1,
        totalPages: 1,
        order: 'desc',
        hasPrev: false,
        isFirstPage: true,
        isLastPage: true
      });

      // Act
      const response = new PaginatedResponseDTO({
        data,
        pagination
      });

      // Assert
      expect(response.data[0].name).toBe('José María');
      expect(response.data[0].description).toContain('测试中文');
      expect(response.data[0].description).toContain('🚀');
      expect(response.data[1].name).toContain('!@#$%^&*()');
    });
  });

  describe('integration scenarios', () => {
    it('should work with user list response', () => {
      // Arrange
      const data = [
        {
          id: '507f1f77bcf86cd799439011',
          name: 'John Doe',
          email: 'john@example.com',
          role: 'user',
          status: true
        },
        {
          id: '507f1f77bcf86cd799439012',
          name: 'Jane Smith',
          email: 'jane@example.com',
          role: 'admin',
          status: true
        }
      ];
      const pagination = new PaginationDTO({
        nextCursor: 'eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMyIsInNvcnQiOiJuYW1lIiwib3JkZXIiOiJhc2MifQ==',
        limit: 2,
        totalCount: 50,
        hasMore: true,
        currentPage: 1,
        totalPages: 25,
        order: 'asc',
        hasPrev: false,
        isFirstPage: true,
        isLastPage: false
      });
      const etag = 'W/"users-abc123def456"';
      const lastModified = '2024-01-01T12:00:00.000Z';

      // Act
      const response = new PaginatedResponseDTO({
        data,
        pagination,
        etag,
        lastModified
      });

      // Assert
      expect(response.data).toHaveLength(2);
      expect(response.data[0].name).toBe('John Doe');
      expect(response.data[1].name).toBe('Jane Smith');
      expect(response.pagination.totalCount).toBe(50);
      expect(response.pagination.totalPages).toBe(25);
      expect(response.etag).toBe('W/"users-abc123def456"');
      expect(response.lastModified).toBe('2024-01-01T12:00:00.000Z');
    });

    it('should work with todo list response', () => {
      // Arrange
      const data = [
        {
          id: '507f1f77bcf86cd799439013',
          title: 'Complete project',
          description: 'Finish the Node.js todo application',
          completed: false,
          userId: '507f1f77bcf86cd799439011',
          priority: 'high'
        },
        {
          id: '507f1f77bcf86cd799439014',
          title: 'Review code',
          description: 'Review the latest changes',
          completed: true,
          userId: '507f1f77bcf86cd799439011',
          priority: 'medium'
        }
      ];
      const pagination = new PaginationDTO({
        prevCursor: 'eyJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMiIsInNvcnQiOiJjcmVhdGVkQXQiLCJvcmRlciI6ImRlc2MifQ==',
        limit: 2,
        totalCount: 100,
        hasMore: true,
        currentPage: 5,
        totalPages: 50,
        order: 'desc',
        hasPrev: true,
        isFirstPage: false,
        isLastPage: false
      });

      // Act
      const response = new PaginatedResponseDTO({
        data,
        pagination
      });

      // Assert
      expect(response.data).toHaveLength(2);
      expect(response.data[0].title).toBe('Complete project');
      expect(response.data[1].title).toBe('Review code');
      expect(response.pagination.currentPage).toBe(5);
      expect(response.pagination.totalPages).toBe(50);
      expect(response.pagination.hasPrev).toBe(true);
      expect(response.pagination.hasMore).toBe(true);
    });

    it('should work with role list response', () => {
      // Arrange
      const data = [
        {
          id: '507f1f77bcf86cd799439015',
          name: 'admin',
          description: 'Administrator role',
          status: true,
          permissions: new Map([['users', 15], ['roles', 15]])
        },
        {
          id: '507f1f77bcf86cd799439016',
          name: 'user',
          description: 'Regular user role',
          status: true,
          permissions: new Map([['users', 1], ['todos', 7]])
        }
      ];
      const pagination = new PaginationDTO({
        limit: 2,
        totalCount: 2,
        hasMore: false,
        currentPage: 1,
        totalPages: 1,
        order: 'asc',
        hasPrev: false,
        isFirstPage: true,
        isLastPage: true
      });

      // Act
      const response = new PaginatedResponseDTO({
        data,
        pagination
      });

      // Assert
      expect(response.data).toHaveLength(2);
      expect(response.data[0].name).toBe('admin');
      expect(response.data[1].name).toBe('user');
      expect(response.pagination.totalCount).toBe(2);
      expect(response.pagination.totalPages).toBe(1);
      expect(response.pagination.isFirstPage).toBe(true);
      expect(response.pagination.isLastPage).toBe(true);
    });

    it('should work with last page response', () => {
      // Arrange
      const data = [
        { id: '98', name: 'Item 98' },
        { id: '99', name: 'Item 99' },
        { id: '100', name: 'Item 100' }
      ];
      const pagination = new PaginationDTO({
        prevCursor: 'eyJpZCI6Ijk3Iiwic29ydCI6ImNyZWF0ZWRBdCIsIm9yZGVyIjoiZGVzYyJ9',
        limit: 3,
        totalCount: 100,
        hasMore: false,
        currentPage: 34,
        totalPages: 34,
        order: 'desc',
        hasPrev: true,
        isFirstPage: false,
        isLastPage: true
      });

      // Act
      const response = new PaginatedResponseDTO({
        data,
        pagination
      });

      // Assert
      expect(response.data).toHaveLength(3);
      expect(response.data[0].id).toBe('98');
      expect(response.data[2].id).toBe('100');
      expect(response.pagination.currentPage).toBe(34);
      expect(response.pagination.totalPages).toBe(34);
      expect(response.pagination.hasPrev).toBe(true);
      expect(response.pagination.hasMore).toBe(false);
      expect(response.pagination.isFirstPage).toBe(false);
      expect(response.pagination.isLastPage).toBe(true);
    });
  });
});
