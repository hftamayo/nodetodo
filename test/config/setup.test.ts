import mongoose from "mongoose";
import { dbConnection, setCorsEnviro } from "../../src/config/setup";
import * as envvars from "../../src/config/envvars";

jest.mock("mongoose");

describe("dbConnection", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw an error if backend URL is not provided", async () => {
    const originalBackend = envvars.backend;
    jest.spyOn(envvars, "backend", "get").mockReturnValue(undefined);

    await expect(dbConnection()).rejects.toThrow("Backend URL not found");

    jest.spyOn(envvars, "backend", "get").mockReturnValue(originalBackend);
  });

  it("should attempt to connect to the database using the provided backend URL", async () => {
    const originalBackend = envvars.backend;
    const testBackendUrl = "mongodb://localhost:27017/test";

    jest.spyOn(envvars, "backend", "get").mockReturnValue(testBackendUrl);

    await dbConnection();

    expect(mongoose.connect).toHaveBeenCalledWith(testBackendUrl);

    jest.spyOn(envvars, "backend", "get").mockReturnValue(originalBackend);
  });

  it("should log an error and exit the process if the connection fails", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();
    const processSpy = jest.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit called");
    });

    (mongoose.connect as jest.Mock).mockImplementationOnce(() => {
      throw new Error("Connection failed");
    });

    await expect(dbConnection()).rejects.toThrow("process.exit called");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Database connection error: Connection failed"
    );
    expect(processSpy).toHaveBeenCalledWith(1);

    consoleSpy.mockRestore();
    processSpy.mockRestore();
  });
});

describe("setCorsEnviro", () => {
  it("should allow requests from whitelisted origins", () => {
    const origin = envvars.whitelist_frontend[0];
    const callback = jest.fn();

    setCorsEnviro.origin(origin, callback);

    expect(callback).toHaveBeenCalledWith(null, true);
  });

  it("should deny requests from non-whitelisted origins", () => {
    const origin = "http://non-whitelisted-origin.com";
    const callback = jest.fn();

    setCorsEnviro.origin(origin, callback);

    expect(callback).toHaveBeenCalledWith(
      new Error(`CORS requested from origin: ${origin} denied`),
      false
    );
  });

  it("should allow requests with no origin (e.g., same-origin requests)", () => {
    const callback = jest.fn();

    setCorsEnviro.origin(undefined, callback);

    expect(callback).toHaveBeenCalledWith(null, true);
  });
});
