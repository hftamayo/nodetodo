import express from "express";
import hcController from "../controllers/hcController";

const hcRouter = express.Router();

hcRouter.get("/app", hcController.appHealthCheck);
hcRouter.get("/db", hcController.dbHealthCheck);

export default hcRouter;
