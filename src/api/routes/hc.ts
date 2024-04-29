import express from "express";
import hcController from "../controllers/hcController";

const router = express.Router();

router.get("/app", hcController.appHealthCheck);
router.get("/db", hcController.dbHealthCheck);

export default router;
