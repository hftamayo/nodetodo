import { Request, Response } from "express";
import { dbConnection } from "@config/setup";
import {
  HealthCheckResponse,
  AppHealthDetails,
  DbHealthDetails,
} from "@/types/hc.types";
import os from "os";

const hcController = {
  appHealthCheck: async function (req: Request, res: Response) {
    const result: HealthCheckResponse<AppHealthDetails> = {
      code: res.statusCode,
      status: "pass",
      resultMessage: "Application is up and running",
      details: {
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memoryUsage: {
          total: os.totalmem(),
          free: os.freemem(),
        },
      },
    };
    res.status(200).json(result);
  },

  dbHealthCheck: async function (req: Request, res: Response) {
    const startTime = Date.now();
    try {
      await dbConnection();
      const queryTime = Date.now() - startTime;

      const result: HealthCheckResponse<DbHealthDetails> = {
        code: res.statusCode,
        status: queryTime < 100 ? "pass" : "warn",
        resultMessage: "Database connection successful",
        details: {
          timestamp: new Date().toISOString(),
          connectionTime: queryTime,
          databaseStatus: "connected",
        },
      };

      res.status(200).json(result);
    } catch (error: unknown) {
      const result: HealthCheckResponse<DbHealthDetails> = {
        code: res.statusCode,
        status: "fail",
        resultMessage: "Database connection failed",
        details: {
          timestamp: new Date().toISOString(),
          error: error instanceof Error ? error.message : String(error),
        },
      };

      res.status(500).json(result);
    }
  },
};

export default hcController;
