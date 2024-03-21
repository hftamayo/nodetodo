import express from "express";

const router = express.Router();
import { dbConnection } from "../../config/setup";

router.get("/app", (req, res) => {
  res.status(200).json({
    message: "HealthCheck: Application is up and running",
    timestamp: new Date().toISOString(),
  });
});

router.get("/db", async (req, res) => {
  try {
    await dbConnection();
    res.status(200).json({
      message:
        "HealthCheck: The connection to the data layer is up and running",
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    res.status(500).json({
      message: "HealthCheck: The connection to the data layer is down",
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : error,
    });
  }
});

export default router;
