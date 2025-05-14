import request from "supertest";
import express from "express";
import hcController from "../../src/api/controllers/hcController";
import hcRouter from "@/api/routes/hc.routes";

jest.mock("../../src/api/controllers/hcController");

const app = express();
app.use("/healthcheck", hcRouter);

describe("Health Check Router", () => {
  it("should call appHealthCheck controller on GET /healthcheck/app", async () => {
    const mockAppHealthCheck = hcController.appHealthCheck as jest.Mock;
    mockAppHealthCheck.mockImplementation((req, res) =>
      res.status(200).send("App is healthy")
    );

    const response = await request(app).get("/healthcheck/app");

    expect(response.status).toBe(200);
    expect(response.text).toBe("App is healthy");
    expect(mockAppHealthCheck).toHaveBeenCalledTimes(1);
  });

  it("should call dbHealthCheck controller on GET /healthcheck/db", async () => {
    const mockDbHealthCheck = hcController.dbHealthCheck as jest.Mock;
    mockDbHealthCheck.mockImplementation((req, res) =>
      res.status(200).send("DB is healthy")
    );

    const response = await request(app).get("/healthcheck/db");

    expect(response.status).toBe(200);
    expect(response.text).toBe("DB is healthy");
    expect(mockDbHealthCheck).toHaveBeenCalledTimes(1);
  });
});
