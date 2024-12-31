import mongoose from "mongoose";
import { dbConnection, setCorsEnviro } from "../../src/config/setup";
import * as envvars from "../../src/config/envvars";

jest.mock("mongoose");

describe("dbConnection", () => {
  let originalBackend: string | undefined;
  let originalExit: typeof process.exit;
  let mockExit: jest.SpyInstance;

  beforeAll(() => {
    originalBackend = envvars.backend;
    originalExit = process.exit;
    mockExit = jest
      .spyOn(process, "exit")
      .mockImplementation((code?: number) => {
        throw new Error(`process.exit called with ${code}`);
      });
  });

  afterAll(() => {
    (envvars as any).backend = originalBackend;
    mockExit.mockRestore();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // it("should throw an error if backend URL is not provided", async () => {
  //   (envvars as any).backend = undefined;

  //   await expect(dbConnection()).rejects.toThrow("Backend URL not found");

  //   try {
  //     await dbConnection();
  //   } catch (error) {
  //     expect(error).toEqual(new Error("process.exit called with 1"));
  //   }

  //   (envvars as any).backend = originalBackend;
  // });

  // it("should attempt to connect to the database using the provided backend URL", async () => {
  //   const testBackendUrl = "mongodb://localhost:27017/test";

  //   (envvars as any).backend = testBackendUrl;

  //   await dbConnection();

  //   expect(mongoose.connect).toHaveBeenCalledWith(testBackendUrl);

  //   (envvars as any).backend = originalBackend;
  // });

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
