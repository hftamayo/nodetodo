import { AppHealthCheckResponseDTO, DbHealthCheckResponseDTO } from '../../../../src/api/v1/dto/hc/healthCheckResponse.dto';

describe('Health Check Response DTOs', () => {
  describe('AppHealthCheckResponseDTO', () => {
    describe('constructor', () => {
      it('should create an AppHealthCheckResponseDTO with all fields', () => {
        // Arrange
        const code = 200;
        const status = 'pass' as const;
        const resultMessage = 'Application is healthy';
        const details = {
          timestamp: '2024-01-01T00:00:00.000Z',
          uptime: 3600,
          memoryUsage: {
            total: 2048,
            free: 1024
          }
        };

        // Act
        const response = new AppHealthCheckResponseDTO({
          code,
          status,
          resultMessage,
          details
        });

        // Assert
        expect(response.code).toBe(code);
        expect(response.status).toBe(status);
        expect(response.resultMessage).toBe(resultMessage);
        expect(response.details).toEqual(details);
      });

      it('should create an AppHealthCheckResponseDTO without details', () => {
        // Arrange
        const code = 200;
        const status = 'pass' as const;
        const resultMessage = 'Application is healthy';

        // Act
        const response = new AppHealthCheckResponseDTO({
          code,
          status,
          resultMessage
        });

        // Assert
        expect(response.code).toBe(code);
        expect(response.status).toBe(status);
        expect(response.resultMessage).toBe(resultMessage);
        expect(response.details).toBeUndefined();
      });

      it('should handle warn status', () => {
        // Arrange
        const code = 200;
        const status = 'warn' as const;
        const resultMessage = 'Application has warnings';
        const details = {
          timestamp: '2024-01-01T00:00:00.000Z',
          uptime: 3600,
          memoryUsage: {
            total: 2048,
            free: 248
          }
        };

        // Act
        const response = new AppHealthCheckResponseDTO({
          code,
          status,
          resultMessage,
          details
        });

        // Assert
        expect(response.status).toBe('warn');
        expect(response.details?.memoryUsage.free).toBe(248);
      });

      it('should handle fail status', () => {
        // Arrange
        const code = 503;
        const status = 'fail' as const;
        const resultMessage = 'Application is unhealthy';
        const details = {
          timestamp: '2024-01-01T00:00:00.000Z',
          uptime: 3600,
          memoryUsage: {
            total: 2048,
            free: 48
          }
        };

        // Act
        const response = new AppHealthCheckResponseDTO({
          code,
          status,
          resultMessage,
          details
        });

        // Assert
        expect(response.status).toBe('fail');
        expect(response.code).toBe(503);
        expect(response.details?.memoryUsage.free).toBe(48);
      });
    });

    describe('serialization', () => {
      it('should serialize to JSON correctly', () => {
        // Arrange
        const code = 200;
        const status = 'pass' as const;
        const resultMessage = 'Application is healthy';
        const details = {
          timestamp: '2024-01-01T00:00:00.000Z',
          uptime: 3600,
          memoryUsage: { total: 2048, free: 1024 }
        };

        // Act
        const response = new AppHealthCheckResponseDTO({
          code,
          status,
          resultMessage,
          details
        });
        const json = JSON.stringify(response);

        // Assert
        const expectedJson = JSON.stringify({
          code: 200,
          status: 'pass',
          resultMessage: 'Application is healthy',
          details: {
            timestamp: '2024-01-01T00:00:00.000Z',
            uptime: 3600,
            memoryUsage: { total: 2048, free: 1024 }
          }
        });
        expect(json).toBe(expectedJson);
      });

      it('should serialize without details correctly', () => {
        // Arrange
        const code = 200;
        const status = 'pass' as const;
        const resultMessage = 'Application is healthy';

        // Act
        const response = new AppHealthCheckResponseDTO({
          code,
          status,
          resultMessage
        });
        const json = JSON.stringify(response);
        const parsed = JSON.parse(json);

        // Assert
        expect(parsed.code).toBe(code);
        expect(parsed.status).toBe(status);
        expect(parsed.resultMessage).toBe(resultMessage);
        expect(parsed.details).toBeUndefined();
      });
    });
  });

  describe('DbHealthCheckResponseDTO', () => {
    describe('constructor', () => {
      it('should create a DbHealthCheckResponseDTO with all fields', () => {
        // Arrange
        const code = 200;
        const status = 'pass' as const;
        const resultMessage = 'Database is healthy';
        const details = {
          timestamp: '2024-01-01T00:00:00.000Z',
          connectionTime: 15,
          databaseStatus: 'connected'
        };

        // Act
        const response = new DbHealthCheckResponseDTO({
          code,
          status,
          resultMessage,
          details
        });

        // Assert
        expect(response.code).toBe(code);
        expect(response.status).toBe(status);
        expect(response.resultMessage).toBe(resultMessage);
        expect(response.details).toEqual(details);
      });

      it('should create a DbHealthCheckResponseDTO without details', () => {
        // Arrange
        const code = 200;
        const status = 'pass' as const;
        const resultMessage = 'Database is healthy';

        // Act
        const response = new DbHealthCheckResponseDTO({
          code,
          status,
          resultMessage
        });

        // Assert
        expect(response.code).toBe(code);
        expect(response.status).toBe(status);
        expect(response.resultMessage).toBe(resultMessage);
        expect(response.details).toBeUndefined();
      });

      it('should handle warn status', () => {
        // Arrange
        const code = 200;
        const status = 'warn' as const;
        const resultMessage = 'Database has warnings';
        const details = {
          timestamp: '2024-01-01T00:00:00.000Z',
          connectionTime: 500,
          databaseStatus: 'connected'
        };

        // Act
        const response = new DbHealthCheckResponseDTO({
          code,
          status,
          resultMessage,
          details
        });

        // Assert
        expect(response.status).toBe('warn');
        expect(response.details?.connectionTime).toBe(500);
      });

      it('should handle fail status', () => {
        // Arrange
        const code = 503;
        const status = 'fail' as const;
        const resultMessage = 'Database is unhealthy';
        const details = {
          timestamp: '2024-01-01T00:00:00.000Z',
          connectionTime: undefined,
          databaseStatus: 'disconnected',
          error: 'Connection timeout'
        };

        // Act
        const response = new DbHealthCheckResponseDTO({
          code,
          status,
          resultMessage,
          details
        });

        // Assert
        expect(response.status).toBe('fail');
        expect(response.code).toBe(503);
        expect(response.details?.databaseStatus).toBe('disconnected');
        expect(response.details?.error).toBe('Connection timeout');
      });
    });

    describe('serialization', () => {
      it('should serialize to JSON correctly', () => {
        // Arrange
        const code = 200;
        const status = 'pass' as const;
        const resultMessage = 'Database is healthy';
        const details = {
          timestamp: '2024-01-01T00:00:00.000Z',
          connectionTime: 15,
          databaseStatus: 'connected'
        };

        // Act
        const response = new DbHealthCheckResponseDTO({
          code,
          status,
          resultMessage,
          details
        });
        const json = JSON.stringify(response);

        // Assert
        const expectedJson = JSON.stringify({
          code: 200,
          status: 'pass',
          resultMessage: 'Database is healthy',
          details: {
            timestamp: '2024-01-01T00:00:00.000Z',
            connectionTime: 15,
            databaseStatus: 'connected'
          }
        });
        expect(json).toBe(expectedJson);
      });

      it('should serialize without details correctly', () => {
        // Arrange
        const code = 200;
        const status = 'pass' as const;
        const resultMessage = 'Database is healthy';

        // Act
        const response = new DbHealthCheckResponseDTO({
          code,
          status,
          resultMessage
        });
        const json = JSON.stringify(response);
        const parsed = JSON.parse(json);

        // Assert
        expect(parsed.code).toBe(code);
        expect(parsed.status).toBe(status);
        expect(parsed.resultMessage).toBe(resultMessage);
        expect(parsed.details).toBeUndefined();
      });
    });
  });

  describe('status validation', () => {
    it('should accept valid status values', () => {
      const validStatuses = ['pass', 'warn', 'fail'] as const;
      
      validStatuses.forEach(status => {
        const appResponse = new AppHealthCheckResponseDTO({
          code: 200,
          status,
          resultMessage: `Status: ${status}`
        });
        
        const dbResponse = new DbHealthCheckResponseDTO({
          code: 200,
          status,
          resultMessage: `Status: ${status}`
        });
        
        expect(appResponse.status).toBe(status);
        expect(dbResponse.status).toBe(status);
      });
    });
  });

  describe('HTTP status codes', () => {
    it('should handle various HTTP status codes', () => {
      const statusCodes = [200, 503];
      
      statusCodes.forEach(code => {
        const appResponse = new AppHealthCheckResponseDTO({
          code,
          status: 'pass' as const,
          resultMessage: `Status ${code}`
        });
        
        const dbResponse = new DbHealthCheckResponseDTO({
          code,
          status: 'pass' as const,
          resultMessage: `Status ${code}`
        });
        
        expect(appResponse.code).toBe(code);
        expect(dbResponse.code).toBe(code);
      });
    });
  });

  describe('edge cases', () => {
    it('should handle empty resultMessage', () => {
      // Arrange
      const code = 200;
      const status = 'pass' as const;
      const resultMessage = '';

      // Act
      const response = new AppHealthCheckResponseDTO({
        code,
        status,
        resultMessage
      });

      // Assert
      expect(response.resultMessage).toBe('');
    });

    it('should handle null details', () => {
      // Arrange
      const code = 200;
      const status = 'pass' as const;
      const resultMessage = 'Healthy';
      const details = null;

      // Act
      const response = new AppHealthCheckResponseDTO({
        code,
        status,
        resultMessage,
        details: details as any
      });

      // Assert
      expect(response.details).toBeNull();
    });

    it('should handle special characters in resultMessage', () => {
      // Arrange
      const code = 200;
      const status = 'warn' as const;
      const resultMessage = 'Warning: High usage detected! @#$%^&*()';

      // Act
      const response = new AppHealthCheckResponseDTO({
        code,
        status,
        resultMessage
      });

      // Assert
      expect(response.resultMessage).toBe(resultMessage);
    });

    it('should handle unicode characters in resultMessage', () => {
      // Arrange
      const code = 200;
      const status = 'pass' as const;
      const resultMessage = 'Unicode: 测试中文 🚀 émojis';

      // Act
      const response = new AppHealthCheckResponseDTO({
        code,
        status,
        resultMessage
      });

      // Assert
      expect(response.resultMessage).toContain('测试中文');
      expect(response.resultMessage).toContain('🚀');
    });
  });

  describe('integration scenarios', () => {
    it('should work with application health check', () => {
      // Arrange
      const code = 200;
      const status = 'pass' as const;
      const resultMessage = 'Application is healthy';
      const details = {
        timestamp: '2024-01-01T00:00:00.000Z',
        uptime: 86400,
        memoryUsage: {
          total: 1024,
          free: 512
        }
      };

      // Act
      const response = new AppHealthCheckResponseDTO({
        code,
        status,
        resultMessage,
        details
      });

      // Assert
      expect(response.code).toBe(200);
      expect(response.status).toBe('pass');
      expect(response.details?.uptime).toBe(86400);
      expect(response.details?.memoryUsage.free).toBe(512);
    });

    it('should work with database health check', () => {
      // Arrange
      const code = 200;
      const status = 'pass' as const;
      const resultMessage = 'Database is healthy';
      const details = {
        timestamp: '2024-01-01T00:00:00.000Z',
        connectionTime: 12,
        databaseStatus: 'connected'
      };

      // Act
      const response = new DbHealthCheckResponseDTO({
        code,
        status,
        resultMessage,
        details
      });

      // Assert
      expect(response.code).toBe(200);
      expect(response.status).toBe('pass');
      expect(response.details?.databaseStatus).toBe('connected');
      expect(response.details?.connectionTime).toBe(12);
    });

    it('should work with degraded health status', () => {
      // Arrange
      const code = 200;
      const status = 'warn' as const;
      const resultMessage = 'System is degraded';
      const details = {
        timestamp: '2024-01-01T00:00:00.000Z',
        uptime: 3600,
        memoryUsage: {
          total: 1024,
          free: 124
        }
      };

      // Act
      const response = new AppHealthCheckResponseDTO({
        code,
        status,
        resultMessage,
        details
      });

      // Assert
      expect(response.status).toBe('warn');
      expect(response.details?.memoryUsage.free).toBe(124);
    });

    it('should work with failed health status', () => {
      // Arrange
      const code = 503;
      const status = 'fail' as const;
      const resultMessage = 'System is unhealthy';
      const details = {
        timestamp: '2024-01-01T00:00:00.000Z',
        connectionTime: undefined,
        databaseStatus: 'disconnected',
        error: 'Connection timeout after 30 seconds'
      };

      // Act
      const response = new DbHealthCheckResponseDTO({
        code,
        status,
        resultMessage,
        details
      });

      // Assert
      expect(response.code).toBe(503);
      expect(response.status).toBe('fail');
      expect(response.details?.databaseStatus).toBe('disconnected');
      expect(response.details?.connectionTime).toBeUndefined();
      expect(response.details?.error).toBe('Connection timeout after 30 seconds');
    });
  });
});
