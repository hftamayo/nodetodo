import { AppHealthDetails, DbHealthDetails } from "@/types/hc.types";
import { AppHealthCheckResponseDTO, DbHealthCheckResponseDTO } from "@/api/v1/dto/hc/healthCheckResponse.dto";

// Health Check Details Mocks
export const mockAppHealthDetails: AppHealthDetails = {
  timestamp: "2024-01-01T12:00:00.000Z",
  uptime: 3600, // 1 hour
  memoryUsage: {
    total: 1024 * 1024 * 1024, // 1GB
    free: 512 * 1024 * 1024,   // 512MB
  },
};

export const mockAppHealthDetailsHighMemory: AppHealthDetails = {
  timestamp: "2024-01-01T12:00:00.000Z",
  uptime: 7200, // 2 hours
  memoryUsage: {
    total: 2048 * 1024 * 1024, // 2GB
    free: 1024 * 1024 * 1024,  // 1GB
  },
};

export const mockAppHealthDetailsLowMemory: AppHealthDetails = {
  timestamp: "2024-01-01T12:00:00.000Z",
  uptime: 1800, // 30 minutes
  memoryUsage: {
    total: 1024 * 1024 * 1024, // 1GB
    free: 100 * 1024 * 1024,   // 100MB (low memory)
  },
};

export const mockDbHealthDetails: DbHealthDetails = {
  timestamp: "2024-01-01T12:00:00.000Z",
  connectionTime: 15, // 15ms
  databaseStatus: "connected",
};

export const mockDbHealthDetailsSlow: DbHealthDetails = {
  timestamp: "2024-01-01T12:00:00.000Z",
  connectionTime: 5000, // 5 seconds (slow)
  databaseStatus: "connected",
};

export const mockDbHealthDetailsError: DbHealthDetails = {
  timestamp: "2024-01-01T12:00:00.000Z",
  error: "Connection timeout after 30 seconds",
};

export const mockDbHealthDetailsDisconnected: DbHealthDetails = {
  timestamp: "2024-01-01T12:00:00.000Z",
  databaseStatus: "disconnected",
  error: "No active connection to database",
};

// Health Check Response DTO Mocks
export const mockAppHealthCheckResponseDTO = new AppHealthCheckResponseDTO({
  code: 200,
  status: "pass",
  resultMessage: "APPLICATION_HEALTHY",
  details: mockAppHealthDetails,
});

export const mockAppHealthCheckResponseDTOHighMemory = new AppHealthCheckResponseDTO({
  code: 200,
  status: "pass",
  resultMessage: "APPLICATION_HEALTHY",
  details: mockAppHealthDetailsHighMemory,
});

export const mockAppHealthCheckResponseDTOLowMemory = new AppHealthCheckResponseDTO({
  code: 200,
  status: "warn",
  resultMessage: "APPLICATION_LOW_MEMORY",
  details: mockAppHealthDetailsLowMemory,
});

export const mockAppHealthCheckResponseDTOFail = new AppHealthCheckResponseDTO({
  code: 503,
  status: "fail",
  resultMessage: "APPLICATION_UNHEALTHY",
  details: {
    timestamp: "2024-01-01T12:00:00.000Z",
    uptime: 0,
    memoryUsage: {
      total: 0,
      free: 0,
    },
  },
});

export const mockDbHealthCheckResponseDTO = new DbHealthCheckResponseDTO({
  code: 200,
  status: "pass",
  resultMessage: "DATABASE_HEALTHY",
  details: mockDbHealthDetails,
});

export const mockDbHealthCheckResponseDTOSlow = new DbHealthCheckResponseDTO({
  code: 200,
  status: "warn",
  resultMessage: "DATABASE_SLOW_RESPONSE",
  details: mockDbHealthDetailsSlow,
});

export const mockDbHealthCheckResponseDTOError = new DbHealthCheckResponseDTO({
  code: 503,
  status: "fail",
  resultMessage: "DATABASE_UNHEALTHY",
  details: mockDbHealthDetailsError,
});

export const mockDbHealthCheckResponseDTODisconnected = new DbHealthCheckResponseDTO({
  code: 503,
  status: "fail",
  resultMessage: "DATABASE_DISCONNECTED",
  details: mockDbHealthDetailsDisconnected,
});

// Combined Health Check Scenarios
export const mockHealthySystem = {
  app: mockAppHealthCheckResponseDTO,
  db: mockDbHealthCheckResponseDTO,
};

export const mockWarningSystem = {
  app: mockAppHealthCheckResponseDTOLowMemory,
  db: mockDbHealthCheckResponseDTOSlow,
};

export const mockFailingSystem = {
  app: mockAppHealthCheckResponseDTOFail,
  db: mockDbHealthCheckResponseDTOError,
};

export const mockMixedSystem = {
  app: mockAppHealthCheckResponseDTO,
  db: mockDbHealthCheckResponseDTODisconnected,
};

// Health Check Test Data for Different Scenarios
export const healthCheckScenarios = {
  healthy: {
    app: {
      code: 200,
      status: "pass" as const,
      resultMessage: "APPLICATION_HEALTHY",
      details: mockAppHealthDetails,
    },
    db: {
      code: 200,
      status: "pass" as const,
      resultMessage: "DATABASE_HEALTHY",
      details: mockDbHealthDetails,
    },
  },
  warning: {
    app: {
      code: 200,
      status: "warn" as const,
      resultMessage: "APPLICATION_LOW_MEMORY",
      details: mockAppHealthDetailsLowMemory,
    },
    db: {
      code: 200,
      status: "warn" as const,
      resultMessage: "DATABASE_SLOW_RESPONSE",
      details: mockDbHealthDetailsSlow,
    },
  },
  failing: {
    app: {
      code: 503,
      status: "fail" as const,
      resultMessage: "APPLICATION_UNHEALTHY",
      details: {
        timestamp: "2024-01-01T12:00:00.000Z",
        uptime: 0,
        memoryUsage: { total: 0, free: 0 },
      },
    },
    db: {
      code: 503,
      status: "fail" as const,
      resultMessage: "DATABASE_UNHEALTHY",
      details: mockDbHealthDetailsError,
    },
  },
};
