import mongoose from "mongoose";
import { dbConnection, setCorsEnviro } from "../../src/config/setup";
import * as envvars from "../../src/config/envvars";

jest.mock("mongoose");

describe("dbConnection", () => {
  let originalBackend: string | undefined;
  let originalExit: typeof process.exit;
  let mockExit: jest.SpyInstance;
  let originalConsoleLog: typeof console.log;

  beforeAll(() => {
    originalBackend = envvars.backend;
    originalExit = process.exit;
    originalConsoleLog = console.log;
    mockExit = jest
      .spyOn(process, "exit")
      .mockImplementation((code?: number) => {
        throw new Error(`process.exit called with ${code}`);
      });
  });

  afterAll(() => {
    (envvars as any).backend = originalBackend;
    mockExit.mockRestore();
    console.log = originalConsoleLog;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should throw and exit if backend URL is not provided", async () => {
    (envvars as any).backend = undefined;
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();
    await expect(dbConnection()).rejects.toThrow("process.exit called with 1");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Fatal: could not connect with the data layer: Backend URL not found"
    );
    consoleSpy.mockRestore();
    (envvars as any).backend = originalBackend;
  });

  it("should attempt to connect to the database using the provided backend URL", async () => {
    const testBackendUrl = "mongodb://localhost:27017/test";
    (envvars as any).backend = testBackendUrl;
    (mongoose.connect as jest.Mock).mockResolvedValueOnce(undefined);
    const dbOn = jest.fn();
    const dbOnce = jest.fn((event, cb) => {
      if (event === "open") cb();
    });
    (mongoose as any).connection = { on: dbOn, once: dbOnce };
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();
    await dbConnection();
    expect(mongoose.connect).toHaveBeenCalledWith(testBackendUrl);
    expect(dbOn).toHaveBeenCalledWith("error", expect.any(Function));
    expect(dbOnce).toHaveBeenCalledWith("open", expect.any(Function));
    expect(consoleSpy).toHaveBeenCalledWith(
      expect.stringContaining("Connected to the Remote Dataset in")
    );
    consoleSpy.mockRestore();
    (envvars as any).backend = originalBackend;
  });

  it("should log an error and exit the process if the connection fails", async () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation();
    const processSpy = jest.spyOn(process, "exit").mockImplementation(() => {
      throw new Error("process.exit called");
    });
    (envvars as any).backend = "mongodb://localhost:27017/test";
    (mongoose.connect as jest.Mock).mockImplementationOnce(() => {
      throw new Error("Connection failed");
    });
    await expect(dbConnection()).rejects.toThrow("process.exit called");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Fatal: could not connect with the data layer: Connection failed"
    );
    expect(processSpy).toHaveBeenCalledWith(1);
    consoleSpy.mockRestore();
    processSpy.mockRestore();
    (envvars as any).backend = originalBackend;
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
