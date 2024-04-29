import express, {Request, Response} from "express";
import { dbConnection } from "../../config/setup";

const router = express.Router();

router.get("/app", (req: Request, res: Response) => {
  res.status(200).json({
    message: "HealthCheck: Application is up and running",
    timestamp: new Date().toISOString(),
  });
});

router.get("/db", async (req: Request, res: Response) => {
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
