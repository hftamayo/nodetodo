export type HealthCheckResponse = {
  status: "pass" | "warn" | "fail";
  message: string;
  details?: any;
};
