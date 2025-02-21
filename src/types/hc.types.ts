export type AppHealthDetails = {
  timestamp: string;
  uptime: number;
  memoryUsage: {
    total: number;
    free: number;
  };
};

export type DbHealthDetails = {
  timestamp: string;
  connectionTime?: number;
  databaseStatus?: string;
  error?: string;
};

export type HealthCheckResponse<T> = {
  code: number;
  status: "pass" | "warn" | "fail";
  resultMessage: string;
  details?: T;
};
