import request from "supertest";
import express from "express";
import hcController from "../../../../src/api/v1/controllers/hcController";
import hcRouter from "@/api/v1/routes/hc.routes";

jest.mock("../../../../src/api/v1/controllers/hcController");

const app = express();
app.use("/healthcheck", hcRouter);

afterEach(() => {
  jest.clearAllMocks();
});

describe("Health Check Router", () => {
  it("should return 200 and message from appHealthCheck on GET /healthcheck/app", async () => {
    const mockAppHealthCheck = hcController.appHealthCheck as jest.Mock;
    mockAppHealthCheck.mockImplementation((req, res) =>
      res.status(200).send("App is healthy")
    );

    const response = await request(app).get("/healthcheck/app");

    expect(response.status).toBe(200);
    expect(response.text).toBe("App is healthy");
    expect(mockAppHealthCheck).toHaveBeenCalledTimes(1);
  });

  it("should return 500 and error message from appHealthCheck on GET /healthcheck/app if controller errors", async () => {
    const mockAppHealthCheck = hcController.appHealthCheck as jest.Mock;
    mockAppHealthCheck.mockImplementation((req, res) =>
      res.status(500).send("Internal Error")
    );

    const response = await request(app).get("/healthcheck/app");

    expect(response.status).toBe(500);
    expect(response.text).toBe("Internal Error");
    expect(mockAppHealthCheck).toHaveBeenCalledTimes(1);
  });

  it("should return 200 and message from dbHealthCheck on GET /healthcheck/db", async () => {
    const mockDbHealthCheck = hcController.dbHealthCheck as jest.Mock;
    mockDbHealthCheck.mockImplementation((req, res) =>
      res.status(200).send("DB is healthy")
    );

    const response = await request(app).get("/healthcheck/db");

    expect(response.status).toBe(200);
    expect(response.text).toBe("DB is healthy");
    expect(mockDbHealthCheck).toHaveBeenCalledTimes(1);
  });

  it("should return 503 and error message from dbHealthCheck on GET /healthcheck/db if controller errors", async () => {
    const mockDbHealthCheck = hcController.dbHealthCheck as jest.Mock;
    mockDbHealthCheck.mockImplementation((req, res) =>
      res.status(503).send("DB Unavailable")
    );

    const response = await request(app).get("/healthcheck/db");

    expect(response.status).toBe(503);
    expect(response.text).toBe("DB Unavailable");
    expect(mockDbHealthCheck).toHaveBeenCalledTimes(1);
  });
});
