import express from "express";
import hcController from "@/api/v1/controllers/hcController";
import { globalLimiter } from "@/api/v1/middleware/ratelimit";

const hcRouter = express.Router();

// Apply global rate limiting to health check endpoints
// This allows testing of rate limiting with a lightweight endpoint
hcRouter.get("/app", globalLimiter, hcController.appHealthCheck);
hcRouter.get("/db", globalLimiter, hcController.dbHealthCheck);

export default hcRouter;
